const { where } = require('sequelize');
const db = require('../models');
const moment = require('moment');
const path = require('path');
const Swal = require('sweetalert2');
const { Op } = require('sequelize'); 

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

      res.redirect('/pengajuanTerkirim'); // Redirect setelah berhasil update

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
    const userId = req.session.user.id;
    const userlogin = req.session.user;
    const userRole = userlogin.role;

    const pengajuan = await db.Pengajuan.findOne({
      where: { userId: userId }
    });

    let approvals = [];
    if (pengajuan) {
      approvals = await db.Approval.findAll({
        where: { pengajuanId: pengajuan.id },
        include: [{ model: db.Pengajuan }]
      });
    }

    res.render('user/status', {
      title: 'Status Pengajuan',
      user: userlogin,
      approvals: approvals,
      userRole
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.showRiwayat = async (req, res) => {
  const userlogin = req.session.user;
  const userRole = userlogin.role; // Mendapatkan role user

  const pengajuans = await db.Pengajuan.findAll();

  // console.log(pengajuans);

  if (!pengajuans) {
    throw new Error('Pengajuan not found');
  } else {
    var pengajuanss = new Array();
    pengajuans.forEach(pengajuan => {
      var d = new Date();
      const year = d.getFullYear();
      const month = d.getMonth();
      // var lastDay = new Date(year, month + 1, 0).getDate();
      var status = "";
      var periodesemester = "";
      var tglberenti = "";
      var batasperiode = "";

      const monthcreated = pengajuan.createdAt.toJSON().substring(5, 7);
      if (parseInt(monthcreated) <= 6) {
        periodesemester = year + "-" + "Ganjil";
        var lastDay = new Date(year, 6, 0).getDate();
        tglberenti = year + "-" + "06-" + lastDay;
        batasperiode = tglberenti;
        var tanggal1 = new moment(pengajuan.createdAt.toJSON().substring(0, 10));
        var tanggal2 = new moment(tglberenti);
        var selisih = tanggal2.diff(tanggal1, 'days');
        if (selisih < 0) {
          status = "BSS Berakhir";
        } else {
          status = "On Progress";
        }
      } else {
        periodesemester = year + "-" + "Genap";
        var lastDay = new Date(year, 12, 0).getDate();
        tglberenti = year + "-" + "12-" + lastDay;
        batasperiode = tglberenti;
        var tanggal1 = new moment(pengajuan.createdAt.toJSON().substring(0, 10));
        var tanggal2 = new moment(tglberenti);
        var selisih = tanggal2.diff(tanggal1, 'days');
        if (selisih < 0) {
          status = "BSS Berakhir";
        } else {
          status = "On Progress";
        }
      }

      var obj = { id: pengajuan.id, createdAt: pengajuan.createdAt, kendala_bss: pengajuan.kendala_bss, status: status, tglberenti: tglberenti, periodesemester: periodesemester, batasperiode: batasperiode, statuspemulihan: "-" };
      pengajuanss.push(obj);
    });

  }

  res.render('user/riwayatpengajuan', {
    title: 'riwayatpengajuan',
    pengajuans: pengajuanss,
    userRole
  });
};





exports.showRiwayatMahasiswa = async (req, res) => {
  try {
    const userlogin = req.session.user;
    const userRole = userlogin.role;

    const pengajuans = await db.Pengajuan.findAll({
      where: { userId: userlogin.id },
      include: [
        {
          model: db.Approval,
          as: 'approvals', // Ensure this matches your model association
        },
      ],
    });

    if (!pengajuans) {
      throw new Error('Pengajuan not found');
    }

    const pengajuanss = pengajuans.map(pengajuan => {
      const d = new Date();
      const year = d.getFullYear();
      const monthcreated = pengajuan.createdAt.getMonth() + 1;
      let periodesemester, tglberenti, status;

      if (monthcreated <= 6) {
        periodesemester = `${year}-Ganjil`;
        tglberenti = `${year}-06-${new Date(year, 6, 0).getDate()}`;
      } else {
        periodesemester = `${year}-Genap`;
        tglberenti = `${year}-12-${new Date(year, 12, 0).getDate()}`;
      }

      const selisih = moment(tglberenti).diff(moment(pengajuan.createdAt), 'days');
      status = selisih < 0 ? 'BSS Berakhir' : 'On Progress';

      const approval = pengajuan.approvals[0]; // Assuming one-to-one relationship for simplicity
      let approvalStatus = '';
      if (approval) {
        if (approval.statusApprovalKaprodi) {
          approvalStatus = 'Diterima Kaprodi';
        } else if (approval.statusApprovalWadek) {
          approvalStatus = 'Diterima Wakil Dekan 1';
        } else {
          approvalStatus = 'Verifikasi';
        }
      }

      return {
        id: pengajuan.id,
        createdAt: pengajuan.createdAt,
        kendala_bss: pengajuan.kendala_bss,
        status,
        tglberenti,
        periodesemester,
        batasperiode: tglberenti,
        statuspemulihan: '-',
        approvalStatus,
      };
    });

    res.render('user/riwayatpengajuanmahasiswa', {
      title: 'Riwayat Pengajuan',
      pengajuans: pengajuanss,
      userRole,
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
}
exports.showpPeriodeBSS = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const user = req.session.user; // Asumsikan req.user menyimpan informasi user yang sedang login
    const userRole = user.role; // Mendapatkan role user

    // Ambil pengajuan yang terhubung dengan userId
    const pengajuans = await db.Pengajuan.findAll({
      where: { userId: userId }
    });

    if (!pengajuans) {
      return res.status(404).send('Data pengajuan tidak ditemukan');
    } else {
      var pengajuanss = new Array();
      pengajuans.forEach(pengajuan => {

        var d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth();
        // var lastDay = new Date(year, month + 1, 0).getDate();
        var status = "";
        var periodesemester = "";
        const monthcreated = pengajuan.createdAt.toJSON().substring(5, 7);
        if (parseInt(monthcreated) <= 6) {
          periodesemester = year + "-" + "Ganjil";
          var lastDay = new Date(year, 6, 0).getDate();
          var tglberenti = year + "-" + "06-" + lastDay;

          var tanggal1 = new moment(pengajuan.createdAt.toJSON().substring(0, 10));
          var tanggal2 = new moment(tglberenti);
          var selisih = tanggal2.diff(tanggal1, 'days');
          if (selisih < 0) {
            status = "BSS Berakhir";
          } else {
            status = "On Progress";
          }
        } else {
          periodesemester = year + "-" + "Genap";
          var lastDay = new Date(year, 12, 0).getDate();
          var tglberenti = year + "-" + "12-" + lastDay;
          var tanggal1 = new moment(pengajuan.createdAt.toJSON().substring(0, 10));
          var tanggal2 = new moment(tglberenti);
          var selisih = tanggal2.diff(tanggal1, 'days');
          if (selisih < 0) {
            status = "BSS Berakhir";
          } else {
            status = "On Progress";
          }
        }

        var obj = { id: pengajuan.id, createdAt: pengajuan.createdAt,  status: status, periodesemester: periodesemester, skbss: "-"};
        pengajuanss.push(obj);
      });
    }

    // // Ambil dokumen_pendukung dari pengajuan
    // const dokumenPendukung = pengajuan.dokumen_pendukung ? pengajuan.dokumen_pendukung.split(',') : [];

    // Render halaman panduan dengan data dokumenPendukung
    res.render('user/periodeBSS', {
      title: 'Periode BSS',
      pengajuans: pengajuanss,
      userRole
    });
  } catch (error) {
    console.error('Error fetching supporting documents:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.showpStatusDaftarMahasiswa = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const user = req.session.user;
    const userRole = user.role;

    const pengajuans = await db.Pengajuan.findAll({
      include: [
        {
          model: db.Approval,
          required: false
        }
      ]
    });

    res.render('user/statusdaftarmahasiswa', {
      title: 'Status Periode Mahasiswa',
      pengajuans: pengajuans,
      userRole: userRole
    });
  } catch (error) {
    console.error('Error fetching pengajuans:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.detailPengajuan = async (req, res) => {
  try {
    // const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const user = req.session.user; // Asumsikan req.user menyimpan informasi user yang sedang login
    const userRole = user.role; // Mendapatkan role user

    // Ambil pengajuan yang terhubung dengan userId
    const pengajuans = await db.Pengajuan.findAll({
      where: { id: req.params.id }
    });

    if (!pengajuans) {
      return res.status(404).send('Data pengajuan tidak ditemukan');
    } 

    // // Ambil dokumen_pendukung dari pengajuan
    // const dokumenPendukung = pengajuan.dokumen_pendukung ? pengajuan.dokumen_pendukung.split(',') : [];

    // Render halaman panduan dengan data dokumenPendukung
    res.render('user/detailpengajuan', {
      title: 'Detail Pengajuan',
      pengajuans: pengajuans,
      userRole
    });
  } catch (error) {
    console.error('Error fetching supporting documents:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.pengajuanTerkirim = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const user = req.session.user; // Asumsikan req.user menyimpan informasi user yang sedang login
    const userRole = user.role; // Mendapatkan role user

    // Ambil semua pengajuan yang terhubung dengan userId
    const pengajuanList = await db.Pengajuan.findAll({
      where: { userId: userId }
    });


    // Process dokumen_pendukung for each pengajuan
    const riwayatPengajuan = pengajuanList.map(pengajuan => {
      return {
        ...pengajuan.dataValues,
        dokumenPendukung: pengajuan.dokumen_pendukung ? pengajuan.dokumen_pendukung.split(',') : []
      };
    });

    // Render halaman riwayat pengajuan dengan data pengajuan dan dokumenPendukung
    res.render('user/pengajuanTerkirim', {
      title: 'Pengajuan Terkirim',
      userRole,
      riwayatPengajuan // pass the fetched data to the view
    });
  } catch (error) {
    console.error('Error fetching pengajuan data:', error);
    res.status(500).send('Internal Server Error');
  }
};
