"use strict";

var bcrypt = require('bcryptjs');

var db = require('../models');

exports.showLoginForm = function (req, res) {
  res.render('auth/login', {
    title: 'Login'
  });
};

exports.login = function _callee(req, res) {
  var _req$body, email, password, user;

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
          user = _context.sent;
          _context.t0 = user;

          if (!_context.t0) {
            _context.next = 10;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

        case 9:
          _context.t0 = _context.sent;

        case 10:
          if (!_context.t0) {
            _context.next = 15;
            break;
          }

          req.session.user = user;
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
  var _req$body2, nim, name, email, password, role, hashedPassword, user;

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
          user = _context2.sent;
          req.session.user = user;
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
//# sourceMappingURL=userController.dev.js.map
