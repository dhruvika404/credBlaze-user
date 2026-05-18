import api from './api';

export const updateNotificationPreference = (type, status) => {
  return api.post(`/notify/edit/notification-preference?notification_type=${type}&status=${status}`);
};

export const getNotificationHistory = () => {
  return api.get('/notify/history');
};

export const seenAllNotifications = () => {
  return api.post('/notify/seen-all');
};
