"use strict";

var express = require('express');

var router = express.Router(); // Route dashboard

router.get('/', function (req, res) {
  try {
    if (req.session.loggedin) {
      res.render('dashboard', {
        username: req.session.username
      });
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error in dashboard route:', error);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map
