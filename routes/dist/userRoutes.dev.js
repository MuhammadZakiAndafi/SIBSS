"use strict";

var express = require('express');

var router = express.Router();

var userController = require('../controllers/userController');

router.get('/login', userController.showLoginForm);
router.post('/login', userController.login);
router.get('/register', userController.showRegisterForm);
router.post('/register', userController.register);
router.get('/logout', userController.logout);
module.exports = router;
//# sourceMappingURL=userRoutes.dev.js.map
