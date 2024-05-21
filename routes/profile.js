const express = require('express');
const router = express.Router();

// Tambahkan middleware
router.get('/', (req, res) => {
  // Render profil
  res.render('profile'); // Pastikan Anda memiliki file profile.ejs di folder views
});

module.exports = router;