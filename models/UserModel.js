const mongoose = require('mongoose')
require('mongoose-type-email');
const { Schema } = mongoose;
const roleList = require('../constants/roleLIst.constants')

const PointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
});

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { 
    type: mongoose.SchemaTypes.Email, 
    required: true, 
    unique: true 
  },
  password: { type: String },
  role: { 
    type: String, 
    enum: Object.values(roleList),
    required: true 
  },
  permissions: [{ type: Number }],
  location: {
    type: PointSchema,
    index: '2dsphere'
  },
  emailCode: { type: String },
  emailExpireIn: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  isSignUpComplete: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  blockedMotif: { type: String },
  profileImage: {
    public_id: String,
    url: String
  },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  hotel: { type: Schema.Types.ObjectId, ref: 'Hotel' },
  deleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema)