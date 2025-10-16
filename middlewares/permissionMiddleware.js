const Log = require('../models/Log.model');
const permissions = require('../constants/permissions.constants');

const checkPermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ 
          messageCode: 'MSG_0098', message: 'Unauthorized: No user information found' 
        });
      }

      // Admins bypass all permission checks
      if (user.role === 'admin') {
        return next();
      }
      
      if(requiredPermissions.includes(permissions.updateUser) && req.params.id === user._id.toString()){
        return next();
      }

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(perm => 
        user.permissions && user.permissions.includes(perm)
      );

      if (!hasAllPermissions) {
        await Log.create({
          action: 'PERMISSION_DENIED',
          type: 'security',
          user: user._id,
          details: {
            method: req.method,
            route: req.originalUrl,
            required: requiredPermissions,
            userPermissions: user.permissions
          }
        });

        return res.status(403).json({ 
          messageCode: 'MSG_0099', message: 'Forbidden: Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ 
        messageCode: 'MSG_0100', message: 'Internal server error during permission validation' 
      });
    }
  };
};

module.exports = checkPermission;