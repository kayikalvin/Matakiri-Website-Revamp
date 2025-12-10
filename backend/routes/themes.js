const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', themeController.getThemes);
router.get('/active', themeController.getActiveTheme);
router.get('/:id', themeController.getTheme);

// Protected routes (require auth + admin)
router.post('/', protect, authorize('admin'), themeController.createTheme);
router.put('/:id', protect, authorize('admin'), themeController.updateTheme);
router.delete('/:id', protect, authorize('admin'), themeController.deleteTheme);
router.put('/:id/activate', protect, authorize('admin'), themeController.activateTheme);

module.exports = router;
