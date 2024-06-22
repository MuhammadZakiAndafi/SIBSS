const db = require('../models');

exports.daftarPengajuan = async (req, res) => {
  const userlogin = req.session.user;
  const userRole = userlogin.role; // Mendapatkan role user
  const pengajuans = await db.Pengajuan.findAll();
  res.render('user/daftarPengajuan', {
     pengajuans,
     userRole
     });
};

exports.showDetail = async (req, res) => {
  try {
    const pengajuanId = req.params.id;
    const userlogin = req.session.user;
    const userRole = userlogin.role; // Mendapatkan role user
    const pengajuan = await db.Pengajuan.findOne({
      where: { id: pengajuanId }
    });

    if (!pengajuan) {
      req.flash('error', 'Pengajuan tidak ditemukan.');
      return res.redirect('/daftarPengajuan'); 
    }

    const user = req.session.user;

    res.render('user/approval', {
      title: 'Detail Pengajuan',
      pengajuan: pengajuan,
      user,
      userRole
    });
  } catch (error) {
    console.error('Error fetching pengajuan detail:', error);
    req.flash('error', 'Terjadi kesalahan pada server.');
    res.status(500).redirect('/daftarPengajuan'); 
  }
};

exports.updateApprovalStatus = async (req, res) => {
  const { approvalType, action, pengajuanId } = req.body;

  try {
    let updateData = {};
    let currentDate = new Date();

    if (approvalType === 'kaprodi') {
      updateData = {
        statusApprovalKaprodi: action === 'approve' ? '1' : '0',
        tanggalApprovalKaprodi: currentDate,
      };
    } else if (approvalType === 'wadek') {
      updateData = {
        statusApprovalWadek: action === 'approve' ? '1' : '0',
        tanggalApprovalWadek: currentDate,
      };
    }

    // Gunakan findOrCreate untuk mencari atau membuat record baru
    const [approval, created] = await db.Approval.findOrCreate({
      where: { pengajuanId },
      defaults: {
        pengajuanId,
        ...updateData
      }
    });

    // Jika record ditemukan, lakukan update
    if (!created) {
      await approval.update(updateData);
    }

    req.flash('success', 'Approval status updated successfully');
    res.redirect('/daftarPengajuan');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update approval status');
    res.redirect('/daftarPengajuan');
  }
};

