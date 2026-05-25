import api, { request } from './api';

export const getSupportTickets = (userId, params) =>
  request(() => api.get(`/support-tickets/user/${userId}`, { params }));

export const supportTicketUserReply = (ticketId, data) =>
  request(() => api.post(`/support-tickets/${ticketId}/user/reply`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));

export const createSupportTicket = (data) =>
  request(() => api.post('/support-tickets', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }));
