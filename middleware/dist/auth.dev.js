"use strict";

var jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  var authHeader = req.headers['authorization'];
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('Access Denied');
  jwt.verify(token, 'your_jwt_secret', function (err, user) {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
//# sourceMappingURL=auth.dev.js.map