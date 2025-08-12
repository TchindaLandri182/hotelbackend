// const CategoryRoom = require('../models/CategoryRoom.model');
// const Room = require('../models/Room.model');
// const Stay = require('../models/Stay.model');
// const Stay = require('../models/Reservation.model');
// const Hotel = require('../models/Hotel.model');
// const roleList = require('../constants/roleLIst.constants')
// const validator = require('validator');
// const mongoose = require('mongoose');

// const createCategoryRoom = async (req, res) => {
//   try{
//     const { name, description, basePrice, hotelId } = req.body;

//     if(req.user.role !== roleList.admin && hotelId !== req.user.hotel){
//       return res.status(403).json({messageCode: 'MSG_0073', message: 'Not authorized' });
//     }

//     if (!hotelId) return res.status(400).json({messageCode: 'MSG_0074', message: 'Hotel is required' });
//     if (!name) return res.status(400).json({messageCode: 'MSG_0075', message: 'Name is required' });
//     if (!description) return res.status(400).json({messageCode: 'MSG_0076', message: 'Description is required' });
//     if (!basePrice) return res.status(400).json({messageCode: 'MSG_0077', message: 'basePrice is invalid' });

//     const hotel = await Hotel.findOne({_id: hotelId, deleted: false})
//     if(!hotel){
//       return res.status(404).json({messageCode: 'MSG_0078', message: 'Hotel not Found'})
//     }

//     const newCategory = await CategoryRoom.create({
//       name,
//       description,
//       basePrice: Number(basePrice),
//       hotel: hotelId,
//       createdBy: req.user._id
//     });

//     res.status(201).json(newCategory);

//   } catch (err) {
//     console.log(err)
//     res.status(500).json({messageCode: 'MSG_0003', message: err.message });
//   }
// };

// const updateCategoryRoom = async (req, res) => {
//   try{
//       const { id } = req.params;
//       const category = await CategoryRoom.findById(id);
//       if (!category || category.deleted) return res.status(404).json({messageCode: 'MSG_0079', message: 'Room Category not found' });

//       // Only admin, hotel owner or roomManager
//       if (
//         req.user.role !== roleList.admin &&
//         !(req.user.role === roleList.owner && category.hotel.equals(req.user.hotel)) &&
//         !(req.user.role === roleList.hotelManager && category.hotel.equals(req.user.hotel))
//       ) {
//         return res.status(403).json({messageCode: 'MSG_0073', message: 'Not authorized' });
//       }

//       const updated = await CategoryRoom.findByIdAndUpdate(id, req.body, { new: true });
//       res.json(updated);
//     } catch (err) {
//     console.log(err)
//     res.status(500).json({messageCode: 'MSG_0003', message: err.message });
//   }
//   };

// const deleteCategoryRoom = async (req, res) => {
//   try{
//     const { id } = req.params;
//     const category = await CategoryRoom.findById(id);
//     if (!category || category.deleted) return res.status(404).json({messageCode: 'MSG_0080', message: 'Room Category Not found' });

//     if (
//       req.user.role !== 'admin' &&
//       !(req.user.role === 'owner' && category.hotel.equals(req.user.hotel))
//     ) {
//       return res.status(403).json({messageCode: 'MSG_0073', message: 'Not authorized' });
//     }

//     category.deleted = true;
//     await category.save();
//     res.json({messageCode: 'MSG_0081', message: 'Deleted successfully' });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({messageCode: 'MSG_0003', message: err.message });
//   }
// };

// const getCategoryRoomById = async (req, res) => {
//   try{
//     const category = await CategoryRoom.findById(req.params.id).populate('hotel');
//     if (!category || category.deleted) return res.status(404).json({messageCode: 'MSG_0082', message: 'Room Categories Not found' });
//     res.json(category);
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({messageCode: 'MSG_0003', message: err.message });
//   }
// };

// const getAllCategoryRooms = async (req, res) => {
//   try{
//     const { hotel } = req.query
//     const searchHotel = Hotel.findOne({hotel})

//     if(req.user.role !== roleList.admin && hotel !== req.user.hotel){
//       return res.status(403).json({messageCode: 'MSG_0073', message: 'Not authorized' });
//     }

//     if(!searchHotel || searchHotel.deleted){
//       return res.status(404).json({messageCode: 'MSG_0004', message: 'Hotel not found'})
//     }

//     const categories = await CategoryRoom.find({hotel, deleted: false})

//   } catch (err) {
//     console.log(err)
//     res.status(500).json({messageCode: 'MSG_0003', message: err.message });
//   }
// }

// const getCategoryRooms = async (req, res) => {
//   try{
//     const {
//       page = 1,
//       limit = 10,
//       search = '',
//       sort = 'name',
//       order = 'asc',
//       type = 'overview',
//       hotel,
//       startDate = new Date().toISOString(),
//       endDate = new Date().toISOString()
//     } = req.query;

//     const skip = (page - 1) * limit;

//     const filter = {
//       deleted: false,
//       ...(req.user.role !== roleList.admin ? { hotel: req.user.hotel } : {}),
//       ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
//       ...(hotel ? {hotel} : {})
//     };
//     let categories
//     if(req.user.role === roleList.admin && !hotel){
//       categories = await CategoryRoom.find(filter)
//         .sort({ [sort]: order === 'desc' ? -1 : 1 })
//         .skip(Number(skip))
//         .populate('hotel')
//         .limit(Number(limit));
//     }else{
//       categories = await CategoryRoom.find(filter)
//         .sort({ [sort]: order === 'desc' ? -1 : 1 })
//         .skip(Number(skip))
//         .select('-hotel')
//         .limit(Number(limit));
//     }

