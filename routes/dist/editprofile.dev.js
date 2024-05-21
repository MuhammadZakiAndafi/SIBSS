"use strict";

var express = require('express');

var router = express.Router();
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('editprofile');
});
module.exports = router;
var mailInput = document.getElementById("mail-input");
var mailError = document.getElementById("mail-error");
var emptyMailError = document.getElementById("empty-mail");
var addressInput = document.getElementById("address-input");
var addressError = document.getElementById("address-error");
var emptyAddressError = document.getElementById("empty-address");
var phoneInput = document.getElementById("phone");
var phoneError = document.getElementById("phone-error");
var emptyPhoneError = document.getElementById("empty-phone");
var passwordInput = document.getElementById("password");
var passwordError = document.getElementById("password-error");
var emptyPasswordError = document.getElementById("empty-password");
var verifyPasswordInput = document.getElementById("verify-password");
var verifyPasswordError = document.getElementById("verify-password-error");
var emptyVerifyPassowrdError = document.getElementById("empty-verify-password");
var submitButton = document.getElementById("submit-button");
var validClasses = document.getElementById("valid");
var invalidClasses = document.getElementById("error");
//# sourceMappingURL=editprofile.dev.js.map
