
const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { 
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    message: { 
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ['info', 'warning', 'alert', 'success'] },
    relatedEntity: { type: mongoose.Schema.Types.ObjectId },
    relatedEntityType: { type: String },
    deleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    frontendDateTime: { type: Date } // For offline sync
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema)