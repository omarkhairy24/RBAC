const { AppError } = require("../services/appError");

exports.authorize = (requiredPermission) => {
    return async (req, res, next) => {
        try {

            if (!req.user) throw AppError('Authentication required.', 401);

            if(req.user.blocked) throw AppError('this user is blocked', 403);
            
            const userPermissions = req.user.roles.flatMap(role => 
                role.permissions.map(p => p.name)
            );

            const hasPermission = userPermissions.includes(requiredPermission);

            if (!hasPermission) throw AppError('You do not have permission to perform this action.', 403);

            next();
        } catch (error) {
            next(error);
        }
    };
};