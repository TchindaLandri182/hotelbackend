const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    type: { type: String, enum: ['security', 'activity'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    objectId: { type: mongoose.Schema.Types.ObjectId },
    objectType: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Log', LogSchema);