const express = require('express');
const router = express.Router();
const skController = require('../controllers/skController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const cekRole = require('../middlewares/cekRole');

router.get('/suratkeputusan', cekRole,ensureAuthenticated,skController.showSk);
router.get('/suratkeputusan/generate/:id', cekRole, ensureAuthenticated, skController.generateSK);

router.get('/generate-pdf/:id', skController.generateSK);
module.exports = router;
