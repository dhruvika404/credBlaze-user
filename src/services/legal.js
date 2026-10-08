import api from './api';

export const getTermsConditions = async () => {
    const response = await api.get('/legal/terms-conditions');
    return response.data;
};

export const getFaqs = async (params = { limit: 30 }) => {
    const response = await api.get('/legal/faqs', { params });
    return response.data;
};

export const getPrivacyPolicy = async () => {
    const response = await api.get('/legal/privacy-policy');
    return response.data;
};
