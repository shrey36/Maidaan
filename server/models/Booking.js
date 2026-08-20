const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  },
  date: {
    type: String, // format YYYY-MM-DD
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 1
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['CONFIRMED', 'CANCELLED', 'COMPLETED'],
    default: 'CONFIRMED'
  },
  paymentMethod: {
    type: String,
    default: 'PAY_AT_VENUE'
  },
  paymentStatus: {
    type: String,
    default: 'PAY_AT_VENUE'
  },
  bookingId: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
