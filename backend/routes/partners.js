const express = require('express');
const router = express.Router();
const {
  getPartners,
  getPartner,
  createPartner,
  updatePartner,
  deletePartner,
  getFeaturedPartners,
  getPartnerStats
} = require('../controllers/partnerController');
const { protect, authorize } = require('../middleware/auth');
const { validatePartner } = require('../middleware/validation');

// Public routes
router.get('/', getPartners);
router.get('/featured', getFeaturedPartners);
router.get('/stats', getPartnerStats);
router.get('/:id', getPartner);

// Protected routes (require authentication)
router.use(protect);

// Admin routes
router.post('/', authorize('admin', 'editor'), validatePartner, createPartner);
router.put('/:id', authorize('admin', 'editor'), validatePartner, updatePartner);
router.delete('/:id', authorize('admin'), deletePartner);

module.exports = router;
