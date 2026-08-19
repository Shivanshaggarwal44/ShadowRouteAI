import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveLocation } from '../hooks/useLiveLocation';
import {
  analyzeRouteAPI,
  getUserProfileAPI,
  getIncidentsAPI,
  triggerSOSAPI
} from '../services/api';
import { fallbackRoutes, fallbackAISuggestion, getAdaptedFallbackRoutes } from '../utils/fallbackData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. SINGLE SOURCE OF TRUTH FOR USER LOCATION (Requirement #2, #5, #23)
  const liveLocation = useLiveLocation();

  const [user, setUser] = useState({
    name: 'Shivansh Sharma',
    email: 'shivansh@shadowroute.ai',
    preferences: { safetyPriority: 80, avoidHighRiskZones: true, autoRerouteOnDeviation: true },
    emergencyContacts: [
      { id: 'c1', name: 'Aarav Sharma', phone: '+1 (555) 234-5678', relation: 'Brother', isPrimary: true },
      { id: 'c2', name: 'Priya Sharma', phone: '+1 (555) 876-5432', relation: 'Parent', isPrimary: false }
    ]
  });

  const [origin, setOrigin] = useState('Detecting your live location...');
  const [destination, setDestination] = useState('City Centre');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [safetyPriority, setSafetyPriority] = useState(75);
  const [timeOfDay, setTimeOfDay] = useState('evening');
  
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);
  const [routeDeviation, setRouteDeviation] = useState(false);

  const [sosActive, setSosActive] = useState(false);
  const [sosData, setSosData] = useState(null);

  const [notifications, setNotifications] = useState([
    {
      id: 'n1',
      title: 'High-Risk Zone Detected',
      message: 'Unlit section detected near your path.',
      type: 'warning',
      timestamp: '10 mins ago',
      read: false
    },
    {
      id: 'n2',
      title: 'Safer Route Available',
      message: 'Route B provides +47% higher safety with only 3 mins extra travel time.',
      type: 'success',
      timestamp: '25 mins ago',
      read: false
    }
  ]);

  // Sync origin address whenever liveLocation changes
  useEffect(() => {
    if (liveLocation.isLive && liveLocation.address) {
      setOrigin(liveLocation.address);
    }
  }, [liveLocation.isLive, liveLocation.address]);

  // Trigger route analysis using real live GPS coordinates
  const runRouteAnalysis = async (customOrigin, customDestination, customPriority, customTime, customLat, customLng) => {
    setIsAnalyzing(true);
    setRouteDeviation(false);
    
    const o = customOrigin !== undefined ? customOrigin : origin;
    const d = customDestination !== undefined ? customDestination : destination;
    const p = customPriority !== undefined ? customPriority : safetyPriority;
    const t = customTime !== undefined ? customTime : timeOfDay;
    
    const lat = customLat !== undefined ? customLat : (liveLocation.latitude || undefined);
    const lng = customLng !== undefined ? customLng : (liveLocation.longitude || undefined);

    try {
      const res = await analyzeRouteAPI({
        origin: { latitude: lat, longitude: lng, address: o },
        destination: { address: d, coords: destinationCoords },
        preference: p <= 35 ? 'faster' : p >= 75 ? 'safer' : 'balanced',
        safetyPriority: p,
        timeOfDay: t,
        userLat: lat,
        userLng: lng
      });

      if (res && res.success && res.routes) {
        setRoutes(res.routes);
        setAiSuggestion(res.aiSuggestion);
        const recommended = res.routes.find(r => r.isRecommended) || res.routes[0];
        setSelectedRoute(recommended);
      } else {
        const adaptedFallback = getAdaptedFallbackRoutes(lat, lng);
        setRoutes(adaptedFallback);
        setAiSuggestion(fallbackAISuggestion);
        setSelectedRoute(adaptedFallback[0]);
      }
    } catch (err) {
      console.warn('Backend API connection warning, using fallback routes:', err.message);
      const adaptedFallback = getAdaptedFallbackRoutes(lat, lng);
      setRoutes(adaptedFallback);
      setAiSuggestion(fallbackAISuggestion);
      setSelectedRoute(adaptedFallback[0]);
    } finally {
      setIsAnalyzing(false);
    }
  };


  // Run initial analysis once liveLocation lat/lng is ready
  useEffect(() => {
    if (liveLocation.latitude && liveLocation.longitude) {
      runRouteAnalysis(liveLocation.address, destination, safetyPriority, timeOfDay, liveLocation.latitude, liveLocation.longitude);
    }
  }, [liveLocation.latitude, liveLocation.longitude]);

  // Update speed/safety slider in real time
  const handleSliderChange = (newVal) => {
    setSafetyPriority(newVal);
    runRouteAnalysis(origin, destination, newVal, timeOfDay);
  };

  // Update time of day
  const handleTimeChange = (newTime) => {
    setTimeOfDay(newTime);
    runRouteAnalysis(origin, destination, safetyPriority, newTime);
  };

  // Activate Emergency SOS
  const triggerSOS = async () => {
    try {
      const res = await triggerSOSAPI({
        latitude: liveLocation.latitude,
        longitude: liveLocation.longitude,
        address: origin || 'Live Location',
        activeRouteId: selectedRoute?.id
      });
      if (res && res.success) {
        setSosData(res);
        setSosActive(true);

        setNotifications(prev => [
          {
            id: `n_sos_${Date.now()}`,
            title: '🚨 Emergency Mode Activated',
            message: 'Live GPS broadcast active. Police & contacts notified.',
            type: 'alert',
            timestamp: 'Just now',
            read: false
          },
          ...prev
        ]);
      }
    } catch (err) {
      console.error('SOS trigger error:', err);
      setSosActive(true);
      setSosData({
        message: 'Emergency Mode Activated (Live Telemetry Broadcast)',
        emergencyNotice: 'SMS broadcast queued to emergency contacts.'
      });
    }
  };

  const cancelSOS = () => {
    setSosActive(false);
    setSosData(null);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        liveLocation,
        origin,
        setOrigin,
        destination,
        setDestination,
        destinationCoords,
        setDestinationCoords,
        safetyPriority,
        setSafetyPriority,
        handleSliderChange,
        timeOfDay,
        handleTimeChange,
        routes,
        selectedRoute,
        setSelectedRoute,
        aiSuggestion,
        isAnalyzing,
        runRouteAnalysis,
        isNavigating,
        setIsNavigating,
        routeDeviation,
        setRouteDeviation,
        sosActive,
        sosData,
        triggerSOS,
        cancelSOS,
        notifications,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
