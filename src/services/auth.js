import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const request = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong';
    toast.error(message);
    throw err?.response?.data || err;
  }
};

// ─── Auth ────────────────────────────────────────────────────────────────────

export const signup = (payload) =>
  request(() => api.post('/auth/signup', payload));

export const login = (payload) =>
  request(() => api.post('/auth/login', payload));

export const verifyOtp = (payload, token) =>
  request(() => api.post('/auth/verify-otp', payload, { headers: authHeader(token) }));

export const resendOtp = (token) =>
  request(() => api.post('/auth/resend-otp', {}, { headers: authHeader(token) }));

export const forgotPassword = (payload) =>
  request(() => api.post('/auth/forgot-password', payload));

export const verifyForgotOtp = (payload) =>
  request(() => api.post('/auth/verify-forgot-otp', payload));

export const resetPassword = (payload) =>
  request(() => api.post('/auth/reset-password', payload));

export const changePassword = (payload, token) =>
  request(() => api.post('/auth/change-password', payload, { headers: authHeader(token) }));

export const getRoles = () =>
  request(() => api.get('/auth/roles'));

export const getUserActivity = ({ limit = 10, offset = 0 } = {}, token) =>
  request(() => api.get(`/auth/user_activity?limit=${limit}&offset=${offset}`, { headers: authHeader(token) }));

export const deleteAccount = (token) =>
  request(() => api.delete('/auth/delete_account', { headers: authHeader(token) }));

// ─── Google Auth ─────────────────────────────────────────────────────────────

export const googleLogin = (googleToken) =>
  request(() => api.post(`/auth/google/google_login?token=${encodeURIComponent(googleToken)}`));
