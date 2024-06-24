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
router.post('/pendaftaranBss', upload.single('dokumen_pendukung'), pengajuanController.createPermohonanBss);
router.get('/editPengajuan/:id', pengajuanController.editPengajuan);
router.post('/updatePengajuan/:id', upload.single('dokumen_pendukung'), pengajuanController.updatePengajuan);
router.delete('/hapusPengajuan/:id', pengajuanController.hapusPengajuan);


module.exports = router;
