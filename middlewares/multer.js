const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary');
const allowedImageFormat = require('../constants/allowedImageFormat');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'hotelmanagement',
    allowed_formats: allowedImageFormat,
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const upload = multer({ storage });

module.exports = upload;





const permissions = require('../constants/permissions.constants');

const checkPermission = (...requiredPermissions) => {
  return (req, res, next) => {
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

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every(perm => 
        user.permissions.includes(perm)
      );

      if (!hasAllPermissions) {
        return res.status(403).json({ 
          messageCode: 'MSG_0099', message: 'Forbidden: Insufficient permissions',
          requiredPermissions
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