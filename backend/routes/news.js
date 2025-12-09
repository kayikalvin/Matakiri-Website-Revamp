const express = require('express');
const router = express.Router();
const {
  getNews,
  getNewsItem,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
  getFeaturedNews,
  getLatestNews,
  likeNews,
  getNewsStats,
  getRelatedNews
} = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/auth');
const { validateNews } = require('../middleware/validation');

// Public routes
router.get('/', getNews);
router.get('/featured', getFeaturedNews);
router.get('/latest', getLatestNews);
router.get('/stats', getNewsStats);
router.get('/slug/:slug', getNewsBySlug);
router.get('/:id', getNewsItem);
router.get('/:id/related', getRelatedNews);

// Protected routes
router.use(protect);

// Like route
router.put('/:id/like', likeNews);

// Admin/Editor routes
router.post('/', authorize('admin', 'editor'), validateNews, createNews);
router.put('/:id', authorize('admin', 'editor'), validateNews, updateNews);
router.delete('/:id', authorize('admin'), deleteNews);

module.exports = router;