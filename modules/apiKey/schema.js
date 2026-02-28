const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
    organization: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization' 
    },
    key: { 
        type: String, 
        required: true, 
        unique: true,
        index: true
    },
    requestsUsed: {
        type: Number, 
        default: 0 
    },
    monthlyReset: {
        type: Date, 
        default: Date.now 
    }
}, 
{ 
    timestamps: true 
});

const ApiKey = mongoose.model('ApiKey',apiKeySchema);
module.exports = ApiKey;