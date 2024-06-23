"use strict";

var express = require('express');

var router = express.Router();

var skController = require('../controllers/skController');

var ensureAuthenticated = require('../middlewares/authMiddleware');

var cekRole = require('../middlewares/cekRole');

router.get('/suratkeputusan', cekRole, ensureAuthenticated, skController.showSk);
router.get('/suratkeputusan/generate/:id', cekRole, ensureAuthenticated, skController.generateSK);
router.get('/generate-pdf/:id', skController.generateSK);
module.exports = router;
//# sourceMappingURL=skRoutes.dev.js.map
