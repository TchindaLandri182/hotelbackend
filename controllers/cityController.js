const City = require('../models/City.model');
const Region = require('../models/Region.model');
const { createLog, logAction } = require('../services/logService');

exports.createCity = [
  async (req, res) => {
    try {
      const { name, region } = req.body;
      const creator = req.user;
      
      // Validate region
      const regionExists = await Region.findById(region);
      if (!regionExists || regionExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0001', message: 'Region not found' });
      }
      
      const newCity = new City({
        name: {
          en: name.en,
          fr: name.fr
        },
        region,
        createdBy: creator._id
      });
      
      await newCity.save();
      
      res.locals.newId = newCity._id;
      res.status(201).json({ 
        messageCode: 'MSG_0003', 
        message: 'City created successfully',
        city: newCity
      });
    } catch (error) {
      console.error('Create City Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_CITY', 'City')
];

exports.updateCity = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const city = await City.findById(id);
      if (!city || city.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0001', message: 'City not found' });
      }
      
      // Update name
      if (updateData.name) {
        if (updateData.name.en) city.name.en = updateData.name.en;
        if (updateData.name.fr) city.name.fr = updateData.name.fr;
      }
      
      // Update region
      if (updateData.region) {
        const regionExists = await Region.findById(updateData.region);
        if (!regionExists || regionExists.deleted) {
          return res.status(404).json({ messageCode: 'MSG_0001', message: 'Region not found' });
        }
        city.region = updateData.region;
      }
      
      await city.save();
      
      res.json({ 
        messageCode: 'MSG_0003', 
        message: 'City updated successfully',
        city
      });
    } catch (error) {
      console.error('Update City Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_CITY', 'City')
];

exports.deleteCity = [
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const city = await City.findById(id);
      if (!city || city.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0001', message: 'City not found' });
      }
      
      // Check if city has zones
      const Zone = require('../models/Zone.model');
      const zonesCount = await Zone.countDocuments({ city: id, deleted: false });
      if (zonesCount > 0) {
        return res.status(400).json({ 
          messageCode: 'MSG_0001', 
          message: 'Cannot delete city with associated zones' 
        });
      }
      
      city.deleted = true;
      await city.save();
      
      res.json({ 
        messageCode: 'MSG_0003', 
        message: 'City deleted successfully'
      });
    } catch (error) {
      console.error('Delete City Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_CITY', 'City')
];

exports.getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const city = await City.findById(id)
      .populate('region', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!city || city.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0001', message: 'City not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      city
    });
  } catch (error) {
    console.error('Get City Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getCities = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      region,
      search = '',
      sort = 'name.en',
      order = 'asc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Region filter
    if (region) query.region = region;
    
    // Search filter
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } }
      ];
    }
    
    const [cities, total] = await Promise.all([
      City.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('region', 'name'),
      
      City.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      cities
    });
  } catch (error) {
    console.error('Get Cities Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};