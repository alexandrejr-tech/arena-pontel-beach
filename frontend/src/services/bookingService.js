import api from './api';

export const getUserBookings = (params) => api.get('/bookings', { params });
export const getAvailable = (params) => api.get('/bookings/available', { params });
export const getPublicSchedule = (params) => api.get('/bookings/public/schedule', { params });
export const create = (data) => api.post('/bookings', data);
export const cancel = (id) => api.delete(`/bookings/${id}`);
export const getAll = (params) => api.get('/bookings/admin/all', { params });
