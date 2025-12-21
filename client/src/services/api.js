import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.js';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
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

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // You can transform response data here
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Distinguish timeout vs other network errors
    if (error.code === 'ECONNABORTED') {
      console.error(`Request timeout: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied: You do not have permission to perform this action.');
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found');
    }

    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      console.error('Server error occurred. Please try again later.');
    }

    // Handle network errors (no response)
    if (!error.response) {
      console.error('Network error. Please check your connection.', {
        message: error.message,
        code: error.code,
        url: originalRequest?.url,
        method: originalRequest?.method,
      });
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  // GET request
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      const payload = error.response?.data || { message: error.message, success: false };
      payload.status = error.response?.status || null;
      throw payload;
    }
  },

  // POST request
  post: async (url, data = {}) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      const payload = error.response?.data || { message: error.message, success: false };
      payload.status = error.response?.status || null;
      throw payload;
    }
  },

  // PUT request
  put: async (url, data = {}) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      const payload = error.response?.data || { message: error.message, success: false };
      payload.status = error.response?.status || null;
      throw payload;
    }
  },

  // PATCH request
  patch: async (url, data = {}) => {
    try {
      const response = await api.patch(url, data);
      return response.data;
    } catch (error) {
      const payload = error.response?.data || { message: error.message, success: false };
      payload.status = error.response?.status || null;
      throw payload;
    }
  },

  // DELETE request
  delete: async (url) => {
    try {
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      const payload = error.response?.data || { message: error.message, success: false };
      payload.status = error.response?.status || null;
      throw payload;
    }
  },

  // File upload
  upload: async (url, file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onProgress) {
        config.onUploadProgress = onProgress;
      }

      const response = await api.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message, success: false };
    }
  },
};

// API endpoints - Updated to match your backend
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  me: '/auth/me',
  updateDetails: '/auth/updatedetails',
  updatePassword: '/auth/updatepassword',

  // Projects
  projects: '/projects',
  featuredProjects: '/projects/featured',
  aiProjects: '/projects/ai',
  projectStats: '/projects/stats',
  projectById: (id) => `/projects/${id}`,

  // News
  news: '/news',
  featuredNews: '/news/featured',
  latestNews: '/news/latest',
  newsStats: '/news/stats',
  newsById: (id) => `/news/${id}`,
  newsBySlug: (slug) => `/news/slug/${slug}`,
  relatedNews: (id) => `/news/${id}/related`,
  likeNews: (id) => `/news/${id}/like`,

  // Partners
  partners: '/partners',
  featuredPartners: '/partners/featured',
  partnerStats: '/partners/stats',
  partnerById: (id) => `/partners/${id}`,

  // Gallery
  gallery: '/gallery',
  galleryAlbums: '/gallery/albums',
  featuredGallery: '/gallery/featured',
  galleryStats: '/gallery/stats',
  galleryById: (id) => `/gallery/${id}`,

  // Contact
  contact: '/contact',

  // Users (Admin only)
  users: '/users',
  userStats: '/users/stats',
  userById: (id) => `/users/${id}`,
};

// Specific API services for different resources
export const authAPI = {
  login: (credentials) => apiService.post(endpoints.login, credentials),
  register: (userData) => apiService.post(endpoints.register, userData),
  logout: () => apiService.post(endpoints.logout),
  getCurrentUser: () => apiService.get(endpoints.me),
  updateProfile: (userData) => apiService.put(endpoints.updateDetails, userData),
  updatePassword: (passwordData) => apiService.put(endpoints.updatePassword, passwordData),
};

export const projectsAPI = {
  getAll: (params = {}) => apiService.get(endpoints.projects, params),
  getFeatured: () => apiService.get(endpoints.featuredProjects),
  getAIProjects: () => apiService.get(endpoints.aiProjects),
  getStats: () => apiService.get(endpoints.projectStats),
  getById: (id) => apiService.get(endpoints.projectById(id)),
  getBySlug: (slug) => apiService.get(endpoints.newsBySlug(slug)), // Note: using news slug endpoint pattern
  create: (projectData) => apiService.post(endpoints.projects, projectData),
  update: (id, projectData) => apiService.put(endpoints.projectById(id), projectData),
  delete: (id) => apiService.delete(endpoints.projectById(id)),
};

export const newsAPI = {
  getAll: (params = {}) => apiService.get(endpoints.news, params),
  getFeatured: () => apiService.get(endpoints.featuredNews),
  getLatest: () => apiService.get(endpoints.latestNews),
  getStats: () => apiService.get(endpoints.newsStats),
  getById: (id) => apiService.get(endpoints.newsById(id)),
  getBySlug: (slug) => apiService.get(endpoints.newsBySlug(slug)),
  getRelated: (id) => apiService.get(endpoints.relatedNews(id)),
  create: (newsData) => apiService.post(endpoints.news, newsData),
  update: (id, newsData) => apiService.put(endpoints.newsById(id), newsData),
  delete: (id) => apiService.delete(endpoints.newsById(id)),
  like: (id) => apiService.put(endpoints.likeNews(id)),
};

export const partnersAPI = {
  getAll: (params = {}) => apiService.get(endpoints.partners, params),
  getFeatured: () => apiService.get(endpoints.featuredPartners),
  getStats: () => apiService.get(endpoints.partnerStats),
  getById: (id) => apiService.get(endpoints.partnerById(id)),
  create: (partnerData) => apiService.post(endpoints.partners, partnerData),
  update: (id, partnerData) => apiService.put(endpoints.partnerById(id), partnerData),
  delete: (id) => apiService.delete(endpoints.partnerById(id)),
};

export const galleryAPI = {
  getAll: (params = {}) => apiService.get(endpoints.gallery, params),
  getAlbums: () => apiService.get(endpoints.galleryAlbums),
  getFeatured: () => apiService.get(endpoints.featuredGallery),
  getStats: () => apiService.get(endpoints.galleryStats),
  getById: (id) => apiService.get(endpoints.galleryById(id)),
  upload: (formData) => apiService.upload(endpoints.gallery, formData),
  update: (id, galleryData) => apiService.put(endpoints.galleryById(id), galleryData),
  delete: (id) => apiService.delete(endpoints.galleryById(id)),
};

export const contactAPI = {
  submit: (contactData) => apiService.post(endpoints.contact, contactData),
};

export const usersAPI = {
  getAll: (params = {}) => apiService.get(endpoints.users, params),
  getStats: () => apiService.get(endpoints.userStats),
  getById: (id) => apiService.get(endpoints.userById(id)),
  create: (userData) => apiService.post(endpoints.users, userData),
  update: (id, userData) => apiService.put(endpoints.userById(id), userData),
  delete: (id) => apiService.delete(endpoints.userById(id)),
};

// Export all APIs
export default {
  auth: authAPI,
  projects: projectsAPI,
  news: newsAPI,
  partners: partnersAPI,
  gallery: galleryAPI,
  contact: contactAPI,
  users: usersAPI,
  service: apiService,
};