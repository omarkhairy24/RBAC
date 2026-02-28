const bcrypt = require('bcryptjs');
const Organization = require('../schema/organization');
const { sendOTPVerificationCode } = require('../services/otp');
const { AppError } = require('../../../common/services/appError');
const Otp = require('../schema/otp');
const ApiKey = require('../../apiKey/schema');
const { generateApiKey } = require('../../apiKey/service');
const jwt = require('jsonwebtoken');

const index = {
    register: async(req, res, next)=>{
        try {
            
            const { name, email, password} = req.body;
            const hashedPassword = await bcrypt.hash(password, 12)
            const organization = await Organization.create({
                name,
                email,
                password: hashedPassword
            });

            await sendOTPVerificationCode(organization);

            res.status(201).json({
                status:'success',
                message:'organization created successfully',
                isVerified: false
            });

        } catch (error) {
            next(error);
        }
    },
    verifyOTP: async(req,res,next) => {
        try {
            
            const { email, otp } = req.body;
            const MAX_ATTEMPTS = 4;

            const organization = await Organization.findOne({ email });

            if(!organization) throw AppError('organization doesnot exist.',404);
            if(organization.isVerified) throw AppError('this organization is already verified.');

            const orgOtp = await Otp.findOne({ organization: organization._id });

            if(orgOtp.otp !== otp) {

                let attempts = orgOtp + 1;
                if(orgOtp.attempts >= MAX_ATTEMPTS) {

                    await Promise.all([
                        Otp.deleteOne({ _id: orgOtp._id }),
                        Organization.findByIdAndDelete(organization._id)
                    ]);

                    throw AppError('Maximum attempts exceeded. Please try again.', 400)
                };
                
                orgOtp.attempts = attempts;
                await orgOtp.save();
                throw AppError(`Invalid OTP. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`, 400)
            };

            organization.isVerified = true;
            await organization.save();

            await ApiKey.create({
                organization: organization._id,
                key: generateApiKey(),
            })

            res.status(201).json({
                message:'organization verified successfully.'
            })

        } catch (error) {
            next(error);
        }
    },
    login: async(req,res,next) => {
        try {
            
            const {email, password} = req.body;
            const organization = await Organization.findOne({email});
            if(!organization) throw AppError(`organization with email ${email} not found`, 404);

            const comparePassword = await bcrypt.compare(password, organization.password);
            if(!comparePassword) throw AppError('invalid credintals', 400);

            const token = jwt.sign({ id: organization._id, tier: organization.tier }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            res.status(200).json({
                success: true,
                organization: {
                    id: organization._id,
                    email: organization.email,
                    name: organization.name,
                    token
                }
            })
        } catch (error) {
            next(error);
        }
    }
};

module.exports = index;