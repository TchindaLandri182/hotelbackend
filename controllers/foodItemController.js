const FoodItem = require('../models/FoodItem.model');
const Hotel = require('../models/Hotel.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createFoodItem = [
  async (req, res) => {
    try {
      const { name, description, price, hotel, category } = req.body;
      const creator = req.user;
      
      // Validate hotel
      const hotelExists = await Hotel.findById(hotel);
      if (!hotelExists || hotelExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0004', message: 'Hotel not found' });
      }
      
      // Validate category
      const validCategories = ['food', 'beverage'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          messageCode: 'MSG_0005', message: 'Invalid category. Valid options: food, beverage' 
        });
      }
      
      const newFoodItem = new FoodItem({
        name: {
          en: name.en,
          fr: name.fr
        },
        description: {
          en: description.en,
          fr: description.fr
        },
        price,
        hotel,
        category,
        createdBy: creator._id
      });
      
      await newFoodItem.save();
      
      // Store ID for logging middleware
      res.locals.newId = newFoodItem._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0006', message: 'Food item created successfully',
        foodItem: newFoodItem
      });
    } catch (error) {
      console.error('Create FoodItem Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_FOOD_ITEM', 'FoodItem')
];

exports.updateFoodItem = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const foodItem = await FoodItem.findById(id);
      if (!foodItem || foodItem.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0007', message: 'Food item not found' });
      }
      
      // Update name
      if (updateData.name) {
        if (updateData.name.en) foodItem.name.en = updateData.name.en;
        if (updateData.name.fr) foodItem.name.fr = updateData.name.fr;
      }
      
      // Update description
      if (updateData.description) {
        if (updateData.description.en) foodItem.description.en = updateData.description.en;
        if (updateData.description.fr) foodItem.description.fr = updateData.description.fr;
      }
      
      // Update price
      if (updateData.price !== undefined) {
        foodItem.price = updateData.price;
      }
      
      // Update category
      if (updateData.category) {
        const validCategories = ['food', 'beverage'];
        if (!validCategories.includes(updateData.category)) {
          return res.status(400).json({ 
            messageCode: 'MSG_0005', message: 'Invalid category. Valid options: food, beverage' 
          });
        }
        foodItem.category = updateData.category;
      }
      
      await foodItem.save();
      
      res.json({ 
        messageCode: 'MSG_0008', message: 'Food item updated successfully',
        foodItem
      });
    } catch (error) {
      console.error('Update FoodItem Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_FOOD_ITEM', 'FoodItem')
];

exports.deleteFoodItem = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const foodItem = await FoodItem.findById(id);
      if (!foodItem || foodItem.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0007', message: 'Food item not found' });
      }
      
      foodItem.deleted = true;
      await foodItem.save();
      
      res.json({ 
        messageCode: 'MSG_0009', message: 'Food item deleted successfully'
      });
    } catch (error) {
      console.error('Delete FoodItem Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_FOOD_ITEM', 'FoodItem')
];

exports.getFoodItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const foodItem = await FoodItem.findById(id)
      .populate('hotel', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!foodItem || foodItem.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0007', message: 'Food item not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      foodItem
    });
  } catch (error) {
    console.error('Get FoodItem Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getFoodItems = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      search = '',
      hotel,
      minPrice,
      maxPrice,
      category,
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
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.fr': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Hotel filter
    if (hotel) query.hotel = hotel;
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Category filter
    if (category) query.category = category;
    
    const [foodItems, total] = await Promise.all([
      FoodItem.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('hotel', 'name'),
      
      FoodItem.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      foodItems
    });
  } catch (error) {
    console.error('Get FoodItems Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};