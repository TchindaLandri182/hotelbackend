const Hotel = require('../models/Hotel.model');
const User = require('../models/User.model');
const Zone = require('../models/Zone.model');
const roleHierarchy = require('../constants/roleHierarchy');
const { createLog, logAction } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createHotel = [
  async (req, res) => {
    try {
      const { name, address, owners, zone } = req.body;
      const creator = req.user;

      //check if creator can create 
      if (creator.role !== 'owner' && !roleHierarchy.canManage(creator.role, 'owner')) {
        return res.status(403).json({ 
          messageCode: 'MSG_0094', message: 'Missing permission'
        });
      }
      
      // Validate zone
      // if(zone){
      //   const zoneExists = await Zone.findById(zone);
      //   if (!zoneExists || zoneExists.deleted) {
      //     return res.status(404).json({ messageCode: 'MSG_0038', message: 'Zone not found' });
      //   }
      // }
      
      // Validate owners
      if(owners.length > 0){
        const validOwners = await User.find({ 
          _id: { $in: owners }, 
          role: 'owner',
          deleted: false
        }).lean();
        
        if (validOwners.length !== owners.length) {
          return res.status(400).json({ 
            messageCode: 'MSG_0042', message: 'One or more owners are invalid' 
          });
        }
      }
      let logo = {}
      if (req.file) {
        // Delete old image if exists
        // if (user.profileImage?.public_id) {
        //   await deleteFromCloudinary(user.profileImage.public_id);
        // }
        logo = {
          public_id: req.file.public_id,
          url: req.file.secure_url
        };
      }

      const newHotel = new Hotel({
        name,
        address,
        logo,
        owners : owners.length > 0 ? owners : [creator._id],
        // zone,
        createdBy: creator._id
      });
      
      await newHotel.save();

      //link hotel owner with hotel
      if(owners.length > 0){
        await User.updateMany({_id: { $in : owners } },{$set: {hotel: newHotel._id}})
      }else{
        creator.hotel = newHotel._id
        await creator.save();
      }
      
      // Store ID for logging middleware
      res.locals.newId = newHotel._id;
      
      res.status(201).json({ 
        messageCode: 'MSG_0043', message: 'Hotel created successfully',
        hotel: newHotel
      });
    } catch (error) {
      console.error('Create Hotel Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('CREATE_HOTEL', 'Hotel')
];

exports.updateHotel = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const updater = req.user;
      const updateData = req.body;
      
      const hotel = await Hotel.findById(id);
      if (!hotel || hotel.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0004', message: 'Hotel not found' });
      }
      
      // Update basic info
      if (updateData.name) hotel.name = updateData.name;
      if (updateData.address) hotel.address = updateData.address;
      if (updateData.logo) hotel.logo = updateData.logo;
      
      // Update zone
      if (updateData.zone) {
        const zoneExists = await Zone.findById(updateData.zone);
        if (!zoneExists || zoneExists.deleted) {
          return res.status(404).json({ messageCode: 'MSG_0038', message: 'Zone not found' });
        }
        hotel.zone = updateData.zone;
      }
      
      // Update owners
      if (updateData.owners) {
        const validOwners = await User.find({ 
          _id: { $in: updateData.owners }, 
          role: 'owner',
          deleted: false
        });
        
        if (validOwners.length !== updateData.owners.length) {
          return res.status(400).json({ 
            messageCode: 'MSG_0042', message: 'One or more owners are invalid' 
          });
        }
        hotel.owners = updateData.owners;
      }
      
      await hotel.save();
      
      res.json({ 
        messageCode: 'MSG_0044', message: 'Hotel updated successfully',
        hotel
      });
    } catch (error) {
      console.error('Update Hotel Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('UPDATE_HOTEL', 'Hotel')
];

exports.deleteHotel = [
  async (req, res) => {
    try {
      const { id } = req.params;
      const deleter = req.user;
      
      const hotel = await Hotel.findById(id);
      if (!hotel || hotel.deleted) {
        return res.status(404).json({ messageCode: 'MSG_0004', message: 'Hotel not found' });
      }
      
      hotel.deleted = true;
      await hotel.save();
      
      res.json({ 
        messageCode: 'MSG_0045', message: 'Hotel deleted successfully'
      });
    } catch (error) {
      console.error('Delete Hotel Error:', error);
      res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
    }
  },
  logAction('DELETE_HOTEL', 'Hotel')
];

exports.getHotelById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const hotel = await Hotel.findById(id)
      .populate('owners', 'firstName lastName email')
      .populate('zone', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!hotel || hotel.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0004', message: 'Hotel not found' });
    }
    
    res.json({ 
      messageCode: 'MSG_0003',  
      hotel
    });
  } catch (error) {
    console.error('Get Hotel Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getAllHotels = async (req, res) => {
  try{
    const hotels = await Hotel.find({deleted: false});
    res.json({ 
      messageCode: 'MSG_0003',  
      hotels
    });
  }catch (error) {
    console.error('Get Hotel Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
}

exports.getHotels = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20,
      search = '',
      zone,
      owner,
      sort = 'name',
      order = 'asc'
    } = req.query;
    
    const skip = (page - 1) * limit;
    const query = { deleted: false };
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Zone filter
    if (zone) query.zone = zone;
    
    // Owner filter
    if (owner) query.owners = owner;
    
    const [hotels, total] = await Promise.all([
      Hotel.find(query)
        .sort({ [sort]: order === 'desc' ? -1 : 1 })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate('owners', 'firstName lastName')
        .populate('zone', 'name'),
      
      Hotel.countDocuments(query)
    ]);
    
    res.json({
      messageCode: 'MSG_0003', 
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      hotels
    });
  } catch (error) {
    console.error('Get Hotels Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};