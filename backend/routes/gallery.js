const express = require('express');
const router = express.Router();
const {
  getGallery,
  getGalleryItem,
  uploadMedia,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryAlbums,
  getFeaturedGallery,
  getGalleryStats
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
// Remove upload middleware if not ready
// const { uploadSingle } = require('../middleware/upload');

// Public routes
router.get('/', getGallery);
router.get('/albums', getGalleryAlbums);
router.get('/featured', getFeaturedGallery);
router.get('/stats', getGalleryStats);
router.get('/:id', getGalleryItem);

// Protected routes
router.use(protect);

// Admin/Editor routes
// Temporarily remove upload middleware for testing
// router.post('/', authorize('admin', 'editor'), uploadSingle('image'), uploadMedia);
router.post('/', authorize('admin', 'editor'), uploadMedia);
router.put('/:id', authorize('admin', 'editor'), updateGalleryItem);
router.delete('/:id', authorize('admin'), deleteGalleryItem);

module.exports = router;