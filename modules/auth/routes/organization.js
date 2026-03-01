const express = require('express');
const router = express.Router();
const controller = require('../controller/organization');
const validation = require('../validation/organization');
const validator = require('../../../common/middleware/validator');

router.post('/register', validation.register, validator, controller.register);

router.post('/verify-otp', validation.verifyOTP, validator, controller.verifyOTP);

router.post('/login', validation.login, validator, controller.login);

router.post('/forget-password', validation.forgetPassword, validator, controller.forgetPassword);

router.post('/reset-password', validation.resetPassword, validator, controller.resetPassword);

module.exports = router;