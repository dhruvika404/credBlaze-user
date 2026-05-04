import api, { request } from './api';

export const getPlatforms = (params = {}) =>
  request(() => api.get('/campaign/platform', { params }));

export const getCategories = (params = {}) =>
  request(() => api.get('/campaign/category', { params }));

export const getAvailableTasks = (payload = {}) =>
  request(() => api.post('/task-submission/available-tasks', payload));

export const getMySubmissions = (payload = {}) =>
  request(() => api.post('/task-submission/my-submissions', payload));

export const getSubmissionDetails = (submissionId) =>
  request(() => api.get(`/task-submission/${submissionId}`));

export const submitTask = (payload) =>
  request(() => api.post('/task-submission/submit', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
