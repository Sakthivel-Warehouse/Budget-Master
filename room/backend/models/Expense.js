const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  invoiceImage: {
    type: String,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  splitWith: [
    {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: String,
      share: {
        type: Number,
        required: true
      },
      isPaid: {
        type: Boolean,
        default: false
      }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'partially_paid', 'settled'],
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

module.exports = mongoose.model('Expense', expenseSchema);
