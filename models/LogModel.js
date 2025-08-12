const mongoose = require('mongoose')

const LogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., "create_room", "update_client"
    type: { type: String, enum: ['security', 'activity'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    objectId: { type: mongoose.Schema.Types.ObjectId },
    objectType: { type: String }, // e.g., "Room", "Client"
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String }
  }, { timestamps: true });
  
module.exports = mongoose.model('Log', LogSchema)