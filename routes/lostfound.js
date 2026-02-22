const express = require('express');
const router = express.Router();
const lostfoundController = require('../controllers/lostfoundController');
const { authenticate, requireAdminOrNGO } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const upload = require('../middleware/upload');

// Protected routes
router.post('/lost', authenticate, upload.single('image'), lostfoundController.reportLostPet);
router.post('/found', authenticate, upload.single('image'), lostfoundController.reportFoundDog);
// Public search: visible to all users (including volunteers and guests)
router.get('/search', lostfoundController.searchPets);

// Admin/NGO routes - with validation for status updates
router.get('/admin/lost', authenticate, requireAdminOrNGO, lostfoundController.getAllLostPets);
router.get('/admin/found', authenticate, requireAdminOrNGO, lostfoundController.getAllFoundPets);
router.put('/lost/:petId/status', authenticate, requireAdminOrNGO, validate('statusUpdate'), lostfoundController.updateLostPetStatus);
router.put('/found/:petId/status', authenticate, requireAdminOrNGO, validate('statusUpdate'), lostfoundController.updateFoundPetStatus);

module.exports = router;
