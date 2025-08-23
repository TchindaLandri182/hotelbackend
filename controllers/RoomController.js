const Room = require('../models/Room.model');
const CategoryRoom = require('../models/CategoryRoom.model');
const Hotel = require('../models/Hotel.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createRoom = [
  async (req, res) => {
    try {
      const { hotel, category, roomNumber } = req.body;
      const creator = req.user;
      
      // Validate hotel
      const hotelExists = await Hotel.findById(hotel);
      if (!hotelExists || hotelExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0004', message: 'Hotel not found' });
      }
      
      // Validate category
      const categoryExists = await CategoryRoom.findById(category);
      if (!categoryExists || categoryExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
      }
      
      // Check if room number exists in hotel
      const existingRoom = await Room.findOne({ hotel, roomNumber, deleted: false });
      if (existingRoom) {
        return res.status(409).json({ 
          messageCode: 'MSG_0030', message: 'Room number already exists in this hotel' 
        });
      }
      
      const newRoom = new Room({
        hotel,
        category,
        roomNumber,
        createdBy: creator._id
      });
      
      await newRoom.save();
      
      // Store ID for logging middleware
      res.locals.newId = newRoom._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0031', message: 'Room created successfully',
        room: newRoom
      });
    } catch (error) {
      console.error('Create Room Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_ROOM', 'Room')
];

exports.updateRoom = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const room = await Room.findById(id);
      if (!room || room.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0032', message: 'Room not found' });
      }
      
      // Update room number if changed
      if (updateData.roomNumber && updateData.roomNumber !== room.roomNumber) {
        const existingRoom = await Room.findOne({
          hotel: room.hotel,
          roomNumber: updateData.roomNumber,
          deleted: false
        });
        
        if (existingRoom) {
          return res.status(409).json({ 
            messageCode: 'MSG_0030', message: 'Room number already exists in this hotel' 
          });
        }
        room.roomNumber = updateData.roomNumber;
      }
      
      // Update category
      if (updateData.category) {
        const categoryExists = await CategoryRoom.findById(updateData.category);
        if (!categoryExists || categoryExists.deleted) {
          return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
        }
        room.category = updateData.category;
      }
      
      // Update maintenance status
      if (updateData.isInMaintenance !== undefined) {
        room.isInMaintenance = updateData.isInMaintenance;
      }
      
      await room.save();
      
      res.json({ 
        messageCode: 'MSG_0033', message: 'Room updated successfully',
        room
      });
    } catch (error) {
      console.error('Update Room Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_ROOM', 'Room')
];

exports.deleteRoom = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const room = await Room.findById(id);
      if (!room || room.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0032', message: 'Room not found' });
      }
      
      // Check for active reservations
      const activeReservation = await Stay.findOne({
        room: id,
        status: { $in: ['pending', 'confirmed'] },
        deleted: false
      });
      
      if (activeReservation) {
        return res.status(400).json({ 
          messageCode: 'MSG_0034', message: 'Cannot delete room with active reservations' 
        });
      }
      
      room.deleted = true;
      await room.save();
      
      res.json({ 
        messageCode: 'MSG_0035', message: 'Room deleted successfully'
      });
    } catch (error) {
      console.error('Delete Room Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_ROOM', 'Room')
];

exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const room = await Room.findById(id)
      .populate('hotel', 'name')
      .populate('category', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!room || room.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0032', message: 'Room not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      room
    });
  } catch (error) {
    console.error('Get Room Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      hotel,
      category,
      isInMaintenance,
      available,
      sort = 'roomNumber',
      order = 'asc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Hotel filter
    if (hotel) query.hotel = hotel;
    
    // Category filter
    if (category) query.category = category;
    
    // Maintenance filter
    if (isInMaintenance) query.isInMaintenance = isInMaintenance === 'true';
    
    // Available rooms filter
    if (available === 'true') {
      const now = new Date();
      
      // Find rooms with no active reservations
      const reservedRoomIds = await Stay.distinct('room', {
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { startDate: { $lte: now }, endDate: { $gte: now } },
          { startDate: { $gte: now } }
        ],
        deleted: false
      });
      
      query._id = { $nin: reservedRoomIds };
      query.isInMaintenance = false;
    }
    
    const [rooms, total] = await Promise.all([
      Room.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('hotel', 'name')
        .populate('category', 'name'),
      
      Room.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      rooms
    });
  } catch (error) {
    console.error('Get Rooms Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};