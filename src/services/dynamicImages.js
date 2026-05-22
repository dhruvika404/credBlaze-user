import api, { request } from './api';

export const getDynamicImages = (imageType = 'ONBOARDING') =>
  request(() => api.get(`/dynamic/image/${imageType}`));
