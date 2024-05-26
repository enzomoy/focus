const authAuthMiddleware = require('../middlewares/authMiddleware');
const authExpress = require('express');
const router = authExpress.Router();
const userController = require('../controllers/user');

router.get('/profile', [authAuthMiddleware, userController.profile]);
router.delete('/delete', [authAuthMiddleware, userController.delete]);

module.exports = router;