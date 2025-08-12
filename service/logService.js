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