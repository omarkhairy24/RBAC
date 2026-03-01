const { AppError } = require("../../common/services/appError");
const TIER_LIMITS = require("../tiers/schema");
const ApiKey = require("./schema");
const { generateApiKey, resetMontlyJob } = require("./service");

const index = {
    getAll: async(req,res,next) =>{
        try {
            
            const { pagination } = req;

            const apiKeys = await ApiKey.find({
                organization: req.organization.id
            })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });

            const total = await ApiKey.countDocuments({ organization: req.organization.id });
            const metadata = {
                currentPage: pagination.page,
                totalPages: Math.ceil(total / pagination.limit),
                totalCount: total,
            };

            res.status(200).json({
                apiKeys,
                metadata
            });

        } catch (error) {
            next(error);
        }
    },
    generateKey: async(req,res,next) => {
        try {
            console.log(req.organization)
            const orgTier = TIER_LIMITS[req.organization.tier];

            const apiKeys = await ApiKey.find({ organization: req.organization.id }).select('_id');
            if(apiKeys.length === orgTier.maxApiKeys) throw AppError(`Maximum API keys for ${req.organization.tier} tier reached`,400);

            const key = await ApiKey.create({
                organization: req.organization.id,
                key: generateApiKey(),
            });
            await resetMontlyJob(key);

            res.status(201).json({
                message:'key created successfully',
                key
            });

        } catch (error) {
            next(error);
        }
    },
    deleteKey: async(req,res,next) =>{
        try {
            
            const { id } = req.params;
            await ApiKey.findByIdAndDelete(id);

            res.status(200).json({
                message: 'key deleted successfully'
            });

        } catch (error) {
            next(error)
        }
    }
};

module.exports = index