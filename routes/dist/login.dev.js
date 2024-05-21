"use strict";

var express = require('express');

var bcrypt = require('bcryptjs');

var mysql = require('mysql');

var router = express.Router(); // Config to MySQL

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sibss'
}); // connecting database

db.connect(function (err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }

  console.log('Connected to MySQL database');
}); // Endpoint login page

router.get('/', function (req, res) {
  res.render('login'); // Pastikan ini merender file login.ejs
}); // Endpoint login

router.post('/', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password; // Checking fof password and username

  if (!username || !password) {
    return res.status(400).send('Please provide username and password');
  } // Checking username


  db.query('SELECT * FROM users WHERE username = ?', [username], function (err, results) {
    if (err) {
      console.error('Error in database query:', err);
      return res.status(500).send('An error occurred. Please try again later.');
    } // if false


    if (results.length === 0) {
      return res.status(401).send('Incorrect Username and/or Password!');
    } // Checking password


    bcrypt.compare(password, results[0].password, function (err, isMatch) {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('An error occurred. Please try again later.');
      }

      if (isMatch) {
        // Setting session variables
        req.session.loggedin = true;
        req.session.username = username;
        console.log(req.session); // Logging session after successful login
        // Redirect to dashboard after successful login

        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect Username and/or Password!');
      }
    });
  });
});
module.exports = router;
//# sourceMappingURL=login.dev.js.map
