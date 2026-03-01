const { body, param } = require('express-validator');
const User = require('../schema/users');
const Role = require('../../roles/schema/roles');
const { default: mongoose } = require('mongoose');

exports.create = [
    body('name')
    .notEmpty()
    .withMessage('user name is required')
    .bail(),
        
    body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .bail()
    .custom( async(value) => {
        const isExist = await User.findOne({
            email: value
        });

        if(isExist) throw new Error('organization with this email already exist');

        return true;
    })
    .bail(),
];

exports.update = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value) =>{
        const user = await User.findById(value).select('_id');
        if(!user) throw new Error('user not found');
        return true;
    }),

    body('name')
    .optional()
    .isString()
    .withMessage('user name must be string')
    .bail(),
        
    body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .bail()
    .custom( async(value, { req }) => {
        const isExist = await User.findOne({
            email: value,
        });

        if(isExist && isExist._id.toString() !== req.params.id) throw new Error('user with this email already exist');

        return true;
    })
    .bail(),
];

exports.deleteUser = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value) =>{
        const user = await User.findById(value).select('_id');
        if(!user) throw new Error('user not found');
        return true;
    })
];

exports.blockUser = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value) =>{
        const user = await User.findById(value);
        if(!user) throw new Error('user not found');
        if(user.blocked) throw new Error('this user already blocked');
        return true;
    })
];

exports.unblockUser = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value) =>{
        const user = await User.findById(value);
        if(!user) throw new Error('user not found');
        if(!user.blocked) throw new Error('this user already blocked');
        return true;
    })
];

exports.addRoles = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value, {req} )=> {
            
        const isExist = await User.findById(value);
    
        if(!isExist) throw new Error('user not found');
        if(isExist && isExist.organization.toString() !== req.organization.id) throw new Error('not allowed');
        return true;
    }).bail(),

    body('roles')
    .isArray({ min: 1 })
    .withMessage('roles must be a non-empty array')
    .bail()
    .custom(async (values, { req }) => {

        const allValidIds = values.every(id => mongoose.Types.ObjectId.isValid(id));
        if (!allValidIds) throw new Error('One or more IDs are invalid');

        const roles = await Role.find({
            _id: { $in: values },
            organization: req.organization.id
        });

        if (roles.length !== [...new Set(values)].length) {
            throw new Error('One or more roles are invalid or unauthorized');
        }

        return true;
    })
    .bail()
];

exports.removeRoles = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value, {req} )=> {
            
        const isExist = await User.findById(value);
    
        if(!isExist) throw new Error('user not found');
        if(isExist && isExist.organization.toString() !== req.organization.id) throw new Error('not allowed');
        return true;
    }).bail(),

    body('roles')
    .isArray({ min: 1 })
    .withMessage('roles must be a non-empty array')
    .bail()
    .custom(async (values, { req }) => {

        const allValidIds = values.every(id => mongoose.Types.ObjectId.isValid(id));
        if (!allValidIds) throw new Error('One or more IDs are invalid');

        const roles = await Role.find({
            _id: { $in: values },
            organization: req.organization.id
        });

        if (roles.length !== [...new Set(values)].length) {
            throw new Error('One or more roles are invalid or unauthorized');
        }

        return true;
    })
    .bail()
]