import api from './api';

export const updateNotificationPreference = async (type, status) => {
  const response = await api.post(`/notify/edit/notification-preference?notification_type=${type}&status=${status}`);
  return response.data;
};

export const getNotificationHistory = async () => {
  const response = await api.get('/notify/history');
  return response.data;
};

export const seenAllNotifications = async () => {
  const response = await api.post('/notify/seen-all');
  return response.data;
};

