const express = require('express');
const router = express.Router();
const { getRevenue } = require('../controllers/metricsController');
const { protect, authorize } = require('../middleware/auth');

// Public or protected depending on your preference. Here we allow any authenticated user.
// If you want public access, remove `protect`.
router.get('/revenue', /*protect, authorize('admin') ,*/ getRevenue);

module.exports = router;
