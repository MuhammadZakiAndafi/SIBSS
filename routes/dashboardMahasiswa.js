var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validToken');
const role= require ('../middleware/checkRole');
const { changePassword }= require ('../controller/auth');
const checkRole = require('../middleware/checkRole');
const { User } = require('../models');

router.get('/mahasiswa/home', verifyToken, checkRole("mahasiswa"), function(req, res) {// akses data
  const userId = req.userId;
  const userEmail = req.userEmail;
  const userName = req.userName;
  const userroleId = req.userroleId;
  const userRole = req.userRole;

  res.render('mahasiswa/home', { userId,userEmail,userName,userroleId,userRole });//akses front end
});

router.get('/mahasiswa/profile', verifyToken, function(req, res, next) {
  const userId = req.userId;
  const userEmail = req.userEmail;
  const userName = req.userName;
  const userroleId = req.userroleId;
  const userRole = req.userRole;

  res.render('mahasiswa/profile', { userId,userEmail,userName,userroleId,userRole  });
});

router.get('/mahasiswa/ubahPassword',verifyToken, function(req, res, next) {
  const userId = req.userId;
  const userEmail = req.userEmail;
  const userName = req.userName;
  const userroleId = req.userroleId;
  const userRole = req.userRole;

  res.render('mahasiswa/ubahPassword', { userId,userEmail,userName,userroleId,userRole  });
});

router.post('/change-password', verifyToken, async (req, res) => {
  try {
    await changePassword(req, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.get('/profile', async function(req, res, next) {
  try {
    const user = await User.findOne(); // Ambil user pertama dari database
    res.render('profile', { user: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
/* const express = require('express');
const router = express.Router();

// Route dashboard
router.get('/', (req, res) => {
  try {
    if (req.session.loggedin) {
      res.render('dashboard', { username: req.session.username });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error in dashboard route:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router; */