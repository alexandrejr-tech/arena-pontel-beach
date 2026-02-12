import api from './api';

export const send = (data) => api.post('/contact', data);
