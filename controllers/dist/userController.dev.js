"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bcrypt = require('bcryptjs');

var db = require('../models');

exports.showLoginForm = function (req, res) {
  res.render('auth/login', {
    title: 'Login'
  });
};

exports.login = function _callee(req, res) {
  var _req$body, email, password, _user;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              email: email
            }
          }));

        case 4:
          _user = _context.sent;
          _context.t0 = _user;

          if (!_context.t0) {
            _context.next = 10;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, _user.password));

        case 9:
          _context.t0 = _context.sent;

        case 10:
          if (!_context.t0) {
            _context.next = 15;
            break;
          }

          req.session.user = _user;
          res.redirect('/pendaftaranBss');
          _context.next = 16;
          break;

        case 15:
          res.status(401).send('Invalid email or password');

        case 16:
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t1 = _context["catch"](1);
          console.error(_context.t1);
          res.status(500).send('Internal Server Error');

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 18]]);
};

exports.showRegisterForm = function (req, res) {
  res.render('auth/register', {
    title: 'Register'
  });
};

exports.register = function _callee2(req, res) {
  var _req$body2, nim, name, email, password, role, hashedPassword, _user2;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, nim = _req$body2.nim, name = _req$body2.name, email = _req$body2.email, password = _req$body2.password, role = _req$body2.role;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 4:
          hashedPassword = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(db.User.create({
            nim: nim,
            name: name,
            email: email,
            password: hashedPassword,
            role: role
          }));

        case 7:
          _user2 = _context2.sent;
          req.session.user = _user2;
          res.redirect('/login');
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](1);
          console.error(_context2.t0);
          res.status(400).send('User already exists');

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

exports.logout = function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }

    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

exports.showProfile = function _callee3(req, res) {
  var _res$render;

  var userRole;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          userRole = userlogin.role; // Mendapatkan role user
          // Render halaman status dengan data approvals dan pengguna yang sedang login

          res.render('user/profile', (_res$render = {
            title: 'Profile',
            user: req.session.user
          }, _defineProperty(_res$render, "user", user), _defineProperty(_res$render, "userRole", userRole), _res$render));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.profile = function _callee4(req, res) {
  var userId, _user3;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          // Ambil data pengguna yang sedang login
          userId = req.session.user.id; // Ambil pengajuanId dari model Pengajuan berdasarkan userId

          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(db.User.findOne({
            where: {
              userId: userId
            },
            include: [{
              model: db.User
            }]
          }));

        case 4:
          _user3 = _context4.sent;
          req.session.user = _user3;
          res.redirect('/profile');
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](1);
          console.error('Error fetching approvals:', _context4.t0);
          res.status(500).send('Internal Server Error');

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 9]]);
};
//# sourceMappingURL=userController.dev.js.map
