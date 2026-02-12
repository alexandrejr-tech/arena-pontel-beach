import api from './api';

export const getAll = (params) => api.get('/gallery', { params });
export const upload = (formData) => api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const remove = (id) => api.delete(`/gallery/${id}`);
