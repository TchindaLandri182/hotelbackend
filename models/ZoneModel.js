const mongoose = require('mongoose')

const ZoneSchema = new mongoose.Schema({
    name: { 
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Zone', ZoneSchema)