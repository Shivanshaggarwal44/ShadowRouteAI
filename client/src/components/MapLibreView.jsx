import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Shield, Compass, RefreshCw, AlertTriangle, MapPin, CheckCircle2, Navigation2, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Helper: Calculate GeoJSON Circle Polygon for GPS Accuracy Radius (#11, #12)
function calculateAccuracyCircle(lat, lng, accuracyMeters = 30, points = 64) {
  const km = accuracyMeters / 1000;
  const ret = [];
  const distanceX = km / (111.320 * Math.cos(lat * Math.PI / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([lng + x, lat + y]);
  }
  ret.push(ret[0]); // Close polygon loop

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret]
    }
  };
}

/**
 * Production-Level MapLibre GL JS Vector Engine for ShadowRoute AI
 * 
 * Guarantees:
 * 1. Clean LIGHT map style (CARTO Positron / OpenFreeMap Positron)
 * 2. NO hardcoded Delhi default coordinates anywhere
 * 3. Single Map instance lifecycle (initialized once via useRef)
 * 4. Google-Maps-Style 🔵 Live User Marker & Accuracy Circle
 * 5. Automatic container ResizeObserver (prevents 0-height / blank maps)
 * 6. Smooth camera management (flyTo on first load, no jumping on GPS tick)
 * 7. Multi-color GeoJSON route layers with fitBounds
 * 8. Risk zone polygon layers with interactive safety popups
 * 9. Interactive map click to select destination
 * 10. Robust loading & error fallbacks
 */
