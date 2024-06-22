const express = require('express');
const router = express.Router();
const multer = require('multer');
const pengajuanController = require('../controllers/pengajuanController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const cekRole = require('../middlewares/cekRole');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
router.get('/pendaftaranBss', cekRole,ensureAuthenticated,pengajuanController.showRegisBss);
router.get('/status', cekRole,ensureAuthenticated,pengajuanController.showStatus);
router.get('/riwayatpengajuan', cekRole,ensureAuthenticated,pengajuanController.showRiwayat);
router.get('/panduan', cekRole,ensureAuthenticated,pengajuanController.showPanduan);
router.get('/profile', cekRole,ensureAuthenticated, pengajuanController.showProfile);
router.post('/pendaftaranBss', upload.single('dokumen_pendukung'), pengajuanController.createPermohonanBss);

module.exports = router;
