const router = require('express').Router();
const authController = require('../controller/authController');
const otpController = require('../controller/otpController');
router.post('/userLogin',authController.login);
router.post('/userSignUp',authController.signUp);

router.post('/patientDetials',authController.patientDetails);
router.post('/doctorDetials',authController.doctorDetails);


//otp-services
router.post('/getOTP',otpController.sendOTP);
router.post('/verifyOTP',otpController.verifyOTP);
module.exports = router;