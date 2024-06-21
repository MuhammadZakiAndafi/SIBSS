const express = require('express');
const router = express.Router();
const skController = require('../controllers/skController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const cekRole = require('../middlewares/cekRole');

router.get('/suratkeputusan', cekRole,ensureAuthenticated,skController.showSk);

module.exports = router;
