const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({messageCode: 'MSG_0097', message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};

module.exports = authorizeRoles