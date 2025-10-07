import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;


