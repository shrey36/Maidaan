const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  sports: {
    type: [String],
    required: true
  },
  pricePerHour: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  imageUrl: {
    type: String,
    required: true
  },
  facilities: {
    type: [String],
    default: []
  },
  openingTime: {
    type: String,
    default: '06:00 AM'
  },
  closingTime: {
    type: String,
    default: '11:00 PM'
  },
  rating: {
    type: Number,
    default: 4.5
  },
  contactPhone: {
    type: String,
    default: '+91 98221 00000'
  },
  rules: {
    type: String,
    default: 'Standard sports shoes required. Arrive 10 minutes prior to slot time.'
  },
  availableToday: {
    type: Boolean,
    default: true
  },
  turfType: {
    type: String,
    enum: ['Indoor', 'Outdoor', 'Hybrid'],
    default: 'Outdoor'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Turf', turfSchema);
