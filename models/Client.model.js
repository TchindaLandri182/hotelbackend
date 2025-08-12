const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  placeOfBirth: { type: String, required: true },
  nationality: { type: String, required: true },
  country: { type: String, required: true },
  cityOfResidence: { type: String, required: true },
  profession: { type: String, required: true },
  adresse: { type: String, required: true },
  tel: { type: String },
  nIDC: { type: String, required: true, unique: true },
  dateOfDelivrance: { type: Date, required: true },
  placeOfDelivrance: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Client', ClientSchema);