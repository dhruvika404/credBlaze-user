import api, { request } from './api';

export const getAddressList = () =>
  request(() => api.get('/address/list'));

export const createAddress = (payload) =>
  request(() => api.post('/address/create', payload));

export const updateAddress = (addressId, payload) =>
  request(() => api.put(`/address/update/${addressId}`, payload));

export const deleteAddress = (addressId) =>
  request(() => api.delete(`/address/delete/${addressId}`));
