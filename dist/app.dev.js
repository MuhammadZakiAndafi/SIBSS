"use strict";

var createError = require('http-errors');

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');

var editRouter = require('./routes/editprofile');

var loginRouter = require('./routes/login');

var dashboardRouter = require('./routes/dashboard');

var profileRouter = require('./routes/profile');

var ubah_password = require('./routes/ubah_password');

var app = express(); // view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express["static"](path.join(__dirname, "./node_modules/preline/dist")));
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/editprofile', editRouter);
app.use('/login', loginRouter);
app.use('/dashboard', dashboardRouter);
app.use('/profile', profileRouter);
app.use('/ubah_password', ubah_password); // catch 404 and forward to error handler

app.use(function (req, res, next) {
  next(createError(404));
}); // error handler

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render('error');
}); // Set port and start server

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is running on http://localhost:".concat(PORT));
}).on('error', function (err) {
  console.error("Server failed to start due to error: ".concat(err.message));
});
module.exports = app;
//# sourceMappingURL=app.dev.js.map
