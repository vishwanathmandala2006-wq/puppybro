const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { authenticate, requireAdminOrNGO } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public/Protected routes
router.get('/listings', adoptionController.getListings); // Public - anyone can view
router.post('/apply', authenticate, adoptionController.applyForAdoption);
router.get('/my-applications', authenticate, adoptionController.getMyApplications);

// Admin/NGO routes - manage adoptions
router.get('/admin/listings', authenticate, requireAdminOrNGO, adoptionController.getAllListings);
router.post('/admin/listing', authenticate, requireAdminOrNGO, upload.single('image'), adoptionController.createListing);
router.put('/admin/listing/:listingId/status', authenticate, requireAdminOrNGO, adoptionController.updateListingStatus);
router.get('/admin/applications', authenticate, requireAdminOrNGO, adoptionController.getAllApplications);
router.put('/admin/application/:applicationId/status', authenticate, requireAdminOrNGO, adoptionController.updateApplicationStatus);

module.exports = router;
