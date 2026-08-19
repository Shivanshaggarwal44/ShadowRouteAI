import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

export const checkHealthAPI = async () => {
  const response = await api.get('/health');
  return response.data;
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
