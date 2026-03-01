const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization',
        required: true
    },
    name: { 
        type: String,
        required: true 
    }
},{timestamps: true});

const Permission = mongoose.model('Permission', permissionSchema);
module.exports = Permission;