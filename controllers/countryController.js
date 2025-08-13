const Country = require('../models/Country.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createCountry = [
  async (req, res) => {
    try {
      const { name, code } = req.body;
      const creator = req.user;
      
      const newCountry = new Country({
        name: {
          en: name.en,
          fr: name.fr
        },
        code,
        createdBy: creator._id
      });
      
      await newCountry.save();
      
      // Store ID for logging middleware
      res.locals.newId = newCountry._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0037', message: 'Country created successfully',
        country: newCountry
      });
    } catch (error) {
      console.error('Create Country Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_COUNTRY', 'Country')
];

exports.updateCountry = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const country = await Country.findById(id);
      if (!country || country.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0036', message: 'Country not found' });
      }
      
      // Update name
      if (updateData.name) {
        if (updateData.name.en) country.name.en = updateData.name.en;
        if (updateData.name.fr) country.name.fr = updateData.name.fr;
      }
      
      // Update code
      if (updateData.code) {
        country.code = updateData.code;
      }
      
      await country.save();
      
      res.json({ 
        messageCode: 'MSG_0039', message: 'Country updated successfully',
        country
      });
    } catch (error) {
      console.error('Update Country Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_COUNTRY', 'Country')
];

exports.deleteCountry = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const country = await Country.findById(id);
      if (!country || country.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0036', message: 'Country not found' });
      }
      
      // Check if country has regions
      const Region = require('../models/Region.model');
      const regionsCount = await Region.countDocuments({ country: id, deleted: false });
      if (regionsCount > 0) {
        return res.status(400).json({ 
          messageCode: 'MSG_0040', message: 'Cannot delete country with associated regions' 
        });
      }
      
      country.deleted = true;
      await country.save();
      
      res.json({ 
        messageCode: 'MSG_0041', message: 'Country deleted successfully'
      });
    } catch (error) {
      console.error('Delete Country Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_COUNTRY', 'Country')
];

exports.getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const country = await Country.findById(id)
      .populate('createdBy', 'firstName lastName');
    
    if (!country || country.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0036', message: 'Country not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      country
    });
  } catch (error) {
    console.error('Get Country Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getCountries = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      search = '',
      sort = 'name.en',
      order = 'asc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Search filter
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    const [countries, total] = await Promise.all([
      Country.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit)),
      
      Country.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      countries
    });
  } catch (error) {
    console.error('Get Countries Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};