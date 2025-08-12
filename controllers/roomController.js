const Stay = require('../models/Reservation.model');
const Stay = require('../models/Stay.model');
const Room = require('../models/Room.model');

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
    if (hotel) query.hotel = hotel;

    const rooms = await Room.find(query)
      .populate('category')
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (type === 'overview') {
      // const today = new Date()
      // const tommorow = new Date().getDate(today + 1)
      const enhancedRooms = await Promise.all(rooms.map(async (room) => {
        let status = 'available';
        let user = null;
        let endDate = null;

        const reservation = await Stay.findOne({ 
          roomId: room._id, 
          status: 'confirmed'
        });
        if (reservation) {
          status = 'reserve';
          user = reservation.clientId;
          endDate = reservation.endDate;
        }

        const stay = await Stay.findOne({ room: room._id });
        if (stay) {
          status = 'occupied';
          user = stay.client;
          endDate = stay.checkInDate;
        }

        if (room.isInMaintenance) status = 'maintenance';

        return { ...room.toObject(), status, user, endDate };
      }));

      res.json(enhancedRooms);
    } else if (type === 'detail') {
      const enhancedRooms = await Promise.all(rooms.map(async (room) => {
        const reservations = await Stay.find({ roomId: room._id });
        const stays = await Stay.find({ room: room._id });

        const totalNights = reservations.reduce((sum, r) => sum + (r.endDate - r.startDate) / (1000 * 60 * 60 * 24), 0) +
                            stays.reduce((sum, s) => sum + (s.checkOutDate - s.checkInDate) / (1000 * 60 * 60 * 24), 0);

        const occupancyRate = totalNights / ((new Date() - room.createdAt) / (1000 * 60 * 60 * 24));
        const revenue = reservations.length * room.category.basePrice;

        return {
          ...room.toObject(),
          occupancyRate,
          totalNights,
          totalStays: stays.length,
          totalReservations: reservations.length,
          revenue
        };
      }));

      res.json(enhancedRooms);
    } else {
      res.json(rooms);
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({messageCode: 'MSG_0003', message: error.message });
  }
};


const createRoom = async (req, res) => {
  try {
    const { hotel, category, roomNumber } = req.body;
    const newRoom = new Room({ hotel, category, roomNumber });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0003', message: error.message });
  }
};


const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRoom = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRoom) return res.status(404).json({messageCode: 'MSG_0032', message: 'Room not found' });
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0003', message: error.message });
  }
};


const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findByIdAndUpdate(id, { deleted: true }, { new: true });
    if (!deletedRoom) return res.status(404).json({messageCode: 'MSG_0032', message: 'Room not found' });
    res.json({messageCode: 'MSG_0035', message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0003', message: error.message });
  }
};


const getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id).populate('hotel category');
    if (!room) return res.status(404).json({messageCode: 'MSG_0032', message: 'Room not found' });
    res.json(room);
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0003', message: error.message });
  }
};


const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ deleted: false }).populate('hotel category');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({messageCode: 'MSG_0003', message: error.message });
  }
};

module.exports = {
  getAllRooms,
  getRooms,
  getRoom,
  createRoom,
  deleteRoom,
  updateRoom
}