const authMiddleware = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/profile', [authMiddleware, userController.profile]);
router.get('/', [authMiddleware, userController.getUsers]);
router.get('/:id', [authMiddleware, userController.getUser]);
router.delete('/delete', [authMiddleware, userController.delete]);

module.exports = router;