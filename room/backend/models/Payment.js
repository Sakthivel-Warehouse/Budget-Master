const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    required: true
  },
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'bank_transfer', 'cash'],
    default: 'upi'
  },
  paymentProof: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
