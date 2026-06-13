import api, { request } from './api';

export const createCryptoPayment = (payload) =>
  request(() => api.post('/crypto-payment/create-payment', payload));

export const getFilteredBalance = (payload) =>
  request(() => api.post('/crypto-payment/get-filtered-balance', payload));

export const insertWithdraw = (payload) =>
  request(() => api.post('/tp/cregis_withdraw_insert', payload));

export const getWalletTransactions = (payload) =>
  request(() => api.post('/wallet/transactions', payload));

export const convertCurrency = (toCountry, amount) =>
  request(() => api.get(`/wallet/currency-convert/?to_country=${toCountry}&amount=${amount}`));

export const createCregisPayment = (payload) =>
  request(() => api.post('/cregis-payment/create-payment', payload));

