const jwt = require('jsonwebtoken');
const { AppError } = require('../services/appError');

exports.authenticate = (req,res,next)=>{
    try {
        
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw AppError('Unauthorized.',401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.organization = decoded;

        next();
    } catch (error) {
        next(error);
    }
};