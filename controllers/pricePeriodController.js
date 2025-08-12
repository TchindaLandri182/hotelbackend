const PricePeriod = require('../models/PricePeriod.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createPricePeriod = [
  async (req, res) => {
    try {
      const { entityType, entityId, startDate, endDate, newPrice } = req.body;
      const creator = req.user;
      
      // Validate entity type
      const validEntityTypes = ['Room', 'Food'];
      if (!validEntityTypes.includes(entityType)) {
        return res.status(400).json({ 
          messageCode: 'MSG_0022', message: 'Invalid entity type. Valid options: Room, Food' 
        });
      }
      
      // Validate dates
      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ 
          messageCode: 'MSG_0023', message: 'End date must be after start date' 
        });
      }
      
      // Check for overlapping periods
      const overlappingPeriod = await PricePeriod.findOne({
        entityType,
        entityId,
        $or: [
          { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
          { startDate: { $gte: startDate, $lt: endDate } }
        ],
        deleted: false
      });
      
      if (overlappingPeriod) {
        return res.status(409).json({ 
          messageCode: 'MSG_0024', message: 'Overlapping price period exists' 
        });
      }
      
      const newPricePeriod = new PricePeriod({
        entityType,
        entityId,
        startDate,
        endDate,
        newPrice,
        createdBy: creator._id
      });
      
      await newPricePeriod.save();
      
      // Store ID for logging middleware
      res.locals.newId = newPricePeriod._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0025', message: 'Price period created successfully',
        pricePeriod: newPricePeriod
      });
    } catch (error) {
      console.error('Create PricePeriod Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_PRICE_PERIOD', 'PricePeriod')
];

exports.updatePricePeriod = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const pricePeriod = await PricePeriod.findById(id);
      if (!pricePeriod || pricePeriod.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0026', message: 'Price period not found' });
      }
      
      // Validate dates if updated
      if (updateData.startDate || updateData.endDate) {
        const start = updateData.startDate || pricePeriod.startDate;
        const end = updateData.endDate || pricePeriod.endDate;
        
        if (new Date(start) >= new Date(end)) {
          return res.status(400).json({ 
            messageCode: 'MSG_0023', message: 'End date must be after start date' 
          });
        }
      }
      
      // Check for overlapping periods if dates changed
      if (updateData.startDate || updateData.endDate) {
        const overlappingPeriod = await PricePeriod.findOne({
          _id: { $ne: id },
          entityType: pricePeriod.entityType,
          entityId: pricePeriod.entityId,
          $or: [
            { 
              startDate: { $lt: updateData.endDate || pricePeriod.endDate }, 
              endDate: { $gt: updateData.startDate || pricePeriod.startDate } 
            },
            { 
              startDate: { 
                $gte: updateData.startDate || pricePeriod.startDate, 
                $lt: updateData.endDate || pricePeriod.endDate 
              } 
            }
          ],
          deleted: false
        });
        
        if (overlappingPeriod) {
          return res.status(409).json({ 
            messageCode: 'MSG_0024', message: 'Overlapping price period exists' 
          });
        }
      }
      
      // Update fields
      if (updateData.startDate) pricePeriod.startDate = updateData.startDate;
      if (updateData.endDate) pricePeriod.endDate = updateData.endDate;
      if (updateData.newPrice !== undefined) pricePeriod.newPrice = updateData.newPrice;
      
      await pricePeriod.save();
      
      res.json({ 
        messageCode: 'MSG_0027', message: 'Price period updated successfully',
        pricePeriod
      });
    } catch (error) {
      console.error('Update PricePeriod Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_PRICE_PERIOD', 'PricePeriod')
];

exports.deletePricePeriod = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const pricePeriod = await PricePeriod.findById(id);
      if (!pricePeriod || pricePeriod.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0026', message: 'Price period not found' });
      }
      
      pricePeriod.deleted = true;
      await pricePeriod.save();
      
      res.json({ 
        messageCode: 'MSG_0028', message: 'Price period deleted successfully'
      });
    } catch (error) {
      console.error('Delete PricePeriod Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_PRICE_PERIOD', 'PricePeriod')
];

exports.getPricePeriodById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pricePeriod = await PricePeriod.findById(id)
      .populate('createdBy', 'firstName lastName');
    
    if (!pricePeriod || pricePeriod.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0026', message: 'Price period not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      pricePeriod
    });
  } catch (error) {
    console.error('Get PricePeriod Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getPricePeriods = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      entityType,
      entityId,
      activeOnly,
      sort = '-startDate',
      order = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Entity filters
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    
    // Active periods filter
    if (activeOnly === 'true') {
      const now = new Date();
      query.startDate = { $lte: now };
      query.endDate = { $gte: now };
    }
    
    const [pricePeriods, total] = await Promise.all([
      PricePeriod.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      
      PricePeriod.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      pricePeriods
    });
  } catch (error) {
    console.error('Get PricePeriods Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};