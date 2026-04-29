import api, { request } from './api';

export const getKycDetails = () =>
  request(() => api.get('/kyc/details'));

export const submitKyc = (payload) =>
  request(() => api.post('/kyc/submit', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));

export const uploadMobileImage = (payload) =>
  request(() => api.post('/nfc-cards/nfc/camera-photo', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
