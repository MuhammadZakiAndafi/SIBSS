"use strict";

var express = require('express');

var router = express.Router();

var ubah_password = require('./ubah_password');
/* GET home page. */


router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});
router.get('/dashboard', function (req, res, next) {
  res.render('dashboard', {
    title: 'Dashboard'
  });
});
router.get('/profile', function (req, res, next) {
  res.render('profile', {
    title: 'Profile'
  });
});
router.get('/editprofile', function (req, res, next) {
  res.render('editprofile', {
    title: 'EditProfile'
  });
});
router.get('/ubah_password', function (req, res, next) {
  res.render('ubah_password', {
    title: 'UbahPassword'
  });
});
module.exports = router;
//# sourceMappingURL=index.dev.js.map
