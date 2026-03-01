const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    tier: { 
        type: String, 
        enum: ['free', 'advanced', 'pro'], 
        default: 'free' 
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    resetToken: String,
    resetTokenExpires: Date
},{timestamps: true});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;