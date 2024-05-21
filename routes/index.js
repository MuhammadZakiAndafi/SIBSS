var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.get('/sidebar', function(req, res, next) {
  res.render('sidebar', { title: 'sidebar' });
});

router.get('/profile', function(req, res, next) {
  res.render('profile', { title: 'profile' });
});


module.exports = router;
