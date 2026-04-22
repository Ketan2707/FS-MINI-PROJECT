import api from './axiosInstance';

export const getDashboardStats = (params) => api.get('/dashboard/stats', { params });
export const getSubjects = () => api.get('/subjects');
