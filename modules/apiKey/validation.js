const { param } = require('express-validator');
const Apikey = require('./schema');

exports.deleteKey = [
    param('id')
    .isMongoId()
    .withMessage('invalid mongo id format')
    .bail()
    .custom( async(value , {req})=>{
        const apiKey = await Apikey.findById(value);
        if(!apiKey) throw new Error('api key not found.');
        if(apiKey.organization.toString() !== req.organization.id) throw new Error('not allowed to delete this key');
        return true;
    })
    .bail()
];