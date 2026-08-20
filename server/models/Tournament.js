const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  prizePool: {
    type: Number,
    required: true
  },
  entryFee: {
    type: Number,
    required: true
  },
  maxTeams: {
    type: Number,
    default: 16
  },
  organizer: {
    type: String,
    default: 'Maidaan Org'
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'COMING_SOON'],
    default: 'UPCOMING'
  },
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80'
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tournament', tournamentSchema);
