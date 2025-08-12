const mongoose = require('mongoose')

const FoodItemSchema = new Schema({
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  name: { 
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  description: { 
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  price: { type: Number, required: true },
  category: { type: String, enum: ['food', 'beverage'], required: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', FoodItemSchema)