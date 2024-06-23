"use strict";

var db = require('../models');

var fs = require('fs');

var path = require('path');

var PDFDocument = require('pdfkit');

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

exports.generateSK = function _callee2(req, res) {
  var pengajuanId, pengajuan, doc, outputDir, filePath, output;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          pengajuanId = req.params.id; // Fetch pengajuan details

          _context2.next = 4;
          return regeneratorRuntime.awrap(db.Pengajuan.findOne({
            where: {
              id: pengajuanId
            },
            include: [db.SuratKeputusan] // Include SK if needed

          }));

        case 4:
          pengajuan = _context2.sent;

          if (pengajuan) {
            _context2.next = 8;
            break;
          }

          req.flash('error', 'Pengajuan tidak ditemukan.');
          return _context2.abrupt("return", res.redirect('/daftarPengajuan'));

        case 8:
          // Create a new PDF document
          doc = new PDFDocument(); // Set up the output file path and create the directory if it doesn't exist

          outputDir = path.join(__dirname, '..', 'output');

          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
          }

          filePath = path.join(outputDir, "sk_".concat(pengajuanId, ".pdf")); // Pipe the PDF into a writable stream

          output = fs.createWriteStream(filePath);
          doc.pipe(output); // Build the content of the PDF dynamically based on pengajuan data

          doc.fontSize(12);
          doc.text("Surat Keputusan");
          doc.moveDown(); // Insert content dynamically

          if (pengajuan.SuratKeputusan) {
            doc.text("Nomor Surat: ".concat(pengajuan.SuratKeputusan.nomor));
            doc.text("Tanggal: ".concat(pengajuan.SuratKeputusan.tanggal.toDateString()));
          } else {
            doc.text("Nomor Surat: -");
            doc.text("Tanggal: -");
          } // Add more content as needed
          // Finalize the PDF and close the stream


          doc.end(); // Save the SK to database

          if (pengajuan.SuratKeputusan) {
            _context2.next = 22;
            break;
          }

          _context2.next = 22;
          return regeneratorRuntime.awrap(db.SuratKeputusan.create({
            pengajuanId: pengajuanId,
            nomor: '',
            tanggal: new Date(),
            keterangan: '',
            lampiran: '' // Add more fields as needed

          }));

        case 22:
          // Send a success response
          res.status(201).send("SK generated successfully and saved to ".concat(filePath));
          _context2.next = 30;
          break;

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](0);
          console.error('Error generating SK:', _context2.t0);
          req.flash('error', 'Failed to generate SK');
          res.redirect('/daftarPengajuan');

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 25]]);
};
//# sourceMappingURL=skController.dev.js.map
