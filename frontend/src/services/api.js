import axios from 'axios';

// Read API URL from environment variable or default to Spring Boot port 8080
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: inject JWT Bearer token into Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cloudtask_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract error messages and handle 401 redirects
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem('cloudtask_token');
      localStorage.removeItem('cloudtask_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }

    // Extract cleanest error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred. Please check if the backend server is running.';

    return Promise.reject(new Error(message));
  }
);

export default api;
