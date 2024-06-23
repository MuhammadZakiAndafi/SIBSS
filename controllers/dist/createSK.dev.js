"use strict";

var PDFDocument = require('pdfkit');

var fs = require('fs');

var ejs = require('ejs');

var _require = require('util'),
    promisify = _require.promisify;

var db = require('../models');

exports.generate = function _callee(req, res) {
  var generatePDF, userId, userlogin, userRole, pengajuan, sks, renderFile;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          generatePDF = function generatePDF(data, outputPath) {
            var html, doc;
            return regeneratorRuntime.async(function generatePDF$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap(renderFile(__dirname + '/views/template.ejs', data));

                  case 2:
                    html = _context.sent;
                    doc = new PDFDocument();
                    doc.pipe(fs.createWriteStream(outputPath));
                    doc.text(html, {
                      align: 'justify'
                    });
                    doc.end();

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login

          userlogin = req.session.user;
          userRole = userlogin.role; // Mendapatkan role user
          // Ambil pengajuan yang terhubung dengan userId

          _context2.next = 7;
          return regeneratorRuntime.awrap(db.Pengajuan.findOne({
            where: {
              userId: userId
            }
          }));

        case 7:
          pengajuan = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(db.SuratKeputusan.findAll({
            where: {
              pengajuanId: pengajuan.id
            },
            include: [{
              model: db.Pengajuan
            }]
          }));

        case 10:
          sks = _context2.sent;
          res.render('/template', {
            sks: sks,
            title: 'Surat Keputusan',
            userRole: userRole
          });
          renderFile = promisify(ejs.renderFile);
          module.exports = generatePDF;
          _context2.next = 20;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          console.error('Error generating PDF:', _context2.t0);
          res.status(500).send('Internal Server Error');

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};
//# sourceMappingURL=createSK.dev.js.map
