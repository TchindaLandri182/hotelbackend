const CategoryRoom = require('../models/CategoryRoom.model');
const Log = require('../models/Log.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createCategoryRoom = [
  async (req, res) => {
    try {
      const { name, description, basePrice, hotel } = req.body;
      const creator = req.user;
      
      const newCategory = new CategoryRoom({
        name,
        description,
        basePrice: basePrice || 0,
        hotel,
        createdBy: creator._id
      });

      await newCategory.save();
      
      res.locals.newId = newCategory._id;
      res.status(201).json({
        messageCode: 'MSG_0003', 
        categoryRoom: newCategory
      });
    } catch (error) {
      console.error('Create Category Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_CATEGORY_ROOM', 'CategoryRoom')
];

exports.updateCategoryRoom = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;

      const category = await CategoryRoom.findById(id);
      if (!category || category.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
      }

      Object.assign(category, updateData);
      await category.save();
      
      res.json({ messageCode: 'MSG_0003', categoryRoom: category });
    } catch (error) {
      console.error('Update Category Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_CATEGORY_ROOM', 'CategoryRoom')
];

exports.deleteCategoryRoom = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;

      const category = await CategoryRoom.findById(id);
      if (!category || category.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
      }

      category.deleted = true;
      await category.save();
      
      res.json({ messageCode: 'MSG_0072', message: 'Category deleted' });
    } catch (error) {
      console.error('Delete Category Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_CATEGORY_ROOM', 'CategoryRoom')
];

exports.getCategoryRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryRoom.findById(id)
      .populate('hotel', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!category || category.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
    }
    
    res.json({ messageCode: 'MSG_0003', categoryRoom: category });
  } catch (error) {
    console.error('Get Category Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getCategoryRooms = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '',
      hotel,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { deleted: false };

    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.fr': { $regex: search, $options: 'i' } }
      ];
    }

    if (hotel) query.hotel = hotel;
    if (minPrice) query.basePrice = { $gte: Number(minPrice) };
    if (maxPrice) {
      query.basePrice = query.basePrice || {};
      query.basePrice.$lte = Number(maxPrice);
    }

    const [categories, total] = await Promise.all([
      CategoryRoom.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('hotel', 'name')
        .populate('createdBy', 'firstName lastName'),
      
      CategoryRoom.countDocuments(query)
    ]);

    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      categories
    });
  } catch (error) {
    console.error('Get Categories Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};