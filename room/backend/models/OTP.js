const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  isAdminSignup: {
    type: Boolean,
    default: false
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP expires in 10 minutes
  }
});

module.exports = mongoose.model('OTP', otpSchema);
