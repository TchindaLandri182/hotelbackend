const checkPermission = (...requiredPermissions) => {
    return async (req, res, next) => {
      const { user, method, originalUrl } = req;
      
      // 1. Authentication check
      if (!user) {
        await Log.create({
          action: 'PERMISSION_DENIED',
          type: 'security',
          user: null,
          details: {
            method,
            route: originalUrl,
            reason: 'No user authenticated'
          }
        });
        return res.sendStatus(401).json({message: 'User not authenticated'});
      }
  
      // 2. Admin bypass
      if (user.role === 'admin') {
        req.permissionCheck = { bypassed: true };
        return next();
      }
  
      // 3. Permission validation
      const missingPermissions = requiredPermissions.filter(
        perm => !user.permissions.includes(perm)
      );
  
      if (missingPermissions.length > 0) {
        await Log.create({
          action: 'PERMISSION_DENIED',
          type: 'security',
          user: user._id,
          details: {
            method,
            route: originalUrl,
            required: requiredPermissions,
            missing: missingPermissions
          }
        });
        
        return res.status(403).json({messageCode: 'MSG_0094', message: 'Missing permissions'});
      }
  
      // 4. Success
      req.permissionCheck = {
        passed: true,
        checkedAt: new Date()
      };
      next();
    };
  };