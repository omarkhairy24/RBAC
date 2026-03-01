const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    organization: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization' 
    },
    email: { 
        type: String, 
        required: true 
    },
    name: {
        type: String,
        required: true
    },
    blocked: { 
        type: Boolean, 
        default: false 
    },
    roles:[{
        type:mongoose.Schema.ObjectId,
        ref:'Role'
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema)
module.exports = User;