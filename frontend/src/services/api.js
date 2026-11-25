import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
export const BACKEND_URL = rawApiUrl ? rawApiUrl.replace(/\/$/, '') : '';

const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerx_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token only if on protected route
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        // localStorage.removeItem('careerx_token');
        // localStorage.removeItem('careerx_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
