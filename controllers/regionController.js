const Region = require('../models/Region.model');
const Country = require('../models/Country.model');
const { createLog, logAction } = require('../services/logService');

exports.createRegion = [
  async (req, res) => {
    try {
      const { name, country } = req.body;
      const creator = req.user;
      
      // Validate country
      const countryExists = await Country.findById(country);
      if (!countryExists || countryExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0001', message: 'Country not found' });
      }
      
      const newRegion = new Region({
        name: {
          en: name.en,
          fr: name.fr
        },
        country,
        createdBy: creator._id
      });
      
      await newRegion.save();
      
      res.locals.newId = newRegion._id;
      res.status(201).json({ 
        messageCode: 'MSG_0003', 
        message: 'Region created successfully',
        region: newRegion
      });
    } catch (error) {
      console.error('Create Region Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_REGION', 'Region')
];

exports.updateRegion = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const region = await Region.findById(id);
      if (!region || region.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0001', message: 'Region not found' });
      }
      
      // Update name
      if (updateData.name) {
        if (updateData.name.en) region.name.en = updateData.name.en;
        if (updateData.name.fr) region.name.fr = updateData.name.fr;
      }
      
      // Update country
      if (updateData.country) {
        const countryExists = await Country.findById(updateData.country);
        if (!countryExists || countryExists.deleted) {
          return res.status(404).json({ messageCode: 'MSG_0001', message: 'Country not found' });
        }
        region.country = updateData.country;
      }
      
      await region.save();
      
      res.json({ 
        messageCode: 'MSG_0003', 
        message: 'Region updated successfully',
        region
      });
    } catch (error) {
      console.error('Update Region Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_REGION', 'Region')
];

exports.deleteRegion = [
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const region = await Region.findById(id);
      if (!region || region.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0001', message: 'Region not found' });
      }
      
      // Check if region has cities
      const City = require('../models/City.model');
      const citiesCount = await City.countDocuments({ region: id, deleted: false });
      if (citiesCount > 0) {
        return res.status(400).json({ 
          messageCode: 'MSG_0001', 
          message: 'Cannot delete region with associated cities' 
        });
      }
      
      region.deleted = true;
      await region.save();
      
      res.json({ 
        messageCode: 'MSG_0003', 
        message: 'Region deleted successfully'
      });
    } catch (error) {
      console.error('Delete Region Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_REGION', 'Region')
];

exports.getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const region = await Region.findById(id)
      .populate('country', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!region || region.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0001', message: 'Region not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      region
    });
  } catch (error) {
    console.error('Get Region Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getRegions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      country,
      search = '',
      sort = 'name.en',
      order = 'asc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Country filter
    if (country) query.country = country;
    
    // Search filter
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } }
      ];
    }
    
    const [regions, total] = await Promise.all([
      Region.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('country', 'name'),
      
      Region.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      regions
    });
  } catch (error) {
    console.error('Get Regions Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};