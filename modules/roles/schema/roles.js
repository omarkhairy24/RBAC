const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization',
        required: true
    },
    name: { 
        type: String, 
        required: true 
    },
    permissions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Permission' 
    }]
}, {timestamps: true});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;