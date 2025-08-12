const Log = require('../models/Log.model');

exports.getLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50,
      action,
      type,
      user,
      objectType,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    if (action) query.action = action;
    if (type) query.type = type;
    if (user) query.user = user;
    if (objectType) query.objectType = objectType;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const [logs, total] = await Promise.all([
      Log.find(query)
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('user', 'firstName lastName email')
        .lean(),
      
      Log.countDocuments(query)
    ]);

    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      logs
    });
  } catch (error) {
    console.error('Get Logs Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await Log.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('objectId');

    if (!log) {
      return res.status(404).json({ messageCode: 'MSG_0002', message: 'Log not found' });
    }
    
    res.json({ messageCode: 'MSG_0003',  log });
  } catch (error) {
    console.error('Get Log Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};