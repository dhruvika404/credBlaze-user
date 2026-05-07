import api, { request } from './api';

export const AD_TYPES = {
  POP_UP: 'pop-up ad',
  BANNER: 'banner ad',
  STORY: 'story ad',
};

export const getAd = (adType) =>
  request(() => api.get('/advertisement/serve-ad', { params: { ad_type: adType } }));

export const getBannerAds = () =>
  request(() => api.get('/advertisement/serve-banner-ads'));

export const getStoryAds = () =>
  request(() => api.get('/advertisement/serve-story-ads'));

export const markStoryAsSeen = (adId) =>
  request(() => api.post('/advertisement/story-seen', { ad_id: adId, seen: true }));
