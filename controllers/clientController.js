const Client = require('../models/Client')
const Stay = require('../models/Stay.model');const Stay = require('../models/Reservation')
const Room = require('../models/Room')
const mongoose = require('mongoose')

exports.createClient = async (req, res) => {
  try {
    const {
      firstName, lastName, dateOfBirth, placeOfBirth, nationality,
      country, cityOfResidence, profession, adresse, tel, nIDC,
      dateOfDelivrance, placeOfDelivrance
    } = req.body

    const requiredFields = [firstName, lastName, dateOfBirth, placeOfBirth, nationality,
      country, cityOfResidence, profession, adresse, tel, nIDC,
      dateOfDelivrance, placeOfDelivrance]

    if (requiredFields.some(f => !f)) {
      return res.status(400).json({messageCode: 'MSG_0083', message: 'All required fields must be filled' })
    }

    const client = await Client.create({
      ...req.body,
      createdBy: req.user._id
    })

    res.status(201).json(client)
  } catch (err) {
    console.error(err)
    res.status(500).json({messageCode: 'MSG_0003', message: err.message })
  }
}

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!client) return res.status(404).json({messageCode: 'MSG_0084', message: 'Client not found' })
    res.json(client)
  } catch (err) {
    console.error(err)
    res.status(500).json({messageCode: 'MSG_0003', message: err.message })
  }
}

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, { deleted: true }, { new: true })
    if (!client) return res.status(404).json({messageCode: 'MSG_0084', message: 'Client not found' })
    res.json({messageCode: 'MSG_0085', message: 'Client deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({messageCode: 'MSG_0003', message: err.message })
  }
}

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
    if (!client || client.deleted) return res.status(404).json({messageCode: 'MSG_0084', message: 'Client not found' })
    res.json(client)
  } catch (err) {
    console.error(err)
    res.status(500).json({messageCode: 'MSG_0003', message: err.message })
  }
}

exports.getAllClients = async (req, res) => {
  try {
    const { hotel } = req.query

    if (!hotel) return res.status(400).json({messageCode: 'MSG_0086', message: 'Hotel ID is required' })

    const stays = await Stay.find({ deleted: false }).populate('room')
    const reservations = await Stay.find({ deleted: false }).populate('roomId')

    const clientIds = new Set()

    stays.forEach(s => {
      if (s.room.hotel.toString() === hotel) clientIds.add(s.client.toString())
    })

    reservations.forEach(r => {
      if (r.roomId.hotel.toString() === hotel) clientIds.add(r.clientId.toString())
    })

    const clients = await Client.find({
      _id: { $in: Array.from(clientIds) },
      deleted: false
    })

    res.json(clients)
  } catch (err) {
    console.error(err)
    res.status(500).json({messageCode: 'MSG_0003', message: err.message })
  }
}

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
    } = req.query

    const skip = (page - 1) * limit
    const start = new Date(startDate)
    const end = new Date(endDate)

    const match = { deleted: false }

    if (search) {
      match.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { tel: { $regex: search, $options: 'i' } },
      ]
    }

    const clients = await Client.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'Stays',
          localField: '_id',
          foreignField: 'client',
          as: 'stays'
        }
      },
      {
        $lookup: {
          from: 'Reservations',
          localField: '_id',
          foreignField: 'clientId',
          as: 'reservations'
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
                  { $gte: [new Date(), '$$stay.checkInDate'] },
                  { $lte: [new Date(), '$$stay.checkOutDate'] },
                ]
              }
            }
          },
          actualReservation: {
            $filter: {
              input: '$reservations',
              as: 'res',
              cond: {
                $and: [
                  { $eq: ['$$res.deleted', false] },
                  { $eq: ['$$res.status', 'confirmed'] },
                  { $gte: ['$$res.startDate', new Date()] }
                ]
              }
            }
          },
          totalSpent: {
            $add: [
              {
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
                        100, // Replace with actual revenue logic
                        0
                      ]
                    }
                  }
                }
              },
              {
                $sum: {
                  $map: {
                    input: '$reservations',
                    as: 'res',
                    in: {
                      $cond: [
                        {
                          $and: [
                            { $gte: ['$$res.createdAt', start] },
                            { $lte: ['$$res.createdAt', end] }
                          ]
                        },
                        50, // Replace with actual reservation value
                        0
                      ]
                    }
                  }
                }
              }
            ]
          }
        }
      },
      ...(status === 'reserved'
        ? [{ $match: { 'actualReservation.0': { $exists: true } } }]
        : status === 'stay'
        ? [{ $match: { 'actualStay.0': { $exists: true } } }]
        : []),
      {
        $sort: { [sort]: order === 'desc' ? -1 : 1 }
      },
      { $skip: Number(skip) },
      { $limit: Number(limit) }
    ])

    const total = await Client.countDocuments(match)

    res.json({messageCode: 'MSG_0003', total,
      page: Number(page),
      limit: Number(limit),
      data: clients
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({messageCode: 'MSG_0003', message: err.message })
  }
}
