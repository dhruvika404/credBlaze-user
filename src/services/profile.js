import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
});

const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : '');

const request = async (fn) => {
  try {
    const res = await fn();
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Something went wrong';
    toast.error(message);
    throw err?.response?.data || err;
  }
};

export const getProfileDetails = () => {
  const token = getToken();
  return request(() => api.get('/profile/details', { headers: authHeader(token) }));
};

export const updateProfileDetails = (payload) => {
  const token = getToken();
  return request(() => api.put('/profile/details_update', payload, { headers: authHeader(token) }));
};
