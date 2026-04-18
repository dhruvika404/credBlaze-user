import api, { request } from './api';

export const getBankList = () =>
  request(() => api.get('/bank/list'));

export const createBank = (payload) =>
  request(() => api.post('/bank/create', payload));

export const updateBank = (bankId, payload) =>
  request(() => api.put(`/bank/update/${bankId}`, payload));

export const deleteBank = (bankId) =>
  request(() => api.delete(`/bank/delete/${bankId}`));
