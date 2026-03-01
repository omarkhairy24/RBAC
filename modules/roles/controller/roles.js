const Role = require("../schema/roles");

const index = {
    getAll: async(req,res,next) => {
        try {
            
            const { pagination } = req
            const roles = await Role.find({
                organization: req.organization.id
            })
            .skip(pagination.skip)
            .limit(pagination.limit)
            .sort({ createdAt: -1 });
            
            const total = await Role.countDocuments({ organization: req.organization.id });
            const metadata = {
                currentPage: pagination.page,
                totalPages: Math.ceil(total / pagination.limit),
                totalCount: total,
            };
            
            res.status(200).json({
                roles,
                metadata
            });

        } catch (error) {
            next(error);
        }
    },
    create: async(req,res,next) =>{
        try {
            
            const { name } = req.body;
            const role = await Role.create({
                organization: req.organization.id,
                name
            });

            res.status(201).json({
                message: 'role created successfully',
                role
            });

        } catch (error) {
            next(error);
        }
    },
    delete: async(req,res,next) => {
        try {
            
            const { id } = req.params;

            await Role.findByIdAndDelete(id);

            res.status(201).json({
                message:'role deleted successfully'
            });

        } catch (error) {
            next(error);
        }
    },
    addPermissions: async(req,res,next) => {
        try {
            
            const { id } = req.params;
            const { permissions } = req.body;

            await Role.findByIdAndUpdate(id, {
                $addToSet: {
                    permissions: {
                        $each: permissions
                    }
                }
            }, { new: true });

            res.status(201).json({
                message:'permissions added successfully'
            });

        } catch (error) {
            next(error);
        }
    },
    removePermissions: async(req,res,next) =>{
        try {
            
            const { id } = req.params;
            const { permissions } = req.body;

            await Role.findByIdAndUpdate(id,{
                $pull: {
                    permissions: { $in: permissions }
                }
            },{ new: true });

            res.status(201).json({
                message:'permissions removed successfully'
            });

        } catch (error) {
            next(error);
        }
    }
};

module.exports = index;