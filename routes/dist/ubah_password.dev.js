"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../controller/ubah_password');

router.post('/ubahPassword', controller.ubah_password);
router.get('/ubah_password', controller.formUbahPassword);
module.exports = router;
//# sourceMappingURL=ubah_password.dev.js.map
