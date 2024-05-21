const express = require('express')
const router = express.Router()
const controller = require('../controller/ubah_password')

router.post('/ubahPassword', controller.ubah_password)
router.get('/ubah_password', controller.formUbahPassword)

module.exports = router;