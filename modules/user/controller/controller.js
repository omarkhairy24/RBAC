const mongoose = require("mongoose");
const User = require("../schema/users");
const { AppError } = require("../../../common/services/appError");

const index = {
    getAll: async(req,res,next) => {
        try {
            
            const { pagination, search } = req;

            const users = await User.aggregate([
                {
                    $match:{
                        organization: new mongoose.Types.ObjectId(req.organization.id),
                        ...( search ? {
                            $or:[
                                { name: { $regex: search, $options: 'i' } },
                                { email: { $regex: search, $options: 'i' } }
                            ]
                        } : {} )
                    }
                },
                {
                    $lookup:{
                        from:'roles',
                        localField:'roles',
                        foreignField:'_id',
                        as:'roles',
                        pipeline:[
                            {
                                $lookup:{
                                    from:'permissions',
                                    localField:'permissions',
                                    foreignField:'_id',
                                    as:'permissions'
                                }
                            }
                        ]
                    }
                },
                { $sort: { createdAt: -1} },
                { $skip: pagination.skip },
                { $limit: pagination.limit }
            ]);

            const total = await User.countDocuments({ organization: req.organization.id });
            const metadata = {
                currentPage: pagination.page,
                totalPages: Math.ceil(total / pagination.limit),
                totalCount: total,
            };

            res.status(200).json({
                users,
                metadata
            });

        } catch (error) {
            next(error);
        }
    },
    getById: async(req,res,next) => {
        try {
            
            const { id } = req.params;

            const user = await User.findById(id).populate({
                path:'roles',
                populate: 'permissions'
            });
            if(!user) throw AppError('user not found', 404);
            
            res.status(200).json(user);

        } catch (error) {
            next(error);
        }
    },
    create: async(req,res,next) => {
        try {
            
            const { name, email } = req.body;

            const user = await User.create({
                name,
                email,
                organization: req.organization.id
            });

            res.status(200).json({
                message:'user created successfully',
                user
            });

        } catch (error) {
            next(error);
        }
    },
    update: async(req,res,next) =>{
        try {
            
            const { id } = req.params;

            const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true})

            res.status(201).json({
                message:'user updated successfully',
                user: updatedUser
            });

        } catch (error) {
            next(error);
        }
    },
    deleteUser: async(req,res,next) =>{
        try {
            
            const { id } = req.params;

            await User.findByIdAndDelete(id);

            res.status(200).json({
                message: 'user deleted successfully'
            });

        } catch (error) {
            next(error);
        }
    },
    blockUser: async(req,res,next) => {
        try {
            
            const { id } = req.params;

            const updatedUser = await User.findByIdAndUpdate(id, { blocked: true }, {new: true});
            res.status(201).json({
                message: 'user blocked.',
                updatedUser
            });

        } catch (error) {
            next(error);
        }
    },
    unblockUser: async(req,res,next) => {
        try {
            
            const { id } = req.params;

            const updatedUser = await User.findByIdAndUpdate(id, { blocked: false }, {new: true});
            res.status(201).json({
                message: 'user unblocked.',
                updatedUser
            });

        } catch (error) {
            next(error);
        }
    },
    addRoles: async(req,res,next) => {
        try {
                
            const { id } = req.params;
            const { roles } = req.body;
    
            await User.findByIdAndUpdate(id, {
                $addToSet: {
                    roles: {
                        $each: roles
                    }
                }
            }, { new: true });
    
            res.status(201).json({
                message:'roles added successfully'
            });
    
        } catch (error) {
            next(error);
        }
    },
    removeRoles: async(req,res,next) =>{
        try {
                
            const { id } = req.params;
            const { roles } = req.body;
    
            await User.findByIdAndUpdate(id, {
                $pull: {
                    roles: { $in: roles }
                }
            }, { new: true });
    
            res.status(201).json({
                message:'roles removed successfully'
            });
    
        } catch (error) {
            next(error);
        }
    }
};

module.exports = index;