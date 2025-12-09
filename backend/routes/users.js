const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', authorize('admin'), getUsers);
router.get('/stats', authorize('admin'), getUserStats);
router.get('/:id', authorize('admin'), getUser);
router.post('/', authorize('admin'), validateUser, createUser);
router.put('/:id', authorize('admin'), validateUser, updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;