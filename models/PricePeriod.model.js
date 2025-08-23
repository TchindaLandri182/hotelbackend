const mongoose = require('mongoose');

const PricePeriodSchema = new mongoose.Schema({
  entityType: { type: String, enum: ['Room', 'Food'], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  newPrice: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('PricePeriod', PricePeriodSchema);