import api from './axiosInstance';

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const registerStudent = (data) => api.post('/auth/register/student', data);
export const getCurrentUser = () => api.get('/auth/me');
