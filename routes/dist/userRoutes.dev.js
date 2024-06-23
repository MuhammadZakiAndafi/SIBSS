"use strict";

var express = require('express');

var router = express.Router();

var userController = require('../controllers/userController');

var ensureAuthenticated = require('../middlewares/authMiddleware');

var cekRole = require('../middlewares/cekRole');

router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.get('/profile', cekRole, ensureAuthenticated, userController.showProfile);
router.post('/profile', userController.profile);
module.exports = router;
//# sourceMappingURL=userRoutes.dev.js.map
