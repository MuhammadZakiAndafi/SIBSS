const express = require('express');
const router = express.Router();
const approvalController = require('../controllers/approvalController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const cekRole = require('../middlewares/cekRole');

router.get('/daftarPengajuan', cekRole,ensureAuthenticated,approvalController.daftarPengajuan);
router.get('/detail/:id', cekRole,ensureAuthenticated,approvalController.showDetail);
router.post('/approval', approvalController.updateApprovalStatus);


module.exports = router;
