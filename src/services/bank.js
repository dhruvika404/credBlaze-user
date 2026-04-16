import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, '');

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
});

const authHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  return { Authorization: `Bearer ${token}` };
};

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

export const getBankList = () =>
  request(() => api.get('/bank/list', { headers: authHeader() }));

export const createBank = (payload) =>
  request(() => api.post('/bank/create', payload, { headers: authHeader() }));

export const updateBank = (bankId, payload) =>
  request(() => api.put(`/bank/update/${bankId}`, payload, { headers: authHeader() }));

export const deleteBank = (bankId) =>
  request(() => api.delete(`/bank/delete/${bankId}`, { headers: authHeader() }));
