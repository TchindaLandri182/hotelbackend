const mongoose = require('mongoose');
const { Schema } = mongoose;

const RegionSchema = new mongoose.Schema({
    name: { 
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Region', RegionSchema);