const mongoose = require('mongoose');
const { Schema } = mongoose;

const CitySchema = new mongoose.Schema({
    name: { 
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    region: { type: Schema.Types.ObjectId, ref: 'Region', required: true },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('City', CitySchema);