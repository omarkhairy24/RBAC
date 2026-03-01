const ApiKey = require("../../modules/apiKey/schema");
const TIER_LIMITS = require("../../modules/tiers/schema");
const { AppError } = require("../services/appError");

exports.authApiKey = async(req,res,next) =>{
    try {
        
        const key = req.headers['x-api-key'];
        if (!key) throw AppError('API Key required', 401);

        const apiKey = await ApiKey.findOne({ key }).populate('organization');

        const limits = TIER_LIMITS[apiKey.organization.tier];

        if (apiKey.requestsUsed >= limits.monthlyRequests) throw AppError('Monthly limit exceeded', 429);

        apiKey.requestsUsed += 1;
        await apiKey.save();

        req.organization = apiKey.organization;

        next();

    } catch (error) {
        next(error);
    }
}