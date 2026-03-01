const { AppError } = require("../../common/services/appError");
const Organization = require("../auth/schema/organization");

const index = {
    upgradeTier: async(req,res,next) =>{
        try {

            const { tier } = req.body;
            if(!['advanced', 'pro'].includes(tier)) throw AppError('tier must be one of [ advanced, pro ].');
            
            const organization = await Organization.findByIdAndUpdate(req.organization.id,{
                tier
            }, { new: true });

            res.status(201).json({
                message: 'tier updated successfully'
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = index;