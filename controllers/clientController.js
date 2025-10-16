const Client = require('../models/Client.model');
const Stay = require('../models/Stay.model');
const Room = require('../models/Room.model');
const mongoose = require('mongoose');
const { createLog, logAction } = require('../services/logService');

exports.createClient = [
  async (req, res) => {
    try {
      const {
        firstName, lastName, dateOfBirth, placeOfBirth, nationality,
        country, cityOfResidence, profession, adresse, tel, nIDC, hotel,
        dateOfDelivrance, placeOfDelivrance
      } = req.body;

      const requiredFields = [firstName, lastName, dateOfBirth, placeOfBirth, nationality,
        country, cityOfResidence, profession, adresse, tel, nIDC, hotel,
        dateOfDelivrance, placeOfDelivrance];

      if (requiredFields.some(f => !f)) {
        return res.status(400).json({messageCode: 'MSG_0083', message: 'All required fields must be filled' });
      }
      console.log(hotel)
      const client = await Client.create({
        ...req.body,
        createdBy: req.user._id
      });

      res.locals.newId = client._id;
      res.status(201).json({messageCode: 'MSG_0003', client});
    } catch (err) {
      console.error(err);
      res.status(500).json({messageCode: 'MSG_0001', message: err.message });
    }
  },
  logAction('CREATE_CLIENT', 'Client')
];

exports.updateClient = [
  async (req, res) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!client) return res.status(404).json({messageCode: 'MSG_0084', message: 'Client not found' });
      res.json({messageCode: 'MSG_0003', client});
    } catch (err) {
      console.error(err);
      res.status(500).json({messageCode: 'MSG_0001', message: err.message });
    }
  },
  logAction('UPDATE_CLIENT', 'Client')
];

exports.deleteClient = [
  async (req, res) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true });
      if (!client) return res.status(404).json({messageCode: 'MSG_0084', message: 'Client not found' });
      res.json({messageCode: 'MSG_0085', message: 'Client deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({messageCode: 'MSG_0001', message: err.message });
    }
  },
  logAction('DELETE_CLIENT', 'Client')
];

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client || client.deleted) return res.status(404).json({messageCode: 'MSG_0084', message: 'Client not found' });
    res.json({messageCode: 'MSG_0003', client});
  } catch (err) {
    console.error(err);
    res.status(500).json({messageCode: 'MSG_0001', message: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  try{

    const { hotel } = req.query;

    if (!hotel) return res.status(400).json({messageCode: 'MSG_0086', message: 'Hotel ID is required' });

    const clients = await Client.find({hotel: req.user?.hotel || hotel, deleted: false})

    res.json({messageCode: 'MSG_0003', clients});

  }catch(err){
    console.error(err);
    res.status(500).json({messageCode: 'MSG_0001', message: err.message });
  }
}

exports.getClientsByHotel = async (req, res) => {
  try {
    const { hotel } = req.query;

    if (!hotel) return res.status(400).json({messageCode: 'MSG_0086', message: 'Hotel ID is required' });

    const stays = await Stay.find({ deleted: false }).populate('room');
    const clientIds = new Set();

    stays.forEach(s => {
      if (s.room && s.room.hotel && s.room.hotel.toString() === hotel) {
        clientIds.add(s.client.toString());
      }
    });

    const clients = await Client.find({
      _id: { $in: Array.from(clientIds) },
      deleted: false
    });
    // console.log(clients, stays, clientIds)

    res.json({messageCode: 'MSG_0003', clients});
  } catch (err) {
    console.error(err);
    res.status(500).json({messageCode: 'MSG_0001', message: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      hotel,
      startDate = new Date(),
      endDate = new Date(),
      search = '',
      sort = 'firstName',
      order = 'asc',
      status
    } = req.query;

    const skip = (page - 1) * limit;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const match = { deleted: false };
    if(req.user?.hotel || hotel) match.hotel = req.user?.hotel || hotel
    if (search) {
      match.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { tel: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await Client.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'stays',
          localField: '_id',
          foreignField: 'client',
          as: 'stays'
        }
      },
      {
        $addFields: {
          actualStay: {
            $filter: {
              input: '$stays',
              as: 'stay',
              cond: {
                $and: [
                  { $eq: ['$$stay.deleted', false] },
                  { $gte: [new Date(), '$$stay.startDate'] },
                  { $lte: [new Date(), '$$stay.endDate'] },
                ]
              }
            }
          },
          totalSpent: {
            $sum: {
              $map: {
                input: '$stays',
                as: 'stay',
                in: {
                  $cond: [
                    {
                      $and: [
                        { $gte: ['$$stay.createdAt', start] },
                        { $lte: ['$$stay.createdAt', end] }
                      ]
                    },
                    100,
                    0
                  ]
                }
              }
            }
          }
        }
      },
      ...(status === 'stay'
        ? [{ $match: { 'actualStay.0': { $exists: true } } }]
        : []),
      {
        $sort: { [sort]: order === 'desc' ? -1 : 1 }
      },
      { $skip: Number(skip) },
      { $limit: Number(limit) }
    ]);

    const total = await Client.countDocuments(match);

    res.json({
      messageCode: 'MSG_0003',
      total,
      page: Number(page),
      limit: Number(limit),
      data: clients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({messageCode: 'MSG_0001', message: err.message });
  }
};