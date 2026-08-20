const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  sport: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxSquadSize: {
    type: Number,
    default: 11
  },
  budgetTotal: {
    type: Number,
    default: 10000
  },
  budgetSpent: {
    type: Number,
    default: 0
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
