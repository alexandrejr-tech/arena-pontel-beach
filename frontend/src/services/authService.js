import api from './api';

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post(`/auth/reset-password/${token}`, { password });
export const refreshToken = (token) => api.post('/auth/refresh-token', { refreshToken: token });
export const getMe = () => api.get('/auth/me');
