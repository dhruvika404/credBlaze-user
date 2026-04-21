import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Request Interceptor: Automatically add Token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors and expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';

    // Handle 401 Unauthorized or 403 Forbidden (Expired, Invalid or Blocked Token)
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error?.response?.data || error);
  }
);

/**
 * Unified request wrapper to handle data extraction
 */
export const request = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    throw err;
  }
};

export default api;
