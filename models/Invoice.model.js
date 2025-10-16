const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvoiceSchema = new Schema({
  stay: { type: Schema.Types.ObjectId, ref: 'Stay', required: true },
  totalAmount: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'partially_paid'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'mobile_money', 'bank_transfer'] },
  payments: [{
    amountPaid: { type: Number, required: true },
    datePaid: { type: Date, required: true },
    method: { type: String, enum: ['cash', 'card', 'mobile_money', 'bank_transfer'] },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }],
  deleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  frontendDateTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
