const Permission = require("../schema/permissions");

const index = {
    getAll: async(req,res,next) =>{
        try {
            
            const { pagination } = req
            const permissions = await Permission.find({
                organization: req.organization.id
            })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
            
            const total = await Permission.countDocuments({ organization: req.organization.id });
            const metadata = {
                currentPage: pagination.page,
                totalPages: Math.ceil(total / pagination.limit),
                totalCount: total,
            };
            
            res.status(200).json({
                permissions,
                metadata
            });

        } catch (error) {
            next(error);
        }
    },
    addPermission: async(req,res,next) =>{
        try {
           
            const { name } = req.body;

            const permission = await Permission.create({
                organization: req.organization.id,
                name
            });

            res.status(201).json({
                message: 'permission created successfully',
                permission
            });
            
        } catch (error) {
            next(error);
        }
    },
    deletePermission: async(req,res,next) =>{
        try {
            
            const { id } = req.params;

            await Permission.findByIdAndDelete(id);
            res.status(201).json({
                message: 'permission deleted successfully'
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = index;