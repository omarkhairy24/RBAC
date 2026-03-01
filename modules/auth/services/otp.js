const { AppError } = require("../../../common/services/appError");
const crypto = require('crypto');
const Otp = require("../schema/otp");
const { sendOTPVerificationEmail } = require("../../../common/services/mail.template");

exports.sendOTPVerificationCode = async( organization ) => {
    try {
        
        const otp = crypto.randomInt(1000, 10000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await Otp.create({
            organization: organization._id,
            otp,
            expiresAt
        });

        await sendOTPVerificationEmail(organization.email, otp);

    } catch (error) {
        throw AppError(error, 400)
    }
};