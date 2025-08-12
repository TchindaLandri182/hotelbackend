const mongoose = require('mongoose')
const { Schema } = mongoose;

const StaySchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  actualCheckIn: { type: Date },
  actualCheckOut: { type: Date },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'reserved'], 
    default: 'pending' 
  },
  // Moved fields from Client
  tel: { type: String },
  zoneOfResidence: { type: String },
  zoneOfDestination: { type: String },
  notes: { type: String },
  deleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Stay', StaySchema)
