const { validationResult } = require('express-validator');
const { body } = require('express-validator');

// Middleware to handle validation errors
exports.validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  };
};

// Auth validation rules
exports.validateRegister = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'editor', 'viewer']).withMessage('Invalid role'),
  body('department')
    .optional()
    .isIn(['management', 'projects', 'ai', 'communications', 'finance', null]).withMessage('Invalid department')
];

exports.validateLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

exports.validateUpdatePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Project validation rules
exports.validateProject = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['ai', 'health', 'education', 'environment', 'agriculture', 'community']).withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['planning', 'active', 'completed', 'on-hold']).withMessage('Invalid status'),
  body('location')
    .notEmpty().withMessage('Location is required'),
  // Add more validation rules as needed
];

// Partner validation rules
exports.validatePartner = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Name must be between 2 and 200 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('logo')
    .notEmpty().withMessage('Logo URL is required')
    .isURL().withMessage('Please provide a valid logo URL'),
  body('website')
    .optional()
    .isURL().withMessage('Please provide a valid website URL'),
  body('partnershipLevel')
    .optional()
    .isIn(['strategic', 'gold', 'silver', 'bronze']).withMessage('Invalid partnership level'),
  body('category')
    .optional()
    .isIn(['international', 'government', 'corporate', 'ngo', 'academic']).withMessage('Invalid category'),
  body('contactPerson.name')
    .optional()
    .isLength({ min: 2, max: 100 }).withMessage('Contact person name must be between 2 and 100 characters'),
  body('contactPerson.email')
    .optional()
    .isEmail().withMessage('Please provide a valid contact email'),
  body('contactPerson.phone')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number'),
  body('partnershipStart')
    .optional()
    .isISO8601().withMessage('Please provide a valid start date'),
  body('partnershipEnd')
    .optional()
    .isISO8601().withMessage('Please provide a valid end date')
];

// User validation rules
exports.validateUser = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'editor', 'viewer']).withMessage('Invalid role'),
  body('department')
    .optional()
    .isIn(['management', 'projects', 'ai', 'communications', 'finance', null]).withMessage('Invalid department')
];

// News validation rules
exports.validateNews = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('excerpt')
    .notEmpty().withMessage('Excerpt is required')
    .isLength({ min: 10, max: 300 }).withMessage('Excerpt must be between 10 and 300 characters'),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('category')
    .optional()
    .isIn(['announcement', 'partnership', 'achievement', 'event', 'general']).withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('featuredImage')
    .optional()
    .isURL().withMessage('Please provide a valid image URL'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
];

// Contact validation rules
exports.validateContact = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('subject')
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('phone')
    .optional()
    .isMobilePhone().withMessage('Please provide a valid phone number')
];