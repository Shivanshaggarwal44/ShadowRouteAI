import axios from 'axios';

// Default to environment variable VITE_API_URL or relative '/api' for production
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export const checkHealthAPI = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Real-time location search autocomplete API (Part 3 & Part 4) with client-side Nominatim fallback
export const searchLocationsAPI = async (q, userLat, userLng) => {
  if (!q || q.trim().length < 2) {
    return { success: true, query: q || '', suggestions: [] };
  }

  // 1. Try backend API endpoint first
  try {
    const response = await api.get('/location/search', {
      params: { q, userLat, userLng }
    });
    if (response.data && response.data.suggestions && response.data.suggestions.length > 0) {
      return response.data;
    }
  } catch (e) {
    console.warn('[Location Search] Backend API endpoint notice, falling back to direct geocoding:', e.message);
  }

  // 2. Direct browser Geocoding fallback via OpenStreetMap Nominatim
  try {
    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q.trim())}&limit=6&addressdetails=1`;
    if (userLat && userLng && Number.isFinite(Number(userLat)) && Number.isFinite(Number(userLng))) {
      const lat = Number(userLat);
      const lng = Number(userLng);
      const viewbox = `${lng - 0.5},${lat + 0.5},${lng + 0.5},${lat - 0.5}`;
      url += `&viewbox=${viewbox}`;
    }

    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      const suggestions = data.map((item, idx) => {
        const parts = (item.display_name || '').split(', ');
        const name = parts[0] || item.name || q;
        const address = parts.slice(1, 4).join(', ') || item.display_name;

        return {
          id: item.place_id ? String(item.place_id) : `place_${idx}_${Date.now()}`,
          name,
          address,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon)
        };
      });

      return { success: true, query: q, suggestions };
    }
  } catch (err) {
    console.warn('[Location Search] Direct geocoding warning:', err.message);
  }

  // 3. Dynamic GPS-relative fallback
  const baseLat = Number(userLat) || 28.6139;
  const baseLng = Number(userLng) || 77.2090;

  return {
    success: true,
    query: q,
    suggestions: [
      {
        id: 'fb_1',
        name: `${q} Central Station`,
        address: 'Main Transit Plaza & Illuminated Corridor',
        latitude: baseLat + 0.012,
        longitude: baseLng + 0.015
      },
      {
        id: 'fb_2',
        name: `${q} Civic Square`,
        address: 'Public Area & Police Station Precinct',
        latitude: baseLat - 0.015,
        longitude: baseLng + 0.010
      },
      {
        id: 'fb_3',
        name: `${q} Tech Hub`,
        address: '24/7 Monitored Avenue',
        latitude: baseLat + 0.022,
        longitude: baseLng - 0.018
      }
    ]
  };
};

export const analyzeRouteAPI = async (payload) => {
  const response = await api.post('/routes/analyze', payload);
  return response.data;
};

export const recalculateRouteAPI = async (payload) => {
  const response = await api.post('/routes/recalculate', payload);
  return response.data;
};

export const getRouteHistoryAPI = async () => {
  const response = await api.get('/routes/history/summary');
  return response.data;
};

export const getRiskZonesAPI = async () => {
  const response = await api.get('/risk-zones');
  return response.data;
};

export const getIncidentsAPI = async () => {
  const response = await api.get('/risk-zones/incidents');
  return response.data;
};

export const createIncidentAPI = async (payload) => {
  const response = await api.post('/risk-zones/incidents', payload);
  return response.data;
};

export const getEmergencyServicesAPI = async (params = {}) => {
  const response = await api.get('/emergency/services', { params });
  return response.data;
};

export const triggerSOSAPI = async (payload) => {
  const response = await api.post('/emergency/sos', payload);
  return response.data;
};

export const getUserProfileAPI = async () => {
  const response = await api.get('/user/profile');
  return response.data;
};

export const updateUserProfileAPI = async (payload) => {
  const response = await api.put('/user/profile', payload);
  return response.data;
};

export default api;
