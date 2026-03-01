const { param, body } = require('express-validator');
const Role = require('../schema/roles');
const Permission = require('../schema/permissions');
const mongoose = require('mongoose');

exports.create = [
    body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .custom( async(value, {req})=>{
        const isExist = await Role.findOne({
            organization: req.organization.id,
            name: value
        });
        if(isExist) throw new Error('role with this name already exists');

        return true;
    }).bail()
];

exports.delete = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value, {req} )=> {
            
        const isExist = await Role.findById(value);
        if(!isExist) throw new Error('role doesnt exist');
        if(isExist && isExist.organization.toString() !== req.organization.id) throw new Error('not allowed');
        return true;
    }).bail()
];

exports.addPermissions = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value, {req} )=> {
            
        const isExist = await Role.findById(value);
    
        if(!isExist) throw new Error('role doesnt exist');
        if(isExist && isExist.organization.toString() !== req.organization.id) throw new Error('not allowed');
        return true;
    }).bail(),

    body('permissions')
    .isArray({ min: 1 })
    .withMessage('permissions must be a non-empty array')
    .bail()
    .custom(async (values, { req }) => {

        const allValidIds = values.every(id => mongoose.Types.ObjectId.isValid(id));
        if (!allValidIds) throw new Error('One or more IDs are invalid');

        const permissions = await Permission.find({
            _id: { $in: values },
            organization: req.organization.id
        });

        if (permissions.length !== [...new Set(values)].length) {
            throw new Error('One or more permissions are invalid or unauthorized');
        }

        return true;
    })
    .bail()
];

exports.removePermissions = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value, {req} )=> {
            
        const isExist = await Role.findById(value);
    
        if(!isExist) throw new Error('role doesnt exist');
        if(isExist && isExist.organization.toString() !== req.organization.id) throw new Error('not allowed');
        return true;
    }).bail(),

    body('permissions')
    .isArray({ min: 1 })
    .withMessage('permissions must be a non-empty array')
    .bail()
    .custom(async (values, { req }) => {

        const allValidIds = values.every(id => mongoose.Types.ObjectId.isValid(id));
        if (!allValidIds) throw new Error('One or more IDs are invalid');

        const permissions = await Permission.find({
            _id: { $in: values },
            organization: req.organization.id
        });

        if (permissions.length !== [...new Set(values)].length) {
            throw new Error('One or more permissions are invalid or unauthorized');
        }

        return true;
    })
    .bail()
]