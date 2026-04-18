import api, { request } from './api';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const signup = (payload) =>
  request(() => api.post('/auth/signup', payload));

export const login = (payload) =>
  request(() => api.post('/auth/login', payload));

export const verifyOtp = (payload) =>
  request(() => api.post('/auth/verify-otp', payload));

export const resendOtp = () =>
  request(() => api.post('/auth/resend-otp', {}));

export const forgotPassword = (payload) =>
  request(() => api.post('/auth/forgot-password', payload));

export const verifyForgotOtp = (payload) =>
  request(() => api.post('/auth/verify-forgot-otp', payload));

export const resetPassword = (payload) =>
  request(() => api.post('/auth/reset-password', payload));

export const changePassword = (payload) =>
  request(() => api.post('/auth/change-password', payload));

export const getRoles = () =>
  request(() => api.get('/auth/roles'));

export const getUserActivity = ({ limit = 10, offset = 0 } = {}) =>
  request(() => api.get(`/auth/user_activity?limit=${limit}&offset=${offset}`));

export const deleteAccount = () =>
  request(() => api.delete('/auth/delete_account'));

export const logout = (payload) =>
  request(() => api.post('/auth/logout', payload));

// ─── Google Auth ─────────────────────────────────────────────────────────────

export const googleLogin = (googleToken, deviceId = '') =>
  request(() => api.post(`/auth/google/google_login?token=${encodeURIComponent(googleToken)}&device_id=${encodeURIComponent(deviceId)}`));
