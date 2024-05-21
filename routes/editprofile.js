var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('editprofile');
});

module.exports = router;
let mailInput = document.getElementById("mail-input");
let mailError = document.getElementById("mail-error");
let emptyMailError = document.getElementById("empty-mail");

let addressInput = document.getElementById("address-input");
let addressError = document.getElementById("address-error");
let emptyAddressError = document.getElementById("empty-address");

let phoneInput = document.getElementById("phone");
let phoneError = document.getElementById("phone-error");
let emptyPhoneError = document.getElementById("empty-phone");

let passwordInput = document.getElementById("password");
let passwordError = document.getElementById("password-error");
let emptyPasswordError = document.getElementById("empty-password");

let verifyPasswordInput = document.getElementById("verify-password");
let verifyPasswordError = document.getElementById("verify-password-error");
let emptyVerifyPassowrdError = document.getElementById("empty-verify-password");

let submitButton= document.getElementById("submit-button");

let validClasses= document.getElementById("valid");

let invalidClasses= document.getElementById("error");
