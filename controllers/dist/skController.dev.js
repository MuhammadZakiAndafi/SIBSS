"use strict";

var db = require('../models');

var PDFDocument = require('pdfkit');

var fs = require("fs");

exports.showSk = function _callee(req, res) {
  var userId, userlogin, userRole, pengajuan, sks;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login

          userlogin = req.session.user;
          userRole = userlogin.role; // Mendapatkan role user
          // Ambil pengajuan yang terhubung dengan userId

          _context.next = 6;
          return regeneratorRuntime.awrap(db.Pengajuan.findOne({
            where: {
              userId: userId
            }
          }));

        case 6:
          pengajuan = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(db.SuratKeputusan.findAll({
            where: {
              pengajuanId: pengajuan.id
            },
            include: [{
              model: db.Pengajuan
            }]
          }));

        case 9:
          sks = _context.sent;
          res.render('user/suratkeputusan', {
            sks: sks,
            title: 'Surat Keputusan',
            userRole: userRole
          });
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.error('Error fetching surat keputusan:', _context.t0);
          res.status(500).send('Internal Server Error');

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.downloadSK = function _callee2(req, res) {
  var userId, userlogin, userRole, pengajuan, sks, doc;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login

          userlogin = req.session.user;
          userRole = userlogin.role; // Mendapatkan role user
          // Ambil pengajuan yang terhubung dengan userId

          _context2.next = 5;
          return regeneratorRuntime.awrap(db.Pengajuan.findOne({
            where: {
              userId: userId
            }
          }));

        case 5:
          pengajuan = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(db.SuratKeputusan.findAll({
            where: {
              pengajuanId: pengajuan.id
            },
            include: [{
              model: db.Pengajuan
            }]
          }));

        case 8:
          sks = _context2.sent;
          res.render('user/suratkeputusan', {
            sks: sks,
            title: 'Surat Keputusan',
            userRole: userRole
          }); // Buat dokumen PDF baru

          doc = new PDFDocument();
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', "attachment; filename=\"SK-BSS-".concat(user.name, ".pdf\"")); // Pipe output PDF ke response

          doc.pipe(res); // Tambahkan konten ke PDF

          doc.fontSize(20).text("Surat Keputusan Berhenti Studi Sementara Tahun Ajaran 2024/2025 ".concat(pengajuan.fakultas), {
            align: 'center'
          });
          doc.moveDown(0.1);
          pengajuan.forEach(function (pengajuan, index) {
            doc.fontSize(12).text("".concat(index + 1, ". Nomor surat: ").concat(pengajuan.id));
            doc.text("   Nama: ".concat(pengajuan.name));
            doc.text("   Nim: ".concat(pengajuan.nim));
            doc.text("   SKS: ".concat(pengajuan.sks));
            doc.moveDown(0.1);
          }); // Selesaikan dokumen

          doc.end();

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};
//# sourceMappingURL=skController.dev.js.map
