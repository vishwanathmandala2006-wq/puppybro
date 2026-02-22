const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

// Public routes - validation applied per OWASP
router.post('/register', validate('register'), authController.register);
router.post('/login', validate('login'), authController.login);
router.post('/register-ngo', validate('registerNGO'), authController.registerNGO);

// Protected routes
router.post('/volunteer-register', authenticate, authController.registerVolunteer);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
