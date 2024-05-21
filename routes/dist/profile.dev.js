"use strict";

var express = require('express');

var router = express.Router(); // Tambahkan middleware

router.get('/', function (req, res) {
  // Render profil
  res.render('profile'); // Pastikan Anda memiliki file profile.ejs di folder views
});
module.exports = router;
//# sourceMappingURL=profile.dev.js.map
