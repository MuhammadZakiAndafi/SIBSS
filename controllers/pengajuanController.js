const db = require('../models');
const path = require('path');
const Swal = require('sweetalert2');


exports.showRegisBss = async (req, res) => {
  try {
    const user = await db.User.findOne({ where: { id: req.session.user.id } });
    const userlogin = req.session.user;
    const userRole = userlogin.role; // Mendapatkan role user
    res.render('user/pendaftaranBSS', { 
      title: 'Pendaftaran BSS',
      user: user,
      userRole
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.editPengajuan = async (req, res) => {
  try {
    const pengajuanId = req.params.id; // Get the pengajuan ID from the URL parameter
    const user = await db.User.findOne({ where: { id: req.session.user.id } }); // Get the logged-in user's data
    const userlogin = req.session.user;
    const userRole = userlogin.role; // Get the user role

    // Fetch the specific pengajuan record
    const pengajuan = await db.Pengajuan.findOne({ where: { id: pengajuanId, userId: req.session.user.id } });

    if (!pengajuan) {
      return res.status(404).send('Pengajuan not found');
    }

    res.render('user/editPengajuan', {
      title: 'Edit Pengajuan',
      user: user,
      userRole,
      pengajuan // Pass the pengajuan data to the view
    });
  } catch (error) {
    console.error('Error fetching pengajuan:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updatePengajuan = async (req, res) => {
  try {
      const pengajuanId = req.params.id; // Ambil ID pengajuan dari parameter URL
      const { nama_lengkap, nim, tanggal_lahir, jenis_kelamin, alamat, no_hp, departement, fakultas, kendala_bss, alasan_berhenti } = req.body; // Ambil data dari body request
      let dokumen_pendukung = null;
      
      // Jika ada file yang diunggah, simpan nama filenya
      if (req.file) {
          dokumen_pendukung = req.file.filename;
      }

      // Pastikan pengajuan ditemukan dan pengguna memiliki izin
      const pengajuan = await db.Pengajuan.findOne({
          where: {
              id: pengajuanId,
              userId: req.session.user.id // Pastikan pengajuan hanya dapat diupdate oleh pemiliknya
          }
      });

      if (!pengajuan) {
          return res.status(404).send('Pengajuan not found or you are not authorized to update it');
      }

      // Update pengajuan berdasarkan ID
      const [updatedRows] = await db.Pengajuan.update({
          nama_lengkap,
          nim,
          tanggal_lahir,
          jenis_kelamin,
          alamat,
          no_hp,
          departement,
          fakultas,
          kendala_bss,
          alasan_berhenti,
          dokumen_pendukung
      }, {
          where: {
              id: pengajuanId
          }
      });

      if (updatedRows === 0) {
          return res.status(404).send('Pengajuan not found or you are not authorized to update it');
      }

      res.redirect('/riwayatPengajuan'); // Redirect setelah berhasil update

  } catch (error) {
      console.error('Error updating pengajuan:', error);
      res.status(500).send('Internal Server Error');
  }
};





exports.showPanduan = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const user = req.session.user; // Asumsikan req.user menyimpan informasi user yang sedang login
    const userRole = user.role; // Mendapatkan role user

    // Ambil pengajuan yang terhubung dengan userId
    const pengajuan = await db.Pengajuan.findOne({
      where: { userId: userId }
    });

    if (!pengajuan) {
      return res.status(404).send('Data pengajuan tidak ditemukan');
    }

    // Ambil dokumen_pendukung dari pengajuan
    const dokumenPendukung = pengajuan.dokumen_pendukung ? pengajuan.dokumen_pendukung.split(',') : [];

    // Render halaman panduan dengan data dokumenPendukung
    res.render('user/panduan', {
      title: 'Panduan',
      dokumenPendukung: dokumenPendukung,
      userRole
    });
  } catch (error) {
    console.error('Error fetching supporting documents:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.showStatus = async (req, res) => {
  try {
    // Ambil data pengguna yang sedang login
    const userId = req.session.user.id;
    const userlogin = req.session.user;
    const userRole = userlogin.role; // Mendapatkan role user

    // Ambil pengajuanId dari model Pengajuan berdasarkan userId
    const pengajuan = await db.Pengajuan.findOne({
      where: { userId }
    }); 

    if (!pengajuan) {
      throw new Error('Pengajuan not found');
    }

    // Ambil data Approval berdasarkan pengajuanId
    const approvals = await db.Approval.findAll({
      where: { pengajuanId: pengajuan.id },
      include: [{ model: db.Pengajuan }]
    });

    // Render halaman status dengan data approvals dan pengguna yang sedang login
    res.render('user/status', {
      title: 'Status Pengajuan',
      user: req.session.user, // Data pengguna yang sedang login
      approvals,
      userRole
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.showRiwayat = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const user = req.session.user; // Asumsikan req.user menyimpan informasi user yang sedang login
    const userRole = user.role; // Mendapatkan role user

    // Ambil semua pengajuan yang terhubung dengan userId
    const pengajuanList = await db.Pengajuan.findAll({
      where: { userId: userId }
    });

    if (!pengajuanList || pengajuanList.length === 0) {
      return res.status(404).send('Data pengajuan tidak ditemukan');
    }

    // Process dokumen_pendukung for each pengajuan
    const riwayatPengajuan = pengajuanList.map(pengajuan => {
      return {
        ...pengajuan.dataValues,
        dokumenPendukung: pengajuan.dokumen_pendukung ? pengajuan.dokumen_pendukung.split(',') : []
      };
    });

    // Render halaman riwayat pengajuan dengan data pengajuan dan dokumenPendukung
    res.render('user/riwayatpengajuan', {
      title: 'Riwayat Pengajuan',
      userRole,
      riwayatPengajuan // pass the fetched data to the view
    });
  } catch (error) {
    console.error('Error fetching pengajuan data:', error);
    res.status(500).send('Internal Server Error');
  }
};





exports.createPermohonanBss = async (req, res) => {
  try {
    const {
      nama_lengkap, nim, tanggal_lahir, jenis_kelamin,
      alamat, no_hp, departement, fakultas,
      kendala_bss, alasan_berhenti
    } = req.body;

    let dokumen_pendukung = null;
    if (req.file) {
      dokumen_pendukung = req.file.filename;
    }

    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login

    const permohonan = await db.Pengajuan.create({
      nama_lengkap, nim, tanggal_lahir, jenis_kelamin,
      alamat, no_hp, departement, fakultas,
      kendala_bss, alasan_berhenti, dokumen_pendukung,
      userId: userId // Pastikan nama kolom 'UserId' sesuai dengan definisi model Pengajuan
    });

    console.log('Permohonan berhasil dibuat:', permohonan);
    res.redirect('/pendaftaranBss');
  } catch (error) {
    console.error('Terjadi kesalahan saat membuat permohonan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
  }
};

exports.hapusPengajuan = async (req, res) => {
  try {
      const pengajuanId = req.params.id; // Ambil ID pengajuan dari parameter URL

      // Lakukan proses penghapusan berdasarkan ID
      const deletedRows = await db.Pengajuan.destroy({
          where: {
              id: pengajuanId
          }
      });

      if (deletedRows === 0) {
          return res.status(404).send('Pengajuan not found or you are not authorized to delete it');
      }

      res.status(200).send('Pengajuan berhasil dihapus');
  } catch (error) {
      console.error('Error deleting pengajuan:', error);
      res.status(500).send('Internal Server Error');
  }
};