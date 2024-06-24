"use strict";

var express = require('express');

var router = express.Router();

var multer = require('multer');

var pengajuanController = require('../controllers/pengajuanController');

var ensureAuthenticated = require('../middlewares/authMiddleware');

var cekRole = require('../middlewares/cekRole');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.get('/pendaftaranBss', cekRole, ensureAuthenticated, pengajuanController.showRegisBss);
router.get('/status', cekRole, ensureAuthenticated, pengajuanController.showStatus);
router.get('/riwayatpengajuan', cekRole, ensureAuthenticated, pengajuanController.showRiwayat);
router.get('/panduan', cekRole, ensureAuthenticated, pengajuanController.showPanduan);
router.post('/pendaftaranBss', upload.single('dokumen_pendukung'), pengajuanController.createPermohonanBss);
router.get('/riwayatMhs', cekRole, ensureAuthenticated, pengajuanController.showRiwayatMhs);
module.exports = router;
//# sourceMappingURL=pengajuanRoutes.dev.js.map
