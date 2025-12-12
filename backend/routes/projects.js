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
  , addProjectImages
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getProjects);
router.get('/featured', getFeaturedProjects);
router.get('/ai', getAIProjects);
router.get('/stats', getProjectStats);
router.get('/:id', getProject);

// Protected routes
router.use(protect);

// Admin/Editor routes
router.post('/', authorize('admin', 'editor'), validateProject, createProject);
router.put('/:id', authorize('admin', 'editor'), validateProject, updateProject);
router.post('/:id/images', authorize('admin', 'editor'), upload, addProjectImages);
router.delete('/:id', authorize('admin'), deleteProject);

module.exports = router;