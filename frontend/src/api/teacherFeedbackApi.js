import api from './axiosInstance';

export const submitTeacherFeedback = (data) => api.post('/teacher-feedback', data);
export const getTeacherFeedbacks = (params) => api.get('/teacher-feedback', { params });
export const getMyTeacherFeedbacks = (params) => api.get('/teacher-feedback/my', { params });
export const getTeacherFeedbackById = (id) => api.get(`/teacher-feedback/${id}`);
export const deleteTeacherFeedback = (id) => api.delete(`/teacher-feedback/${id}`);
export const getTeachers = () => api.get('/teachers');
