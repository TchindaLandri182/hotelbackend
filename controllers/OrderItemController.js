const OrderItem = require('../models/OrderItem.model');
const Stay = require('../models/Stay.model');
const FoodItem = require('../models/FoodItem.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createOrderItem = [
  async (req, res) => {
    try {
      const { stay, foodItem, quantity, status, orderDate } = req.body;
      const creator = req.user;
      
      // Validate stay
      const stayExists = await Stay.findById(stay);
      if (!stayExists || stayExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0010', message: 'Stay not found' });
      }
      
      // Validate food item
      const foodItemExists = await FoodItem.findById(foodItem);
      if (!foodItemExists || foodItemExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0007', message: 'Food item not found' });
      }
      
      // Validate status
      const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ 
          messageCode: 'MSG_0017', message: 'Invalid status' 
        });
      }
      
      const newOrderItem = new OrderItem({
        stay,
        foodItem,
        quantity,
        status: status || 'pending',
        orderDate: orderDate || Date.now(),
        servedBy: creator._id,
        createdBy: creator._id
      });
      
      await newOrderItem.save();
      
      // Store ID for logging middleware
      res.locals.newId = newOrderItem._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0018', message: 'Order item created successfully',
        orderItem: newOrderItem
      });
    } catch (error) {
      console.error('Create OrderItem Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_ORDER_ITEM', 'OrderItem')
];

exports.updateOrderItem = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const orderItem = await OrderItem.findById(id);
      if (!orderItem || orderItem.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0019', message: 'Order item not found' });
      }
      
      // Update quantity
      if (updateData.quantity !== undefined) {
        orderItem.quantity = updateData.quantity;
      }
      
      // Update status
      if (updateData.status) {
        const validStatuses = ['pending', 'preparing', 'served', 'cancelled'];
        if (!validStatuses.includes(updateData.status)) {
          return res.status(400).json({ 
            messageCode: 'MSG_0017', message: 'Invalid status' 
          });
        }
        orderItem.status = updateData.status;
      }
      
      // Update served by
      if (updateData.servedBy) {
        orderItem.servedBy = updateData.servedBy;
      }
      
      await orderItem.save();
      
      res.json({ 
        messageCode: 'MSG_0020', message: 'Order item updated successfully',
        orderItem
      });
    } catch (error) {
      console.error('Update OrderItem Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_ORDER_ITEM', 'OrderItem')
];

exports.deleteOrderItem = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const orderItem = await OrderItem.findById(id);
      if (!orderItem || orderItem.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0019', message: 'Order item not found' });
      }
      
      orderItem.deleted = true;
      await orderItem.save();
      
      res.json({ 
        messageCode: 'MSG_0021', message: 'Order item deleted successfully'
      });
    } catch (error) {
      console.error('Delete OrderItem Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_ORDER_ITEM', 'OrderItem')
];

exports.getOrderItemById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderItem = await OrderItem.findById(id)
      .populate('stay', 'startDate endDate')
      .populate('foodItem', 'name price')
      .populate('servedBy', 'firstName lastName')
      .populate('createdBy', 'firstName lastName');
    
    if (!orderItem || orderItem.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0019', message: 'Order item not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      orderItem
    });
  } catch (error) {
    console.error('Get OrderItem Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      stay,
      foodItem,
      status,
      startDate,
      endDate,
      sort = '-orderDate',
      order = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Stay filter
    if (stay) query.stay = stay;
    
    // Food item filter
    if (foodItem) query.foodItem = foodItem;
    
    // Status filter
    if (status) query.status = status;
    
    // Date range filter
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) query.orderDate.$gte = new Date(startDate);
      if (endDate) query.orderDate.$lte = new Date(endDate);
    }
    
    const [orderItems, total] = await Promise.all([
      OrderItem.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('stay', 'startDate endDate')
        .populate('foodItem', 'name price')
        .populate('servedBy', 'firstName lastName'),
      
      OrderItem.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      orderItems
    });
  } catch (error) {
    console.error('Get OrderItems Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};