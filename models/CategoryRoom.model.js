const mongoose = require('mongoose');

const CategoryRoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { 
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  description: { 
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  basePrice: { type: Number, min: 0, default: 0 },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('CategoryRoom', CategoryRoomSchema);