//     const categoryIds = categories.map(c => c._id);

//     // Enrichment
//     const roomCounts = await Room.aggregate([
//       { $match: { categoryId: { $in: categoryIds }, deleted: false } },
//       {
//         $group: {
//           _id: '$categoryId',
//           totalRooms: { $sum: 1 }
//         }
//       }
//     ]);

//     const stayData = await Stay.aggregate([
//       {
//         $match: {
//           deleted: false,
//           checkInDate: { $gte: new Date(startDate) },
//           checkOutDate: { $lte: new Date(endDate) }
//         }
//       },
//       {
//         $lookup: {
//           from: 'rooms',
//           localField: 'room',
//           foreignField: '_id',
//           as: 'roomInfo'
//         }
//       },
//       { $unwind: '$roomInfo' },
//       {
//         $group: {
//           _id: '$roomInfo.categoryId',
//           stayCount: { $sum: 1 },
//           revenue: { $sum: '$roomInfo.basePrice' }
//         }
//       }
//     ]);

//     const reservationData = await Stay.aggregate([
//       {
//         $match: {
//           deleted: false,
//           status: 'confirmed',
//           startDate: { $lte: new Date(endDate) },
//           endDate: { $gte: new Date(startDate) }
//         }
//       },
//       {
//         $lookup: {
//           from: 'rooms',
//           localField: 'roomId',
//           foreignField: '_id',
//           as: 'roomInfo'
//         }
//       },
//       { $unwind: '$roomInfo' },
//       {
//         $group: {
//           _id: '$roomInfo.categoryId',
//           reservedRooms: { $sum: 1 }
//         }
//       }
//     ]);

//     // Map enrichments
//     const categoryData = categories.map(cat => {
//       const stats = {
//         totalRooms: 0,
//         available: 0,
//         occupied: 0,
//         occupancyRate: 0,
//         stayCount: 0,
//         revenue: 0
//       };

//       const roomStat = roomCounts.find(r => String(r._id) === String(cat._id));
//       if (roomStat) stats.totalRooms = roomStat.totalRooms;

//       const stayStat = stayData.find(s => String(s._id) === String(cat._id));
//       if (stayStat) {
//         stats.stayCount = stayStat.stayCount;
//         stats.revenue += stayStat.revenue;
//       }

//       const resStat = reservationData.find(r => String(r._id) === String(cat._id));
//       if (resStat) stats.occupied = resStat.reservedRooms;

//       stats.available = stats.totalRooms - stats.occupied;
//       stats.occupancyRate = stats.totalRooms
//         ? ((stats.occupied / stats.totalRooms) * 100).toFixed(2)
//         : 0;

//       return {
//         ...cat.toObject(),
//         ...(type === 'overview'
//           ? { 
//               totalRooms: stats.totalRooms, 
//               occupancyRate: stats.occupancyRate, 
//               revenue: stats.revenue 
//             }
//           : type === 'detail' ? {
//               available: stats.available,
//               occupied: stats.occupied,
//               stayCount: stats.stayCount,
//               revenue: stats.revenue,
//               totalRooms: stats.totalRooms
//             } : {})
//       };
//     });

//     res.json({messageCode: 'MSG_0003', //       page: Number(page),
//       limit: Number(limit),
//       total: await CategoryRoom.countDocuments(filter),
//       data: categoryData
//     });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({messageCode: 'MSG_0003', message: err.message });
//   }
// };

// module.exports = {
//   getCategoryRoomById,
//   getCategoryRooms,
//   getAllCategoryRooms,
//   createCategoryRoom,
//   updateCategoryRoom,
//   deleteCategoryRoom
// }
const CategoryRoom = require('../models/CategoryRoom.model');
const Log = require('../models/Log.model');
const { createLog } = require('../services/logService');
const permissions = require('../constants/permissions.constants');

exports.createCategoryRoom = async (req, res) => {
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
    
    // Log creation
    await createLog({
      action: 'CREATE_CATEGORY_ROOM',
      type: 'activity',
      user: creator._id,
      objectId: newCategory._id,
      objectType: 'CategoryRoom',
      details: req.body
    });

    res.status(201).json({
      messageCode: 'MSG_0003', 
      categoryRoom: newCategory
    });
  } catch (error) {
    console.error('Create Category Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.updateCategoryRoom = async (req, res) => {
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
    
    // Log update
    await createLog({
      action: 'UPDATE_CATEGORY_ROOM',
      type: 'activity',
      user: updater._id,
      objectId: category._id,
      objectType: 'CategoryRoom',
      details: {
        before: category._doc,
        after: updateData
      }
    });

    res.json({ messageCode: 'MSG_0003',  categoryRoom: category });
  } catch (error) {
    console.error('Update Category Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.deleteCategoryRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deleter = req.user;

    const category = await CategoryRoom.findById(id);
    if (!category || category.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
    }

    category.deleted = true;
    await category.save();
    
    // Log deletion
    await createLog({
      action: 'DELETE_CATEGORY_ROOM',
      type: 'activity',
      user: deleter._id,
      objectId: category._id,
      objectType: 'CategoryRoom',
      details: category
    });

    res.json({ messageCode: 'MSG_0072', message: 'Category deleted' });
  } catch (error) {
    console.error('Delete Category Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getCategoryRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryRoom.findById(id)
      .populate('hotel', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!category || category.deleted) {
      return res.status(404).json({ messageCode: 'MSG_0029', message: 'Category not found' });
    }
    
    res.json({ messageCode: 'MSG_0003',  categoryRoom: category });
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
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
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