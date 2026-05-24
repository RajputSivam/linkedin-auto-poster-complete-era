import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getActivity = () => api.get('/api/activity');
export const getPostHistory = () => api.get('/api/post/history');
export const getPendingPosts = () => api.get('/api/post/pending');
export const generatePost = () => api.post('/api/post/generate');
export const approvePost = (id) => api.post(`/api/post/approve/${id}`);
export const skipPost = (id) => api.post(`/api/post/skip/${id}`);
export const uploadFile = (formData) => api.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMe = () => api.get('/auth/me');
export const updateSettings = (data) => api.put('/auth/settings', data);
export default api;
