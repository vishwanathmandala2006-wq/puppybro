const express = require('express');
const router = express.Router();
const sterilizationController = require('../controllers/sterilizationController');
const { authenticate, requireAdminOrNGO } = require('../middleware/auth');

// Protected routes
router.post('/report', authenticate, sterilizationController.submitReport);
router.get('/my-reports', authenticate, sterilizationController.getMyReports);

// Admin/NGO routes
router.get('/admin/all', authenticate, requireAdminOrNGO, sterilizationController.getAllReports);
router.put('/:reportId/status', authenticate, requireAdminOrNGO, sterilizationController.updateStatus);

module.exports = router;
