// Application Constants

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const PROJECT_STATUS = {
  PLANNED: 'planned',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
};

export const PARTNER_TYPES = {
  CORPORATE: 'corporate',
  NGO: 'ngo',
  GOVERNMENT: 'government',
  INDIVIDUAL: 'individual',
  COMMUNITY: 'community'
};

export const NEWS_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const PROJECT_CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'environment', label: 'Environment' },
  { value: 'livelihood', label: 'Livelihood' }
];

export const GALLERY_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'projects', label: 'Projects' },
  { value: 'events', label: 'Events' },
  { value: 'reports', label: 'Reports' },
  { value: 'people', label: 'People' }
];

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'admin_token',
  USER_DATA: 'admin_user',
  SETTINGS: 'admin_settings'
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD MMM YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZES: [10, 25, 50, 100]
};

// Validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (length) => `Must be at least ${length} characters`,
  MAX_LENGTH: (length) => `Cannot exceed ${length} characters`,
  PASSWORD_MATCH: 'Passwords do not match'
};
