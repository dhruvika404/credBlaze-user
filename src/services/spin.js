import api, { request } from './api';

export const getSpinRewards = (params = {}) =>
  request(() => api.get('/spin/rewards', { params }));

export const getSpinConfig = () =>
  request(() => api.get('/spin/config'));

export const playSpin = () =>
  request(() => api.post('/spin/play', {}));

export const getSpinStatus = () =>
  request(() => api.get('/spin/status'));

export const getSpinHistory = (params = {}) =>
  request(() => api.get('/spin/history', { params }));
