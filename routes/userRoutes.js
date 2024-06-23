const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const cekRole = require('../middlewares/cekRole');

router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.get('/profile', cekRole,ensureAuthenticated, userController.showProfile);
router.post('/profile', userController.profile);
module.exports = router;
