import axios from 'axios';

// Use relative URL in production, localhost in development
const getBaseURL = () => {
  // In production, use relative /api (same domain as admin panel)
  if (window.location.hostname !== 'localhost') {
    return '/api';
  }
  // In development, use localhost:5000
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    // Don't add token to login requests
    if (config.url?.includes('/auth/admin-login')) {
      return config;
    }
    
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login on 401 (not 403 or 500)
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - redirecting to login');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
