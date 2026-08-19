import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ShadowRoute AI Single Source of Truth for Live Browser Geolocation
 * Follows Requirement #2 & #5:
 * - Uses navigator.geolocation.getCurrentPosition() & watchPosition()
 * - Options: enableHighAccuracy: true, timeout: 15000, maximumAge: 5000
 * - Handles errors gracefully (Permission Denied, Position Unavailable, Timeout)
 * - Reverse geocodes via OpenStreetMap Nominatim API
 * - Cleans up watcher on unmount
 */
export const useLiveLocation = () => {
  const [locationState, setLocationState] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
    errorType: null, // 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'NOT_SUPPORTED'
    isLive: false,
    address: 'Detecting your live location...',
    lastUpdated: null
  });

  const watchIdRef = useRef(null);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'en' }
      });
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name.split(',').slice(0, 3).join(', ');
      }
    } catch (err) {
      console.warn('Reverse geocoding warning:', err.message);
    }
    return `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  };

  const handleSuccess = useCallback(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    const formattedAddress = await fetchAddress(lat, lng);

    setLocationState({
      latitude: lat,
      longitude: lng,
      accuracy: Math.round(accuracy),
      loading: false,
      error: null,
      errorType: null,
      isLive: true,
      address: formattedAddress,
      lastUpdated: new Date().toLocaleTimeString()
    });
  }, []);

  const handleError = useCallback((err) => {
    let message = 'Location detection failed.';
    let type = 'POSITION_UNAVAILABLE';

    if (err.code === err.PERMISSION_DENIED) {
      message = 'Location permission was denied. Please allow location access in your browser settings.';
      type = 'PERMISSION_DENIED';
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      message = 'Your device could not determine its location. Please check GPS/location services.';
      type = 'POSITION_UNAVAILABLE';
    } else if (err.code === err.TIMEOUT) {
      message = 'Location detection timed out. Please try clicking "Locate Me".';
      type = 'TIMEOUT';
    }

    setLocationState(prev => ({
      ...prev,
      loading: false,
      error: message,
      errorType: type,
      isLive: false
    }));
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation is not supported by your browser.',
        errorType: 'NOT_SUPPORTED'
      }));
      return;
    }

    setLocationState(prev => ({ ...prev, loading: true }));

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000
    };

    // Initial position fetch
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);

    // Continuous watch position
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);
  }, [handleSuccess, handleError]);

  useEffect(() => {
    startWatching();

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [startWatching]);

  return {
    ...locationState,
    refreshLocation: startWatching
  };
};
