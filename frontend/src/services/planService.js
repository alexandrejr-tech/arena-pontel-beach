import api from './api';

export const getAll = () => api.get('/plans');
export const getById = (id) => api.get(`/plans/${id}`);
export const create = (data) => api.post('/plans', data);
export const update = (id, data) => api.put(`/plans/${id}`, data);
export const remove = (id) => api.delete(`/plans/${id}`);
