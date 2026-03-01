const { body } = require('express-validator');
const Organization = require('../schema/organization');

exports.register = [
    body('name')
    .notEmpty()
    .withMessage('Organization name is required')
    .bail(),
        
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .bail()
    .custom( async(value) => {
        const isExist = await Organization.findOne({
            email: value
        });

        if(isExist && isExist.isVerified) throw new Error('organization with this email already exist');

        return true;
    })
    .bail(),
        
    body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .bail(),

];

exports.verifyOTP = [
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .bail()
    .custom( async(value) =>{
        const org = await Organization.findOne({
            email: value
        });

        if(!org) throw new Error('organization with this email not found');
        if(org.isVerified) throw new Error('organization with this email already verified');

        return true;
    })
    .bail(),

    body('otp')
    .notEmpty()
    .withMessage('OTP is required')
    .bail()
    .isNumeric()
    .withMessage('OTP must only contain numbers')
    .bail(),
];

exports.login = [
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .bail(),
        
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail(),

];

exports.forgetPassword = [
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .notEmpty()
    .withMessage('Email is required')
];

exports.resetPassword = [
        body('token')
        .notEmpty()
        .withMessage('Reset token is required')
        .bail(),
            
        body('newPassword')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .bail(),

        body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
        .bail()
    ]