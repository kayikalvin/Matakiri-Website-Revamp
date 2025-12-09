const express = require('express');
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  markAsRead,
  markAsReplied,
  getContactStats,
  getRecentContacts,
  bulkUpdateContacts,
  bulkDeleteContacts
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public routes
router.post('/', validateContact, createContact);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/', getContacts);
router.get('/recent', getRecentContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContact);
router.put('/:id', updateContact);
router.put('/:id/read', markAsRead);
router.put('/:id/replied', markAsReplied);
router.delete('/:id', deleteContact);
router.put('/bulk/update', bulkUpdateContacts);
router.delete('/bulk/delete', bulkDeleteContacts);

module.exports = router;