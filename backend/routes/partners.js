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
const { upload } = require('../middleware/upload');

// Map simple form fields from multipart/form-data into expected nested properties
const mapPartnerForm = (req, res, next) => {
  // If frontend sent contactName/contactEmail/contactPhone, map to contactPerson
  if (req.body) {
    if (req.body.contactName || req.body.contactEmail || req.body.contactPhone) {
      req.body.contactPerson = {
        name: req.body.contactName || undefined,
        email: req.body.contactEmail || undefined,
        phone: req.body.contactPhone || undefined
      };
    }

    // Map status -> isActive
    if (typeof req.body.status !== 'undefined') {
      req.body.isActive = (req.body.status === 'active' || req.body.status === 'true' || req.body.status === true);
    }

    // Map since -> partnershipStart
    if (req.body.since) {
      // keep as string; controller will handle Date conversion if needed
      req.body.partnershipStart = req.body.since;
    }
  }
  next();
};

// Public routes
router.get('/', getPartners);
router.get('/featured', getFeaturedPartners);
router.get('/stats', getPartnerStats);
router.get('/:id', getPartner);

// Protected routes
router.use(protect);

// Admin routes (support multipart logo upload)
router.post('/', authorize('admin'), upload, mapPartnerForm, validatePartner, createPartner);
router.put('/:id', authorize('admin'), upload, mapPartnerForm, validatePartner, updatePartner);
router.delete('/:id', authorize('admin'), deletePartner);

module.exports = router;