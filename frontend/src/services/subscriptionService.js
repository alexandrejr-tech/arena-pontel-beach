import api from './api';

export const getMySubscription = () => api.get('/subscriptions/my-subscription');
export const subscribe = (planId) => api.post('/subscriptions/subscribe', { planId });
export const cancelSubscription = () => api.put('/subscriptions/cancel');
