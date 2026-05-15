import api from './api';

export const updateNotificationPreference = (type, status) => {
  return api.post(`/notify/edit/notification-preference?notification_type=${type}&status=${status}`);
};
