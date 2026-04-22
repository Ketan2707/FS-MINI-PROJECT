import api from './axiosInstance';

export const submitFeedback = (data) => api.post('/feedback', data);
export const getFeedbacks = (params) => api.get('/feedback', { params });
export const getFeedbackById = (id) => api.get(`/feedback/${id}`);
export const deleteFeedback = (id) => api.delete(`/feedback/${id}`);
