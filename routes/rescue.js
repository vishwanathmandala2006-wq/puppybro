const express = require('express');
const router = express.Router();
const rescueController = require('../controllers/rescueController');
const { authenticate, requireAdmin, requireAdminOrNGO, requireVolunteer } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Protected routes - all require authentication
router.post('/report', authenticate, upload.single('image'), rescueController.submitReport);
router.get('/my-reports', authenticate, rescueController.getMyReports);

// Volunteer routes (must come before /:reportId to avoid conflicts)
router.get('/volunteer/cases', authenticate, requireVolunteer, rescueController.getVolunteerCases);
router.put('/volunteer/:reportId/update-status', authenticate, requireVolunteer, rescueController.updateStatus);

// Admin/NGO routes - view all reports and update status
router.get('/admin/all', authenticate, requireAdminOrNGO, rescueController.getAllReports);
router.put('/admin/:reportId/update-status', authenticate, requireAdminOrNGO, rescueController.updateStatus);

// Admin only routes - assign volunteers (only admin can assign)
router.put('/admin/:reportId/assign', authenticate, requireAdmin, rescueController.assignVolunteer);

// General routes (must come last)
router.get('/:reportId', authenticate, rescueController.getReportById);

module.exports = router;
