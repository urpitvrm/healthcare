const router = require('express').Router();
const authController = require('../controller/authController');
const otpController = require('../controller/otpController');
router.post('/login',authController.login);
router.post('/signUp',authController.signUp);
router.post('/getOTP',otpController.sendOTP);

module.exports = router;