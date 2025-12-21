const express = require('express');
const router = express.Router();
const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../controllers/programController');
const { protect, authorize } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation'); // Reuse or create validateProgram

// Public routes
router.get('/', getPrograms);
router.get('/:id', getProgram);

// Protected routes
router.use(protect);

// Admin/Editor routes
router.post('/', authorize('admin', 'editor'), createProgram); // Add validation if needed
router.put('/:id', authorize('admin', 'editor'), updateProgram);
router.delete('/:id', authorize('admin'), deleteProgram);

module.exports = router;
