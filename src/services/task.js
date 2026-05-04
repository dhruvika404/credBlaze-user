import api, { request } from './api';

export const getPlatforms = (params = {}) =>
  request(() => api.get('/campaign/platform', { params }));

export const getCategories = (params = {}) =>
  request(() => api.get('/campaign/category', { params }));

export const getAvailableTasks = (params = {}) =>
  request(() => api.get('/task-submission/available-tasks', { params }));

export const getMySubmissions = (params = {}) =>
  request(() => api.get('/task-submission/my-submissions', { params }));

export const getSubmissionDetails = (submissionId) =>
  request(() => api.get(`/task-submission/${submissionId}`));

export const submitTask = (payload) =>
  request(() => api.post('/task-submission/submit', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }));
