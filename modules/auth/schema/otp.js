const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Otp =  mongoose.model('OTP', otpSchema)
module.exports = Otp;