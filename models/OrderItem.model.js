const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  stay: { type: mongoose.Schema.Types.ObjectId, ref: 'Stay', required: true },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  orderDate: { type: Date, default: Date.now },
  servedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'served', 'cancelled'], 
    default: 'pending' 
  },
  deleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('OrderItem', OrderItemSchema);