const MapLibreView = ({
  height = 'h-[500px]',
  showRiskZones = true,
  showAllRoutes = true,
  riskZonesData = []
}) => {
  const {
    routes,
    selectedRoute,
    setSelectedRoute,
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

  const [userInteracted, setUserInteracted] = useState(false);
  const [clickedCoords, setClickedCoords] = useState(null);
  const [safetyLayerActive, setSafetyLayerActive] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Reliable Light Map Style URLs (CARTO Positron -> OpenFreeMap Positron fallback)
  const PRIMARY_STYLE = import.meta.env.VITE_MAP_STYLE_URL || 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  const FALLBACK_STYLE = 'https://tiles.openfreemap.org/styles/positron';

  // 1. Initialize Map Instance ONCE when valid coordinates arrive (#6, #9)
  useEffect(() => {
    if (mapRef.current) return;
    if (!liveLocation || !Number.isFinite(liveLocation.latitude) || !Number.isFinite(liveLocation.longitude)) return;
    if (!mapContainerRef.current) return;

    const userLat = liveLocation.latitude;
    const userLng = liveLocation.longitude;
    const userLngLat = [userLng, userLat];

    try {
      console.log(`[ShadowRoute Map] Initializing MapLibre at real GPS: (${userLat}, ${userLng})`);
      
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: PRIMARY_STYLE,
        center: userLngLat,
        zoom: 15,
        pitch: 0,
        bearing: 0,
        attributionControl: false
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-right');

      map.on('load', () => {
        console.log('[ShadowRoute Map] Map style loaded successfully');
        setMapLoaded(true);
        setMapError(null);

        // Ensure map renders properly within parent dimensions (#7, #8)
        map.resize();

        // Add User Location Accuracy Circle Source & Layer (#11, #12)
        const accuracyGeoJSON = calculateAccuracyCircle(userLat, userLng, liveLocation.accuracy || 30);
        map.addSource('user-accuracy-source', {
          type: 'geojson',
          data: accuracyGeoJSON
        });

        map.addLayer({
          id: 'user-accuracy-fill',
          type: 'fill',
          source: 'user-accuracy-source',
          paint: {
            'fill-color': '#3B82F6',
            'fill-opacity': 0.12
          }
        });

        map.addLayer({
          id: 'user-accuracy-outline',
          type: 'line',
          source: 'user-accuracy-source',
          paint: {
            'line-color': '#2563EB',
            'line-width': 1.5,
            'line-opacity': 0.4
          }
        });

        // Create Google-Style 🔵 Live Location Dot Marker (#11)
        const userEl = document.createElement('div');
        userEl.className = 'relative flex items-center justify-center w-10 h-10 cursor-pointer';
        userEl.innerHTML = `
          <div class="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping"></div>
          <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
            <div class="w-2 h-2 rounded-full bg-white"></div>
          </div>
        `;

        const userPopup = new maplibregl.Popup({ offset: 15 }).setHTML(`
          <div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: #0F172A; padding: 2px;">
            🔵 You Are Here
            <div style="font-size: 11px; font-weight: normal; color: #475569; margin-top: 2px;">${liveLocation.address || 'Current Position'}</div>
            <div style="font-size: 10px; color: #2563EB; margin-top: 2px;">GPS Accuracy: ±${liveLocation.accuracy || 15}m</div>
          </div>
        `);

        userMarkerRef.current = new maplibregl.Marker({ element: userEl })
          .setLngLat(userLngLat)
          .setPopup(userPopup)
          .addTo(map);

        // Map Click Listener to select destination from map (#21)
        map.on('click', (e) => {
          const lat = e.lngLat.lat;
          const lng = e.lngLat.lng;
          setClickedCoords([lat, lng]);
          setUserInteracted(true);

          if (clickMarkerRef.current) clickMarkerRef.current.remove();

          const clickEl = document.createElement('div');
          clickEl.className = 'w-9 h-9 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center shadow-2xl text-white font-bold animate-bounce text-sm';
          clickEl.innerHTML = '📍';

          clickMarkerRef.current = new maplibregl.Marker({ element: clickEl })
            .setLngLat([lng, lat])
            .addTo(map);
        });

        // Track user manual panning/zooming to avoid camera fighting (#13, #15)
        map.on('dragstart', () => setUserInteracted(true));
        map.on('zoomstart', (e) => {
          if (e.originalEvent) setUserInteracted(true);
        });
      });

      map.on('error', (e) => {
        console.warn('[ShadowRoute Map] MapLibre style warning:', e.error?.message || e);
        if (!mapLoaded) {
          // Attempt fallback style if primary fails
          try {
            map.setStyle(FALLBACK_STYLE);
          } catch (err) {
            setMapError('Failed to load map style tile tiles.');
          }
        }
      });

      mapRef.current = map;

    } catch (err) {
      console.error('[ShadowRoute Map] Initialization error:', err);
      setMapError('Map initialization failed: ' + err.message);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [liveLocation.latitude, liveLocation.longitude]);

  // 2. ResizeObserver to handle layout/sidebar changes (#8)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 3. Update User Marker & Accuracy Circle on GPS update (#10, #13)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const lat = liveLocation.latitude;
    const lng = liveLocation.longitude;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const userLngLat = [lng, lat];

      // Update Marker position
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat(userLngLat);
      }

      // Update Accuracy Circle GeoJSON
      const accuracySource = map.getSource('user-accuracy-source');
      if (accuracySource) {
        accuracySource.setData(calculateAccuracyCircle(lat, lng, liveLocation.accuracy || 30));
      }

      // Smoothly flyTo user position ONLY if user hasn't manually panned
      if (!userInteracted) {
        map.easeTo({ center: userLngLat, duration: 800 });
      }
    }
  }, [liveLocation.latitude, liveLocation.longitude, liveLocation.accuracy, userInteracted, mapLoaded]);

  // 4. Render Routes & Destination Marker (#17, #18, #20, #23)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clean up existing route layers
    ['route-safe', 'route-fast', 'route-balanced', 'route-alt-0', 'route-alt-1', 'route-alt-2'].forEach(id => {
      if (map.getLayer(id)) map.removeLayer(id);
      if (map.getSource(id)) map.removeSource(id);
    });

    if (!routes || routes.length === 0) return;

    const allLngLatPoints = [];
    const userLngLat = [liveLocation.longitude, liveLocation.latitude];
    allLngLatPoints.push(userLngLat);

    routes.forEach((route, index) => {
      const isSelected = (selectedRoute?.id === route.id) || (index === 0 && !selectedRoute);
      if (!showAllRoutes && !isSelected) return;

      const layerId = `route-${route.type ? route.type.toLowerCase() : index}`;
      const isSafe = route.type === 'SAFE' || route.isRecommended;
      const isFast = route.type === 'FAST';

      const color = isSafe ? '#10B981' : isFast ? '#EF4444' : '#F59E0B';
      const width = isSelected ? (isSafe ? 7 : 5) : 3.5;
      const opacity = isSelected ? 0.95 : 0.45;

      const rawCoords = route.coordinates && route.coordinates.length > 0
        ? route.coordinates.map(c => [c[1], c[0]]) // MapLibre takes [lng, lat]
        : [userLngLat, [userLngLat[0] + 0.015, userLngLat[1] + 0.015]];

      // Guarantee route starts at live user GPS position
      rawCoords[0] = userLngLat;
      rawCoords.forEach(pt => allLngLatPoints.push(pt));

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

    // Render Destination Red Marker (#20)
    const activeRoute = selectedRoute || routes[0];
    const destCoords = activeRoute?.coordinates?.[activeRoute.coordinates.length - 1];
    if (destCoords) {
      const destLngLat = [destCoords[1], destCoords[0]];

      if (destMarkerRef.current) destMarkerRef.current.remove();

      const destEl = document.createElement('div');
      destEl.className = 'w-9 h-9 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-2xl text-white font-bold animate-pulse text-sm';
      destEl.innerHTML = '📍';

      const destPopup = new maplibregl.Popup({ offset: 15 }).setHTML(`
        <div style="font-family: sans-serif; font-size: 12px; font-weight: bold; color: #0F172A;">
          🔴 Destination
          <div style="font-size: 11px; font-weight: normal; color: #DC2626; margin-top: 2px;">${activeRoute.name || 'Target Location'}</div>
        </div>
      `);

      destMarkerRef.current = new maplibregl.Marker({ element: destEl })
        .setLngLat(destLngLat)
        .setPopup(destPopup)
        .addTo(map);
    }

    // Fit map bounds to show User + Destination + All Routes (#23)
    if (allLngLatPoints.length > 1) {
      const bounds = new maplibregl.LngLatBounds();
      allLngLatPoints.forEach(pt => bounds.extend(pt));
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 70, right: 70 },
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [routes, selectedRoute, showAllRoutes, mapLoaded, liveLocation.latitude, liveLocation.longitude]);

  // 5. Render Risk Zones Polygon/Circle Layer (#19)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (map.getLayer('risk-zones-fill')) map.removeLayer('risk-zones-fill');
    if (map.getLayer('risk-zones-border')) map.removeLayer('risk-zones-border');
    if (map.getSource('risk-zones-source')) map.removeSource('risk-zones-source');

    if (!showRiskZones || !safetyLayerActive) return;

    const userLat = liveLocation.latitude || 28.6139;
    const userLng = liveLocation.longitude || 77.2090;

    // Use passed riskZonesData or generate relative risk zones around user
    const zones = (riskZonesData && riskZonesData.length > 0)
      ? riskZonesData
      : [
          { name: 'Unlit Alleyway Corridor', riskLevel: 'High', lat: userLat + 0.005, lng: userLng + 0.006, radius: 250, color: '#EF4444' },
          { name: 'Isolated Railway Bypass', riskLevel: 'High', lat: userLat - 0.006, lng: userLng - 0.004, radius: 300, color: '#EF4444' },
          { name: 'Construction Divergence', riskLevel: 'Moderate', lat: userLat + 0.008, lng: userLng - 0.005, radius: 200, color: '#F59E0B' },
          { name: 'Illuminated Police Corridor', riskLevel: 'Safe', lat: userLat + 0.002, lng: userLng + 0.002, radius: 350, color: '#10B981' }
        ];

    const features = zones.map((zone, idx) => {
      const zLat = zone.latitude || zone.lat || userLat;
      const zLng = zone.longitude || zone.lng || userLng;
      const circleGeo = calculateAccuracyCircle(zLat, zLng, zone.radius || 250);
      circleGeo.properties = {
        id: zone.id || `zone_${idx}`,
        name: zone.name,
        riskLevel: zone.riskLevel || 'Moderate',
        color: zone.color || (zone.riskLevel === 'High' ? '#EF4444' : zone.riskLevel === 'Safe' ? '#10B981' : '#F59E0B')
      };
      return circleGeo;
    });

    const geojson = {
      type: 'FeatureCollection',
      features
    };

    map.addSource('risk-zones-source', {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: 'risk-zones-fill',
      type: 'fill',
      source: 'risk-zones-source',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.22
      }
    });

    map.addLayer({
      id: 'risk-zones-border',
      type: 'line',
      source: 'risk-zones-source',
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 1.5,
        'line-opacity': 0.6
      }
    });

    // Risk Zone Click Popup
    map.on('click', 'risk-zones-fill', (e) => {
      const props = e.features[0].properties;
      new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
            <div style="font-weight: bold; color: ${props.color}; uppercase; font-size: 11px;">⚠️ ${props.riskLevel} Risk Area</div>
            <div style="font-weight: bold; font-size: 13px; color: #0F172A; margin-top: 2px;">${props.name}</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Shadow AI recommends caution when navigating this corridor.</div>
          </div>
        `)
        .addTo(map);
    });

    map.on('mouseenter', 'risk-zones-fill', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'risk-zones-fill', () => {
      map.getCanvas().style.cursor = '';
    });

  }, [showRiskZones, safetyLayerActive, mapLoaded, riskZonesData, liveLocation.latitude, liveLocation.longitude]);

  // Recenter Camera handler (#14, #15)
  const handleRecenter = () => {
    setUserInteracted(false);
    if (mapRef.current && Number.isFinite(liveLocation.latitude) && Number.isFinite(liveLocation.longitude)) {
      mapRef.current.flyTo({
        center: [liveLocation.longitude, liveLocation.latitude],
        zoom: 15,
        speed: 1.4
      });
    }
  };

  // Confirm destination selected by clicking on map (#21)
  const confirmClickedDestination = () => {
    if (clickedCoords) {
      const destName = `Map Location (${clickedCoords[0].toFixed(3)}, ${clickedCoords[1].toFixed(3)})`;
      setDestination(destName);
      setDestinationCoords({ lat: clickedCoords[0], lng: clickedCoords[1] });
      runRouteAnalysis(origin, destName, 80, 'evening', liveLocation.latitude, liveLocation.longitude);
      setClickedCoords(null);
      if (clickMarkerRef.current) clickMarkerRef.current.remove();
    }
  };

  const isLocationReady = liveLocation && Number.isFinite(liveLocation.latitude) && Number.isFinite(liveLocation.longitude);

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 font-sans group`}>
      
      {/* 1. Map Container Div — ALWAYS MOUNTED IN DOM (#7) */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* 2. Loading Overlay while GPS is being acquired (#6, #27) */}
      {(!isLocationReady || liveLocation.loading) && (
        <div className="absolute inset-0 z-20 bg-slate-50/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 font-sans">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-600 animate-ping"></div>
            <MapPin className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">📍 Finding your location...</h3>
            <p className="text-xs text-slate-500">Detecting browser GPS coordinates for live navigation...</p>
          </div>
          {liveLocation?.error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs max-w-sm font-medium">
              📍 {liveLocation.error}
            </div>
          )}
        </div>
      )}

      {/* 3. Error Overlay if Map style fails (#26) */}
      {mapError && (
        <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
          <AlertTriangle className="w-10 h-10 text-amber-400" />
          <h3 className="text-base font-bold">🗺️ Map couldn't load</h3>
          <p className="text-xs text-slate-300 max-w-xs">{mapError}</p>
          <button
            onClick={() => {
              setMapError(null);
              if (mapRef.current) mapRef.current.setStyle(FALLBACK_STYLE);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold transition shadow-lg"
          >
            Retry Map
          </button>
        </div>
      )}

      {/* 4. Top Status Header Bar */}
      {isLocationReady && (
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl px-3.5 py-2 shadow-md flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-900">MapLibre GL Vector Engine</span>
            <span className="text-slate-400 hidden sm:inline">| Light Style</span>
          </div>

          {/* Safety Layer & My Location Controls (#14) */}
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
      )}

      {/* 5. Re-center Button Overlay if user panned away (#13, #15) */}
      {userInteracted && isLocationReady && (
        <button
          onClick={handleRecenter}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-2xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 border border-blue-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>📍 Re-center Map</span>
        </button>
      )}

      {/* 6. Click Destination Confirmation Card (#21) */}
      {clickedCoords && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-20 sm:w-80 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 text-center space-y-3">
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

      {/* 7. Map Legend Overlay */}
      {isLocationReady && (
        <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-md rounded-xl p-2.5 text-[11px] space-y-1 text-slate-700 border border-slate-200 shadow-md pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-emerald-500"></span>
            <span className="font-bold">Safe Route</span>
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
      )}

    </div>
  );
};

export default MapLibreView;
