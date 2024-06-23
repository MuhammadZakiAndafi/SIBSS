"use strict";

var express = require('express');

var session = require('express-session');

var flash = require('connect-flash');

var path = require('path');

var app = express();
var port = 3000;

var _require = require('./models'),
    sequelize = _require.sequelize;

var userRoutes = require('./routes/userRoutes');

var pengajuanRoutes = require('./routes/pengajuanRoutes');

var approvalRoutes = require('./routes/approvalRoutes');

var skRoutes = require('./routes/skRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express["static"](path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use('/uploads', express["static"]('uploads'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  } // Pastikan secure diatur ke true di production

})); // Middleware untuk flash messages

app.use(flash()); // Middleware untuk mengatur flash messages ke res.locals

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
app.get('/', function (req, res) {
  res.render('auth/login');
}); // routes

app.use('/', userRoutes);
app.use('/', pengajuanRoutes);
app.use('/', approvalRoutes);
app.use('/', skRoutes);
sequelize.sync({
  force: false
}) // Set to true if you want to drop and recreate tables
.then(function () {
  console.log('Database synced');
})["catch"](function (err) {
  console.error('Failed to sync database:', err);
});
app.listen(port, function () {
  console.log("Server is running at http://localhost:".concat(port));
});
//# sourceMappingURL=server.dev.js.map
