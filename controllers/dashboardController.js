const Hotel = require('../models/Hotel.model');
const Room = require('../models/Room.model');
const Client = require('../models/Client.model');
const Stay = require('../models/Stay.model');
const Invoice = require('../models/Invoice.model');
const OrderItem = require('../models/OrderItem.model');
const User = require('../models/User.model');
const Log = require('../models/Log.model');

exports.getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    let hotelFilter = {};
    
    // Apply hotel filter based on user role
    if (user.role !== 'admin') {
      if (user.hotel) {
        hotelFilter = { hotel: user.hotel };
      } else if (user.role === 'owner') {
        const ownedHotels = await Hotel.find({ owners: user._id, deleted: false });
        const hotelIds = ownedHotels.map(h => h._id);
        hotelFilter = { hotel: { $in: hotelIds } };
      }
    }

    // Get current month dates
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Basic counts
    const [totalHotels, totalRooms, totalClients, activeStays] = await Promise.all([
      Hotel.countDocuments({ deleted: false, ...(user.role === 'admin' ? {} : user.hotel ? { _id: user.hotel } : { owners: user._id }) }),
      Room.countDocuments({ deleted: false, ...hotelFilter }),
      Client.countDocuments({ deleted: false }),
      Stay.countDocuments({ 
        status: { $in: ['confirmed', 'in-progress'] }, 
        deleted: false,
        ...(Object.keys(hotelFilter).length > 0 ? {} : {})
      })
    ]);

    // Monthly revenue calculation
    const monthlyInvoices = await Invoice.aggregate([
      {
        $match: {
          deleted: false,
          issueDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      {
        $lookup: {
          from: 'stays',
          localField: 'stay',
          foreignField: '_id',
          as: 'stayInfo'
        }
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'stayInfo.room',
          foreignField: '_id',
          as: 'roomInfo'
        }
      },
      ...(Object.keys(hotelFilter).length > 0 ? [
        {
          $match: {
            'roomInfo.hotel': { $in: Object.values(hotelFilter).flat() }
          }
        }
      ] : []),
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyRevenue = monthlyInvoices[0]?.totalRevenue || 0;

    // Occupancy rate calculation
    const totalRoomsAvailable = await Room.countDocuments({ 
      deleted: false, 
      isInMaintenance: false,
      ...hotelFilter
    });
    
    const occupiedRooms = await Stay.countDocuments({
      status: 'in-progress',
      deleted: false,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    const occupancyRate = totalRoomsAvailable > 0 ? 
      ((occupiedRooms / totalRoomsAvailable) * 100).toFixed(1) : 0;

    // Revenue trend (last 6 months)
    const revenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthRevenue = await Invoice.aggregate([
        {
          $match: {
            deleted: false,
            issueDate: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);

      revenueTrend.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue[0]?.total || 0
      });
    }

    res.json({
      messageCode: 'MSG_0003',
      stats: {
        totalHotels,
        totalRooms,
        totalClients,
        activeStays,
        monthlyRevenue,
        occupancyRate: parseFloat(occupancyRate),
        revenueTrend
      }
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const user = req.user;
    const { limit = 10 } = req.query;

    let hotelFilter = {};
    if (user.role !== 'admin') {
      if (user.hotel) {
        hotelFilter = { hotel: user.hotel };
      } else if (user.role === 'owner') {
        const ownedHotels = await Hotel.find({ owners: user._id, deleted: false });
        const hotelIds = ownedHotels.map(h => h._id);
        hotelFilter = { hotel: { $in: hotelIds } };
      }
    }

    const activities = await Log.find({
      type: 'activity',
      action: { $in: ['CREATE_STAY', 'UPDATE_STAY', 'CREATE_INVOICE', 'CREATE_ORDER_ITEM'] }
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .populate('user', 'firstName lastName')
    .lean();

    const formattedActivities = activities.map(activity => ({
      id: activity._id,
      type: activity.action.toLowerCase().replace('_', '-'),
      message: getActivityMessage(activity),
      time: getTimeAgo(activity.createdAt),
      user: `${activity.user?.firstName} ${activity.user?.lastName}`,
      createdAt: activity.createdAt
    }));

    res.json({
      messageCode: 'MSG_0003',
      activities: formattedActivities
    });
  } catch (error) {
    console.error('Recent Activities Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

exports.getCalendarData = async (req, res) => {
  try {
    const user = req.user;
    const { startDate, endDate, hotel } = req.query;
    
    const start = new Date(startDate);
    const end = new Date(endDate);

    let roomFilter = { deleted: false };
    if (hotel) {
      roomFilter.hotel = hotel;
    } else if (user.role !== 'admin') {
      if (user.hotel) {
        roomFilter.hotel = user.hotel;
      } else if (user.role === 'owner') {
        const ownedHotels = await Hotel.find({ owners: user._id, deleted: false });
        const hotelIds = ownedHotels.map(h => h._id);
        roomFilter.hotel = { $in: hotelIds };
      }
    }

    // Get all rooms
    const rooms = await Room.find(roomFilter)
      .populate('hotel', 'name')
      .populate('category', 'name basePrice')
      .sort({ 'hotel.name': 1, roomNumber: 1 });

    // Get all stays in the date range
    const stays = await Stay.find({
      deleted: false,
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ]
    })
    .populate('client', 'firstName lastName')
    .populate('room', 'roomNumber hotel');

    // Get daily revenue for the period
    const dailyRevenue = await Invoice.aggregate([
      {
        $match: {
          deleted: false,
          issueDate: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$issueDate" }
          },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format calendar data
    const calendarData = {
      rooms: rooms.map(room => ({
        _id: room._id,
        roomNumber: room.roomNumber,
        hotel: room.hotel,
        category: room.category,
        isInMaintenance: room.isInMaintenance
      })),
      stays: stays.map(stay => ({
        _id: stay._id,
        room: stay.room._id,
        client: stay.client,
        startDate: stay.startDate,
        endDate: stay.endDate,
        status: stay.status
      })),
      dailyRevenue: dailyRevenue.reduce((acc, day) => {
        acc[day._id] = day.totalAmount;
        return acc;
      }, {})
    };

    res.json({
      messageCode: 'MSG_0003',
      calendarData
    });
  } catch (error) {
    console.error('Calendar Data Error:', error);
    res.status(500).json({ messageCode: 'MSG_0001', message: 'Server error' });
  }
};

// Helper functions
function getActivityMessage(activity) {
  switch (activity.action) {
    case 'CREATE_STAY':
      return 'New booking created';
    case 'UPDATE_STAY':
      return 'Booking updated';
    case 'CREATE_INVOICE':
      return 'Invoice generated';
    case 'CREATE_ORDER_ITEM':
      return 'Food order placed';
    default:
      return 'Activity recorded';
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}