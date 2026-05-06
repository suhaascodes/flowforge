// API service functions
import axiosInstance from '../utils/axiosConfig.js';

// Auth API
export const authAPI = {
  login: (email, password) => axiosInstance.post('/api/auth/login', { email, password }),
  register: ({ name, email, password, avatar = null }) =>
    axiosInstance.post('/api/auth/register', { name, email, password, avatar }),
  logout: () => axiosInstance.post('/api/auth/logout'),
  validate: (token) =>
    axiosInstance.get('/api/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Task API
export const taskAPI = {
  getAll: (filters = {}) => axiosInstance.get('/api/tasks', { params: filters }),
  getById: (id) => axiosInstance.get(`/api/tasks/${id}`),
  create: (data) => axiosInstance.post('/api/tasks', data),
  update: (id, data) => axiosInstance.put(`/api/tasks/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/tasks/${id}`),
  updateStatus: (id, status) => axiosInstance.patch(`/api/tasks/${id}/status`, { status }),
};

// User API
export const userAPI = {
  getAll: (filters = {}) => axiosInstance.get('/api/users', { params: filters }),
  getById: (id) => axiosInstance.get(`/api/users/${id}`),
  create: (data) => axiosInstance.post('/api/users', data),
  update: (id, data) => axiosInstance.put(`/api/users/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/users/${id}`),
  getProfile: () => axiosInstance.get('/api/users/profile'),
};
