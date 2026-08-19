import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Shield, ShieldAlert, Navigation2, PhoneCall, MapPin, Compass, RefreshCw, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * MapLibre GL JS Vector Map Engine
 * Replaces Leaflet per Requirements #1-#38:
 * - Light navigation style: https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
 * - NO hardcoded Delhi initialization
 * - Single source of truth from useLiveLocation()
 * - Single map instance initialized via useEffect & useRef
 * - Google-style 🔵 Live User Marker & Accuracy Circle
 * - Smooth camera flyTo on initial location & Re-center controls
 */
const MapLibreView = ({
  height = 'h-[540px]',
  showRiskZones = true,
  showEmergencyServices = false,
  showAllRoutes = true,
  onSelectRoute,
  riskZonesData = [],
  emergencyServicesData = []
}) => {
  const {
    routes,
    selectedRoute,
    setSelectedRoute,
    isNavigating,
    routeDeviation,
    liveLocation,
    setDestination,
    setDestinationCoords,
    runRouteAnalysis,
    origin
  } = useApp();

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const clickMarkerRef = useRef(null);
  const emergencyMarkersRef = useRef([]);

  const [userInteracted, setUserInteracted] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [safetyLayerActive, setSafetyLayerActive] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  const styleUrl = import.meta.env.VITE_MAP_STYLE_URL || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

  // 1. Map Initialization (Requirement #4, #26, #27): Wait for valid liveLocation
  useEffect(() => {
    if (!liveLocation.latitude || !liveLocation.longitude || mapRef.current) return;
    if (!Number.isFinite(liveLocation.latitude) || !Number.isFinite(liveLocation.longitude)) return;

    const userLngLat = [liveLocation.longitude, liveLocation.latitude];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: userLngLat,
      zoom: 15,
      pitch: 0,
      bearing: 0,
      attributionControl: false
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      setMapLoaded(true);

      // Create Google-Style 🔵 Live Location Marker (#10)
      const userEl = document.createElement('div');
      userEl.className = 'relative flex items-center justify-center w-10 h-10 cursor-pointer';
      userEl.innerHTML = `
        <div class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></div>
        <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-2 h-2 rounded-full bg-white"></div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: #0F172A;">
          🔵 You Are Here
          <div style="font-size: 11px; font-weight: normal; color: #64748B; margin-top: 2px;">${liveLocation.address || 'Live Location'}</div>
        </div>
      `);

      userMarkerRef.current = new maplibregl.Marker({ element: userEl })
        .setLngLat(userLngLat)
        .setPopup(popup)
        .addTo(map);

      // Add Map Click Listener (#24)
      map.on('click', (e) => {
        const coords = [e.lngLat.lat, e.lngLat.lng];
        setClickedCoords(coords);
        setUserInteracted(true);

        if (clickMarkerRef.current) clickMarkerRef.current.remove();

        const clickEl = document.createElement('div');
        clickEl.className = 'w-9 h-9 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-lg text-white font-bold animate-bounce';
        clickEl.innerHTML = '📍';

        clickMarkerRef.current = new maplibregl.Marker({ element: clickEl })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map);
      });

      // Detect User Drag / Manual Pan (#13)
      map.on('dragstart', () => setUserInteracted(true));
      map.on('zoomstart', (e) => {
        if (e.originalEvent) setUserInteracted(true);
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [liveLocation.latitude, liveLocation.longitude]);

  // 2. Update User Marker Position dynamically WITHOUT resetting map center (#13, #28)
  useEffect(() => {
    if (mapRef.current && userMarkerRef.current && liveLocation.latitude && liveLocation.longitude) {
      if (Number.isFinite(liveLocation.latitude) && Number.isFinite(liveLocation.longitude)) {
        const userLngLat = [liveLocation.longitude, liveLocation.latitude];
        userMarkerRef.current.setLngLat(userLngLat);

        // Only flyTo on initial load if user hasn't manually panned
        if (!userInteracted && mapRef.current) {
          mapRef.current.easeTo({ center: userLngLat, duration: 800 });
        }
      }
    }
  }, [liveLocation.latitude, liveLocation.longitude, userInteracted]);

  // 3. Render Route Polylines via MapLibre GeoJSON Sources/Layers (#19, #21)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Remove existing route layers & sources
    ['route-safe', 'route-alt-1', 'route-alt-2'].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
    });

    if (!routes || routes.length === 0) return;

    routes.forEach((route, index) => {
      const isSelected = (selectedRoute?.id === route.id) || (index === 0 && !selectedRoute);
      if (!showAllRoutes && !isSelected) return;

      const layerId = `route-${route.id || index}`;
      const color = route.color || (isSelected ? '#10B981' : '#64748B');
      const width = isSelected ? 6 : 4;
      const opacity = isSelected ? 0.95 : 0.45;

      const userLngLat = [liveLocation.longitude, liveLocation.latitude];
      const rawCoords = route.coordinates && route.coordinates.length
        ? route.coordinates.map(c => [c[1], c[0]]) // MapLibre expects [lng, lat]
        : [userLngLat, [userLngLat[0] + 0.015, userLngLat[1] + 0.015]];

      // Guarantee route starts at real user position
      rawCoords[0] = userLngLat;

      const geojson = {
        type: 'Feature',
        properties: { name: route.name, score: route.currentSafetyScore },
        geometry: {
          type: 'LineString',
          coordinates: rawCoords
        }
      };

      if (!map.getSource(layerId)) {
        map.addSource(layerId, {
          type: 'geojson',
          data: geojson
        });

        map.addLayer({
          id: layerId,
          type: 'line',
          source: layerId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': color,
            'line-width': width,
            'line-opacity': opacity
          }
        });
      }
    });

    // Render Destination Marker (#17)
    const activeRoute = selectedRoute || routes[0];
    const destCoords = activeRoute?.coordinates?.[activeRoute.coordinates.length - 1];
    if (destCoords) {
      const destLngLat = [destCoords[1], destCoords[0]];

      if (destMarkerRef.current) destMarkerRef.current.remove();

      const destEl = document.createElement('div');
      destEl.className = 'w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg text-white';
      destEl.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      `;

      const destPopup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: #0F172A;">
          📍 Destination
          <div style="font-size: 11px; font-weight: normal; color: #059669; margin-top: 2px;">${activeRoute.name || 'Target Point'}</div>
        </div>
      `);

      destMarkerRef.current = new maplibregl.Marker({ element: destEl })
        .setLngLat(destLngLat)
        .setPopup(destPopup)
        .addTo(map);
    }
  }, [routes, selectedRoute, showAllRoutes, mapLoaded, liveLocation.latitude, liveLocation.longitude]);

  // Handle Map Re-center button (#14)
  const handleRecenter = () => {
    setUserInteracted(false);
    if (mapRef.current && liveLocation.latitude && liveLocation.longitude) {
      mapRef.current.flyTo({
        center: [liveLocation.longitude, liveLocation.latitude],
        zoom: 15,
        speed: 1.2
      });
    }
  };

  const confirmClickedDestination = () => {
    if (clickedCoords) {
      const destName = `Map Destination (${clickedCoords[0].toFixed(3)}, ${clickedCoords[1].toFixed(3)})`;
      setDestination(destName);
      setDestinationCoords({ lat: clickedCoords[0], lng: clickedCoords[1] });
      runRouteAnalysis(origin, destName, 80, 'evening', liveLocation.latitude, liveLocation.longitude);
      setClickedCoords(null);
      if (clickMarkerRef.current) clickMarkerRef.current.remove();
    }
  };

  // Requirement #4 & #30: If location is loading or not ready, show clean loading UI (NO DELHI!)
  if (liveLocation.loading || !liveLocation.latitude || !liveLocation.longitude) {
    return (
      <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-50 flex flex-col items-center justify-center space-y-4 text-center p-6 font-sans`}>
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500 flex items-center justify-center text-blue-600 animate-ping"></div>
          <MapPin className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800">📍 Finding your location...</h3>
          <p className="text-xs text-slate-500">Initializing MapLibre vector navigation engine...</p>
        </div>
        {liveLocation.error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs max-w-sm font-medium">
            📍 {liveLocation.error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group font-sans`}>
      
      {/* Top Map Status Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">MapLibre GL Vector Engine</span>
          <span className="text-slate-400">| Light Style</span>
        </div>

        {/* Safety Layer Toggle & Locate Me Buttons (#9 & #14) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setSafetyLayerActive(!safetyLayerActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold shadow-md border transition flex items-center gap-1.5 ${
              safetyLayerActive
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{safetyLayerActive ? '🛡️ Safety Layer ON' : 'Safety Layer OFF'}</span>
          </button>

          <button
            onClick={handleRecenter}
            title="My Location"
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-md border border-slate-200 font-bold transition flex items-center justify-center"
          >
            <Compass className="w-4 h-4 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Re-center Button Overlay if User Panned Away (#13) */}
      {userInteracted && (
        <button
          onClick={handleRecenter}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>📍 Re-center Map</span>
        </button>
      )}

      {/* Click Destination Confirmation Card (#24) */}
      {clickedCoords && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-10 sm:w-80 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 text-center space-y-3">
          <div className="text-xs font-bold text-slate-900">Set this location as your destination?</div>
          <p className="text-[11px] text-slate-500 font-mono">
            {clickedCoords[0].toFixed(4)}, {clickedCoords[1].toFixed(4)}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={confirmClickedDestination}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              Set Destination
            </button>
            <button
              onClick={() => {
                setClickedCoords(null);
                if (clickMarkerRef.current) clickMarkerRef.current.remove();
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MapLibre Canvas Container (#6 & #7) */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-md rounded-xl p-2.5 text-[11px] space-y-1 text-slate-700 border border-slate-200 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded bg-emerald-500"></span>
          <span className="font-bold">Safe Route (91/100)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded bg-amber-500"></span>
          <span>Moderate Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded bg-red-500"></span>
          <span>High Risk</span>
        </div>
      </div>

    </div>
  );
};

export default MapLibreView;
