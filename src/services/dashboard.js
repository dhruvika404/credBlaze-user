import api, { request } from './api';

export const getDashboardOverview = () => {
    return request(() => api.get('/user/dashboard/overview'));
};
