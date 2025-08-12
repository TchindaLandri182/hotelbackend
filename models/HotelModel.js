const mongoose = require('mongoose')

//model can be modified to add cities
const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  logo: { type: String }, // Cloudinary URL
  owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date } // For offline sync
}, { timestamps: true });

  
module.exports = mongoose.model('Hotel', HotelSchema)