import api, { request } from './api';

export const getPopupAd = () =>
  request(() => api.get('/advertisement/serve-popup-ad'));

export const getBannerAds = () =>
  request(() => api.get('/advertisement/serve-banner-ads'));

export const getStoryAds = () =>
  request(() => api.get('/advertisement/serve-story-ads'));

export const markAdAsSeen = (adId) =>
  request(() => api.post('/advertisement/ad-seen', { ad_id: adId, seen: true }));

