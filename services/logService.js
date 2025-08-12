const Log = require('../models/Log.model');

exports.createLog = async (logData) => {
  try {
    const log = new Log(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Log Creation Error:', error);
    return null;
  }
};

exports.logAction = (action, objectType) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const objectId = req.params.id || res.locals.newId;
      
      await exports.createLog({
        action,
        type: 'activity',
        user: user._id,
        objectId,
        objectType,
        details: {
          method: req.method,
          route: req.originalUrl,
          body: req.body,
          params: req.params
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
      
      next();
    } catch (error) {
      console.error('Log Action Error:', error);
      next();
    }
  };
};