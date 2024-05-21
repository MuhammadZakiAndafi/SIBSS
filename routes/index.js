const server={}
const ubah_password = require('./ubah_password')

<<<<<<< HEAD
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
router.get('/editprofile', function(req, res, next) {
  res.render('editprofil', { title: 'EditProfile' });
});
=======

server.ubah_password = ubah_password
>>>>>>> 7039ff1690431ee71fcf80179fd517b86d597eb9

module.exports = server;