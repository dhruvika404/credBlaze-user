import api, { request } from './api';

export const getPrimePlans = () =>
  request(() => api.get('/admin/prime-plans/'));
