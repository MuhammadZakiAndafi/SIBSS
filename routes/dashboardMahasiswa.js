var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validToken');
const role= require ('../middleware/checkRole');
const { changePassword }= require ('../controller/auth');
const checkRole = require('../middleware/checkRole');
const { User } = require('../models');

router.get('/mahasiswa/home', verifyToken, checkRole("mahasiswa"), function(req, res) {
  const userId = req.userId;
  const userEmail = req.userEmail;
  const userName = req.userName;
  const userroleId = req.userroleId;
  const userRole = req.userRole;

  res.render('mahasiswa/home', { userId,userEmail,userName,userroleId,userRole });
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
    const user = await User.findOne(); 
    res.render('profile', { user: user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
