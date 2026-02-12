import api from './api';

export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const changePassword = (data) => api.put('/users/change-password', data);
export const uploadAvatar = (formData) =>
  api.put('/users/upload-avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Admin
export const getAllUsers = (params) => api.get('/users/admin/all', { params });
export const getAdminStats = () => api.get('/users/admin/stats');
export const createUser = (data) => api.post('/users/admin/create', data);
export const updateUser = (id, data) => api.put(`/users/admin/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/admin/${id}`);
export const assignPlan = (id, planId) => api.post(`/users/admin/${id}/plan`, { planId });
export const removePlan = (id) => api.delete(`/users/admin/${id}/plan`);
