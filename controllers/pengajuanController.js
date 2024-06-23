const { where } = require('sequelize');
const db = require('../models');
const moment = require('moment');
const path = require('path');

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
      where: { userId: userId }
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
  const userlogin = req.session.user;
  const userRole = userlogin.role; // Mendapatkan role user

  const pengajuans = await db.Pengajuan.findAll({
    where: { userId: userlogin.id }
  });

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
