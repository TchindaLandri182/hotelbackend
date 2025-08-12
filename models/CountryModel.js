const mongoose = require('mongoose');

const CountrySchema = new mongoose.Schema({
    name: { 
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    code: { type: String, required: true, unique: true },
    deleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Country', CountrySchema)