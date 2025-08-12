const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRoom', required: true },
  roomNumber: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  isInMaintenance: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Room', RoomSchema);