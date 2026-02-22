const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdminOrNGO } = require('../middleware/auth');

// Public route - no authentication required
router.get('/stats', adminController.getPublicStats);

// All admin routes require authentication and admin/NGO role
router.get('/dashboard/stats', authenticate, requireAdminOrNGO, adminController.getDashboardStats);
router.get('/volunteers', authenticate, requireAdminOrNGO, adminController.getAllVolunteers);

module.exports = router;
