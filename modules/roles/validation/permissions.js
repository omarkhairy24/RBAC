const { param, body } = require('express-validator');
const Permission = require('../schema/permissions');

exports.addPermission = [
    body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .custom( async(value, {req})=>{
        const isExist = await Permission.findOne({
            organization: req.organization.id,
            name: value
        });
        if(isExist) throw new Error('permission with this name already exists');

        return true;
    }).bail()
];

exports.deletePermission = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value, {req} )=> {
        
        const isExist = await Permission.findOne({
            _id: value,
            organization: req.organization.id,
        });

        if(!isExist) throw new Error('permission doesnt exist');
        return true;
    }).bail()
]