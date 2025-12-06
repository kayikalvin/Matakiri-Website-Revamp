const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects,
  getAIProjects,
  getProjectStats
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/ai', getAIProjects);
router.get('/stats', getProjectStats);
router.get('/:id', getProject);

// Protected routes (require authentication)
router.use(protect);

// Admin routes
router.post('/', authorize('admin', 'editor'), validateProject, createProject);
router.put('/:id', authorize('admin', 'editor'), updateProject);
router.delete('/:id', authorize('admin'), deleteProject);

module.exports = router;