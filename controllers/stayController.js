const Stay = require('../models/Stay.model');
const Room = require('../models/Room.model');
const Client = require('../models/Client.model');
const Invoice = require('../models/Invoice.model');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createStay = [
  async (req, res) => {
    try {
      const { client, room, startDate, endDate, notes } = req.body;
      const creator = req.user;
      
      // Validate client
      const clientExists = await Client.findById(client);
      if (!clientExists || clientExists.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0084', message: 'Client not found' });
      }
      
      // Validate room
      const roomExists = await Room.findById(room);
      if (!roomExists || roomExists.deleted || roomExists.isInMaintenance) {
        return res.status(404).json({ 
          messageCode: 'MSG_0087', message: 'Room not available' 
        });
      }
      
      // Validate dates
      if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ 
          messageCode: 'MSG_0023', message: 'End date must be after start date' 
        });
      }
      
      // Check room availability
      const overlappingStay = await Stay.findOne({
        room,
        $or: [
          { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
          { startDate: { $gte: startDate, $lt: endDate } }
        ],
        status: { $in: ['confirmed', 'in-progress'] },
        deleted: false
      });
      
      if (overlappingStay) {
        return res.status(409).json({ 
          messageCode: 'MSG_0088', message: 'Room already occupied for this period' 
        });
      }
      
      const newStay = new Stay({
        client,
        room,
        startDate,
        endDate,
        notes,
        status: 'confirmed',
        createdBy: creator._id
      });
      
      await newStay.save();
      
      // Store ID for logging middleware
      res.locals.newId = newStay._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0089', message: 'Stay created successfully',
        stay: newStay
      });
    } catch (error) {
      console.error('Create Stay Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_STAY', 'Stay')
];

exports.updateStay = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const stay = await Stay.findById(id);
      if (!stay || stay.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0010', message: 'Stay not found' });
      }
      
      // Validate status transition
      const validStatuses = ['confirmed', 'cancelled', 'in-progress', 'completed'];
      if (updateData.status && !validStatuses.includes(updateData.status)) {
        return res.status(400).json({ 
          messageCode: 'MSG_0017', message: 'Invalid status' 
        });
      }
      
      // Prevent updating completed stays
      if (stay.status === 'completed') {
        return res.status(400).json({ 
          messageCode: 'MSG_0090', message: 'Cannot update completed stay' 
        });
      }
      
      // Update dates
      if (updateData.startDate || updateData.endDate) {
        const start = updateData.startDate || stay.startDate;
        const end = updateData.endDate || stay.endDate;
        
        if (new Date(start) >= new Date(end)) {
          return res.status(400).json({ 
            messageCode: 'MSG_0023', message: 'End date must be after start date' 
          });
        }
        
        // Check room availability if dates changed
        const overlappingStay = await Stay.findOne({
          _id: { $ne: id },
          room: stay.room,
          $or: [
            { startDate: { $lt: end }, endDate: { $gt: start } },
            { startDate: { $gte: start, $lt: end } }
          ],
          status: { $in: ['confirmed', 'in-progress'] },
          deleted: false
        });
        
        if (overlappingStay) {
          return res.status(409).json({ 
            messageCode: 'MSG_0088', message: 'Room already occupied for this period' 
          });
        }
      }
      
      // Update fields
      if (updateData.startDate) stay.startDate = updateData.startDate;
      if (updateData.endDate) stay.endDate = updateData.endDate;
      if (updateData.status) stay.status = updateData.status;
      if (updateData.notes !== undefined) stay.notes = updateData.notes;
      
      // Handle check-in/check-out
      if (updateData.status === 'in-progress') {
        stay.actualCheckIn = new Date();
      }
      
      if (updateData.status === 'completed') {
        stay.actualCheckOut = new Date();
        
        // Auto-generate invoice
        const invoice = new Invoice({
          stay: stay._id,
          totalAmount: 0, // Will be calculated
          issueDate: new Date(),
          paymentStatus: 'pending',
          createdBy: updater._id
        });
        await invoice.save();
      }
      
      await stay.save();
      
      res.json({ 
        messageCode: 'MSG_0091', message: 'Stay updated successfully',
        stay
      });
    } catch (error) {
      console.error('Update Stay Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_STAY', 'Stay')
];

exports.deleteStay = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const stay = await Stay.findById(id);
      if (!stay || stay.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0010', message: 'Stay not found' });
      }
      
      // Prevent deletion of in-progress or completed stays
      if (stay.status === 'in-progress' || stay.status === 'completed') {
        return res.status(400).json({ 
          messageCode: 'MSG_0092', message: 'Cannot delete in-progress or completed stays' 
        });
      }
      
      // Delete associated invoices
      await Invoice.updateMany(
        { stay: id, deleted: false },
        { $set: { deleted: true } }
      );
      
      stay.deleted = true;
      await stay.save();
      
      res.json({ 
        messageCode: 'MSG_0093', message: 'Stay deleted successfully'
      });
    } catch (error) {
      console.error('Delete Stay Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_STAY', 'Stay')
];

exports.getStayById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const stay = await Stay.findById(id)
      .populate('client', 'firstName lastName email tel')
      .populate('room', 'roomNumber')
      .populate('createdBy', 'firstName lastName');
    
    if (!stay || stay.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0010', message: 'Stay not found' });
    }
    
    // Get associated invoice
    const invoice = await Invoice.findOne({ stay: id, deleted: false });
    
    res.json({ 
      messageCode: 'MSG_0003',  
      stay: {
        ...stay.toObject(),
        invoice
      }
    });
  } catch (error) {
    console.error('Get Stay Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getStays = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      client,
      room,
      status,
      startDate,
      endDate,
      sort = '-startDate',
      order = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Client filter
    if (client) query.client = client;
    
    // Room filter
    if (room) query.room = room;
    
    // Status filter
    if (status) query.status = status;
    
    // Date range filters
    if (startDate || endDate) {
      query.$or = [
        { 
          startDate: { $lte: endDate ? new Date(endDate) : new Date() },
          endDate: { $gte: startDate ? new Date(startDate) : new Date(0) }
        },
        { 
          startDate: { 
            $gte: startDate ? new Date(startDate) : new Date(0),
            $lte: endDate ? new Date(endDate) : new Date() 
          } 
        }
      ];
    }
    
    const [stays, total] = await Promise.all([
      Stay.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('client', 'firstName lastName')
        .populate('room', 'roomNumber'),
      
      Stay.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      stays
    });
  } catch (error) {
    console.error('Get Stays Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};