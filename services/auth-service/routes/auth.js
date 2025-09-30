const router = require('express').Router();
const authController = require('../controller/authController');
router.post('/login',authController.login);
router.post('/signUp',authController.signUp);
// router.get('post',authController.login);

module.exports = router;