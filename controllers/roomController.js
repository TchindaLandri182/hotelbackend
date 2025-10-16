const Stay = require('../models/Stay.model');
const Room = require('../models/Room.model');
const { createLog, logAction } = require('../services/logService');

const getRooms = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      hotel, 
      sort = 'roomNumber', 
      order = 'asc', 
      type 
    } = req.query;

    const query = { deleted: false };
    if (hotel || user?.hotel) query.hotel = hotel || user?.hotel;

    const rooms = await Room.find(query)
      .populate('category')
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('hotel', 'name')
      .populate('createdBy', 'firstName lastName');

    if (type === 'overview') {
      const enhancedRooms = await Promise.all(rooms.map(async (room) => {
        let status = 'available';
        let user = null;
        let endDate = null;

        const stay = await Stay.findOne({ 
          room: room._id,
          status: { $in: ['confirmed', 'in-progress'] },
          deleted: false
        });
        
        if (stay) {
          status = stay.status === 'in-progress' ? 'occupied' : 'reserved';
          user = stay.client;
          endDate = stay.endDate;
        }

        if (room.isInMaintenance) status = 'maintenance';

        return { ...room.toObject(), status, user, endDate };
      }));

      res.json({messageCode: 'MSG_0003', rooms: enhancedRooms});
    } else if (type === 'detail') {
      const enhancedRooms = await Promise.all(rooms.map(async (room) => {
        const stays = await Stay.find({ room: room._id, deleted: false });

        const totalNights = stays.reduce((sum, s) => {
          const nights = (new Date(s.endDate) - new Date(s.startDate)) / (1000 * 60 * 60 * 24);
          return sum + nights;
        }, 0);

        const daysSinceCreation = (new Date() - room.createdAt) / (1000 * 60 * 60 * 24);
        const occupancyRate = daysSinceCreation > 0 ? (totalNights / daysSinceCreation * 100).toFixed(2) : 0;
        const revenue = stays.length * (room.category?.basePrice || 0);

        return {
          ...room.toObject(),
          occupancyRate,
          totalNights,
          totalStays: stays.length,
          revenue
        };
      }));

      res.json({messageCode: 'MSG_0003', rooms: enhancedRooms});
    } else {
      res.json({messageCode: 'MSG_0003', rooms});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({messageCode: 'MSG_0001', message: error.message });
  }
};

const createRoom = [
  async (req, res) => {
    try {
      const { hotel, category, roomNumber } = req.body;
      const newRoom = new Room({ 
        hotel, 
        category, 
        roomNumber,
        createdBy: req.user._id
      });
      await newRoom.save();
      
      res.locals.newId = newRoom._id;
      res.status(201).json({messageCode: 'MSG_0031', room: newRoom});
    } catch (error) {
      res.status(500).json({messageCode: 'MSG_0001', message: error.message });
    }
  },
  logAction('CREATE_ROOM', 'Room')
];

const updateRoom = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedRoom) return res.status(404).json({messageCode: 'MSG_0032', message: 'Room not found' });
      res.json({messageCode: 'MSG_0033', room: updatedRoom});
    } catch (error) {
      res.status(500).json({messageCode: 'MSG_0001', message: error.message });
    }
  },
  logAction('UPDATE_ROOM', 'Room')
];

const deleteRoom = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRoom = await Room.findByIdAndUpdate(id, { deleted: true }, { new: true });
      if (!deletedRoom) return res.status(404).json({messageCode: 'MSG_0032', message: 'Room not found' });
      res.json({messageCode: 'MSG_0035', message: 'Room deleted' });
    } catch (error) {
      res.status(500).json({messageCode: 'MSG_0001', message: error.message });
    }
  },
  logAction('DELETE_ROOM', 'Room')
];

const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate('hotel category');
    if (!room) return res.status(404).json({messageCode: 'MSG_0032', message: 'Room not found' });
    res.json({messageCode: 'MSG_0003', room});
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0001', message: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const { hotel } = req.query
    const query = { deleted: false }
    if(req.user?.hotel || hotel) {
      query.hotel = req.user?.hotel || hotel
    }
    const rooms = await Room.find(query).populate('hotel category');
    res.json({messageCode: 'MSG_0003', rooms});
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0001', message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRooms,
  getRoom,
  createRoom,
  deleteRoom,
  updateRoom
};