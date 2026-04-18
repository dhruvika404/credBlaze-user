import api, { request } from './api';

export const getProfileDetails = () =>
  request(() => api.get('/profile/details'));

export const updateProfileDetails = (payload) =>
  request(() => api.put('/profile/details_update', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
