"use strict";

var db = require('../models');

exports.showRegisBss = function _callee(req, res) {
  var user, userlogin, userRole;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              id: req.session.user.id
            }
          }));

        case 3:
          user = _context.sent;
          userlogin = req.session.user;
          userRole = userlogin.role; // Mendapatkan role user

          res.render('user/pendaftaranBSS', {
            title: 'Pendaftaran BSS',
            user: user,
            userRole: userRole
          });
          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching user:', _context.t0);
          res.status(500).send('Internal Server Error');

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.showPanduan = function _callee2(req, res) {
  var userId, user, userRole, pengajuan, dokumenPendukung;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login

          user = req.session.user; // Asumsikan req.user menyimpan informasi user yang sedang login

          userRole = user.role; // Mendapatkan role user
          // Ambil pengajuan yang terhubung dengan userId

          _context2.next = 6;
          return regeneratorRuntime.awrap(db.Pengajuan.findOne({
            where: {
              userId: userId
            }
          }));

        case 6:
          pengajuan = _context2.sent;

          if (pengajuan) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.status(404).send('Data pengajuan tidak ditemukan'));

        case 9:
          // Ambil dokumen_pendukung dari pengajuan
          dokumenPendukung = pengajuan.dokumen_pendukung ? pengajuan.dokumen_pendukung.split(',') : []; // Render halaman panduan dengan data dokumenPendukung

          res.render('user/panduan', {
            title: 'Panduan',
            dokumenPendukung: dokumenPendukung,
            userRole: userRole
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error('Error fetching supporting documents:', _context2.t0);
          res.status(500).send('Internal Server Error');

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.showStatus = function _callee3(req, res) {
  var userId, userlogin, userRole, pengajuan, approvals;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          // Ambil data pengguna yang sedang login
          userId = req.session.user.id;
          userlogin = req.session.user;
          userRole = userlogin.role; // Mendapatkan role user
          // Ambil pengajuanId dari model Pengajuan berdasarkan userId

          _context3.next = 6;
          return regeneratorRuntime.awrap(db.Pengajuan.findOne({
            where: {
              userId: userId
            }
          }));

        case 6:
          pengajuan = _context3.sent;

          if (pengajuan) {
            _context3.next = 9;
            break;
          }

          throw new Error('Pengajuan not found');

        case 9:
          _context3.next = 11;
          return regeneratorRuntime.awrap(db.Approval.findAll({
            where: {
              pengajuanId: pengajuan.id
            },
            include: [{
              model: db.Pengajuan
            }]
          }));

        case 11:
          approvals = _context3.sent;
          // Render halaman status dengan data approvals dan pengguna yang sedang login
          res.render('user/status', {
            title: 'Status Pengajuan',
            user: req.session.user,
            // Data pengguna yang sedang login
            approvals: approvals,
            userRole: userRole
          });
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](0);
          console.error('Error fetching approvals:', _context3.t0);
          res.status(500).send('Internal Server Error');

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.showRiwayat = function (req, res) {
  var userlogin = req.session.user;
  var userRole = userlogin.role; // Mendapatkan role user

  res.render('user/riwayatpengajuan', {
    title: 'riwayatpengajuan',
    userRole: userRole
  });
};

exports.showRiwayatMhs = function (req, res) {
  var userlogin = req.session.user;
  var userRole = userlogin.role; // Mendapatkan role user

  res.render('user/riwayatMhs', {
    title: 'Riwayat Mahasiswa',
    userRole: userRole
  });
};

exports.createPermohonanBss = function _callee4(req, res) {
  var _req$body, nama_lengkap, nim, tanggal_lahir, jenis_kelamin, alamat, no_hp, departement, fakultas, kendala_bss, alasan_berhenti, dokumen_pendukung, userId, permohonan;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _req$body = req.body, nama_lengkap = _req$body.nama_lengkap, nim = _req$body.nim, tanggal_lahir = _req$body.tanggal_lahir, jenis_kelamin = _req$body.jenis_kelamin, alamat = _req$body.alamat, no_hp = _req$body.no_hp, departement = _req$body.departement, fakultas = _req$body.fakultas, kendala_bss = _req$body.kendala_bss, alasan_berhenti = _req$body.alasan_berhenti;
          dokumen_pendukung = null;

          if (req.file) {
            dokumen_pendukung = req.file.filename;
          }

          userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login

          _context4.next = 7;
          return regeneratorRuntime.awrap(db.Pengajuan.create({
            nama_lengkap: nama_lengkap,
            nim: nim,
            tanggal_lahir: tanggal_lahir,
            jenis_kelamin: jenis_kelamin,
            alamat: alamat,
            no_hp: no_hp,
            departement: departement,
            fakultas: fakultas,
            kendala_bss: kendala_bss,
            alasan_berhenti: alasan_berhenti,
            dokumen_pendukung: dokumen_pendukung,
            userId: userId // Pastikan nama kolom 'UserId' sesuai dengan definisi model Pengajuan

          }));

        case 7:
          permohonan = _context4.sent;
          console.log('Permohonan berhasil dibuat:', permohonan);
          res.redirect('/pendaftaranBss');
          _context4.next = 16;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](0);
          console.error('Terjadi kesalahan saat membuat permohonan:', _context4.t0);
          res.status(500).json({
            message: 'Terjadi kesalahan pada server',
            error: _context4.t0
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 12]]);
};
//# sourceMappingURL=pengajuanController.dev.js.map
