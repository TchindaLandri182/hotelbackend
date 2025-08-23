const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  logo: { type: String },
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', HotelSchema);