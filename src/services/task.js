import api, { request } from './api';

export const getAvailableTasks = () =>
  request(() => api.get('/task-submission/available-tasks'));

export const getMySubmissions = () =>
  request(() => api.get('/task-submission/my-submissions'));

export const getSubmissionDetails = (submissionId) =>
  request(() => api.get(`/task-submission/${submissionId}`));

export const submitTask = (payload) =>
  request(() => api.post('/task-submission/submit', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
