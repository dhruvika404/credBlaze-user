import api, { request } from './api';

export const getReferralHistory = (data = {}) =>
  request(() => api.post('/referrals/history', data));
