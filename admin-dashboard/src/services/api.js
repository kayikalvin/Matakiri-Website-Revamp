// Programs API
export const programsAPI = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => {
    if (data instanceof FormData) {
      return api.post('/programs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/programs', data);
  },
  update: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/programs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.put(`/programs/${id}`, data);
  },
  delete: (id) => api.delete(`/programs/${id}`),
};
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getFeatured: () => api.get('/projects/featured'),
  getAI: () => api.get('/projects/ai'),
  getStats: (params) => api.get('/projects/stats', { params }),
  uploadImages: (id, formData) => api.post(`/projects/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Partners API
export const partnersAPI = {
  getAll: (params) => api.get('/partners', { params }),
  getById: (id) => api.get(`/partners/${id}`),
  create: (data) => (data instanceof FormData ? api.post('/partners', data, { headers: { 'Content-Type': 'multipart/form-data' } }) : api.post('/partners', data)),
  update: (id, data) => (data instanceof FormData ? api.put(`/partners/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }) : api.put(`/partners/${id}`, data)),
  delete: (id) => api.delete(`/partners/${id}`),
  getStats: (params) => api.get('/partners/stats', { params }),
};

// News API
export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data),
  update: (id, data) => api.put(`/news/${id}`, data),
  delete: (id) => api.delete(`/news/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  upload: (formData) => api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: (params) => api.get('/users/stats', { params }),
};

// Metrics API
export const metricsAPI = {
  // returns { data: { totalSpent } }
  getRevenue: (params) => api.get('/metrics/revenue', { params })
};

// Contact API
export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
};

// Themes API
export const themesAPI = {
  getAll: (params) => api.get('/themes', { params }),
  getActive: () => api.get('/themes/active'),
  getById: (id) => api.get(`/themes/${id}`),
  create: (data) => api.post('/themes', data),
  update: (id, data) => api.put(`/themes/${id}`, data),
  delete: (id) => api.delete(`/themes/${id}`),
  activate: (id) => api.put(`/themes/${id}/activate`),
};

export default api;
