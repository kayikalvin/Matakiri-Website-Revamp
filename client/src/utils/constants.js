// If you don't have this file, create it:
// client/src/utils/constants.js

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
export const APP_NAME = 'Matakiri Tumaini Centre';
export const APP_VERSION = '1.0.0';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/updatedetails',
    UPDATE_PASSWORD: '/auth/updatepassword',
  },
  
  // Projects
  PROJECTS: {
    BASE: '/projects',
    FEATURED: '/projects/featured',
    AI: '/projects/ai',
    STATS: '/projects/stats',
    BY_ID: (id) => `/projects/${id}`,
    BY_SLUG: (slug) => `/projects/slug/${slug}`,
  },
  
  // News
  NEWS: {
    BASE: '/news',
    FEATURED: '/news/featured',
    LATEST: '/news/latest',
    STATS: '/news/stats',
    BY_ID: (id) => `/news/${id}`,
    BY_SLUG: (slug) => `/news/slug/${slug}`,
    RELATED: (id) => `/news/${id}/related`,
    LIKE: (id) => `/news/${id}/like`,
  },
  
  // Partners
  PARTNERS: {
    BASE: '/partners',
    FEATURED: '/partners/featured',
    STATS: '/partners/stats',
    BY_ID: (id) => `/partners/${id}`,
  },
  
  // Gallery
  GALLERY: {
    BASE: '/gallery',
    ALBUMS: '/gallery/albums',
    FEATURED: '/gallery/featured',
    STATS: '/gallery/stats',
    BY_ID: (id) => `/gallery/${id}`,
  },
  
  // Contact
  CONTACT: {
    BASE: '/contact',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    STATS: '/users/stats',
    BY_ID: (id) => `/users/${id}`,
  },
};

// App Constants
export const APP_CONSTANTS = {
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  SUPPORTED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  PAGINATION_LIMIT: 10,
  DEBOUNCE_DELAY: 300,
  TOKEN_EXPIRY_CHECK_INTERVAL: 60000, // 1 minute
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
  USER: 'user',
};

// Project Categories
export const PROJECT_CATEGORIES = {
  AI: 'ai',
  HEALTH: 'health',
  EDUCATION: 'education',
  ENVIRONMENT: 'environment',
  AGRICULTURE: 'agriculture',
  COMMUNITY: 'community',
  WATER: 'water',
  INNOVATION: 'innovation',
};

// News Categories
export const NEWS_CATEGORIES = {
  ANNOUNCEMENTS: 'announcements',
  PROJECTS: 'projects',
  PARTNERSHIPS: 'partnerships',
  EVENTS: 'events',
  RESEARCH: 'research',
  COMMUNITY: 'community',
};