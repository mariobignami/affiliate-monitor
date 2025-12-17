const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validateRequest = require('../middleware/validator');
const { userSchemas } = require('../../utils/validators');

// Public routes
router.post('/register', validateRequest(userSchemas.register), authController.register);
router.post('/login', validateRequest(userSchemas.login), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

module.exports = router;
