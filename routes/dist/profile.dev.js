"use strict";

var express = require('express');

var router = express.Router();

var ensureAuthenticated = require('../middlewares/authMiddleware');

var cekRole = require('../middlewares/cekRole');

router.get('/profile', cekRole, ensureAuthenticated, pengajuanController.showProfile);
module.exports = router;
//# sourceMappingURL=profile.dev.js.map
