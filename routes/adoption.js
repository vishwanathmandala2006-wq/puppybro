const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { authenticate, requireAdminOrNGO } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Detailed error logging middleware
router.use((req, res, next) => {
    console.log(`[ADOPTION] ${req.method} ${req.path}`);
    next();
});

// Multer error handling - catches errors from upload middleware
const handleUploadError = (err, req, res, next) => {
    if (err) {
        console.error('[ADOPTION] Upload error:', {
            message: err.message,
            code: err.code,
            status: err.status || 400
        });
        return res.status(err.status || 400).json({
            error: err.message || 'File upload error',
            code: err.code
        });
    }
    next();
};

// Public/Protected routes
router.get('/listings', adoptionController.getListings); // Public - anyone can view
router.post('/apply', authenticate, adoptionController.applyForAdoption);
router.get('/my-applications', authenticate, adoptionController.getMyApplications);

// Admin/NGO routes - manage adoptions
router.get('/admin/listings', authenticate, requireAdminOrNGO, adoptionController.getAllListings);
router.post(
    '/admin/listing',
    authenticate,
    requireAdminOrNGO,
    (req, res, next) => {
        console.log('[ADOPTION] Processing listing creation:', {
            user: req.user?.id,
            contentType: req.headers['content-type'],
            bodyLength: JSON.stringify(req.body).length
        });
        next();
    },
    upload.single('image'),
    handleUploadError,
    adoptionController.createListing
);
router.put('/admin/listing/:listingId/status', authenticate, requireAdminOrNGO, adoptionController.updateListingStatus);
router.get('/admin/applications', authenticate, requireAdminOrNGO, adoptionController.getAllApplications);
router.put('/admin/application/:applicationId/status', authenticate, requireAdminOrNGO, adoptionController.updateApplicationStatus);

module.exports = router;
