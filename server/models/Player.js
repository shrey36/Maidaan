const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'Forward'
  },
  location: {
    type: String,
    default: 'Mapusa, Goa'
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Pro'],
    default: 'Intermediate'
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  goals: {
    type: Number,
    default: 0
  },
  team: {
    type: String,
    default: 'Free Agent'
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
  },
  availability: {
    type: String,
    default: 'Available Evenings'
  },
  basePrice: {
    type: Number,
    default: 2000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);
