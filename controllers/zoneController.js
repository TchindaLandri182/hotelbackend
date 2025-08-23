const Zone = require('../models/Zone.model');
const City = require('../models/City.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createZone = [
  async (req, res) => {
    try {
      const { name, city } = req.body;
      const creator = req.user;
      
      // Validate city
      const cityExists = await City.findById(city);
      if (!cityExists || cityExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0036', message: 'City not found' });
      }
      
      const newZone = new Zone({
        name: {
          en: name.en,
          fr: name.fr
        },
        city,
        createdBy: creator._id
      });
      
      await newZone.save();
      
      // Store ID for logging middleware
      res.locals.newId = newZone._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0037', message: 'Zone created successfully',
        zone: newZone
      });
    } catch (error) {
      console.error('Create Zone Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_ZONE', 'Zone')
];

exports.updateZone = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const zone = await Zone.findById(id);
      if (!zone || zone.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0038', message: 'Zone not found' });
      }
      
      // Update name
      if (updateData.name) {
        if (updateData.name.en) zone.name.en = updateData.name.en;
        if (updateData.name.fr) zone.name.fr = updateData.name.fr;
      }
      
      // Update city
      if (updateData.city) {
        const cityExists = await City.findById(updateData.city);
        if (!cityExists || cityExists.deleted) {
          return res.status(404).json({ messageCode: 'MSG_0036', message: 'City not found' });
        }
        zone.city = updateData.city;
      }
      
      await zone.save();
      
      res.json({ 
        messageCode: 'MSG_0039', message: 'Zone updated successfully',
        zone
      });
    } catch (error) {
      console.error('Update Zone Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_ZONE', 'Zone')
];

exports.deleteZone = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const zone = await Zone.findById(id);
      if (!zone || zone.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0038', message: 'Zone not found' });
      }
      
      // Check if zone has hotels
      const hotelsCount = await Hotel.countDocuments({ zone: id, deleted: false });
      if (hotelsCount > 0) {
        return res.status(400).json({ 
          messageCode: 'MSG_0040', message: 'Cannot delete zone with associated hotels' 
        });
      }
      
      zone.deleted = true;
      await zone.save();
      
      res.json({ 
        messageCode: 'MSG_0041', message: 'Zone deleted successfully'
      });
    } catch (error) {
      console.error('Delete Zone Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_ZONE', 'Zone')
];

exports.getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const zone = await Zone.findById(id)
      .populate('city', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!zone || zone.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0038', message: 'Zone not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      zone
    });
  } catch (error) {
    console.error('Get Zone Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getZones = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      city,
      search = '',
      sort = 'name.en',
      order = 'asc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // City filter
    if (city) query.city = city;
    
    // Search filter
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } }
      ];
    }
    
    const [zones, total] = await Promise.all([
      Zone.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('city', 'name'),
      
      Zone.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      zones
    });
  } catch (error) {
    console.error('Get Zones Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};