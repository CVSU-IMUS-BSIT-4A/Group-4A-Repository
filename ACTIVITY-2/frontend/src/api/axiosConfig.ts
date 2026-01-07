import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Update this with your backend URL if different
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401 error, we could handle it globally here
    // but we'll let the components handle it for now to avoid
    // creating dependency cycles
    return Promise.reject(error);
  }
);

export default api;
