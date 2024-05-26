const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAdmin = require('../middlewares/isAdmin')

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', [authMiddleware, authController.logout]);

module.exports = router;