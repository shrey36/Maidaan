const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER'
  },
  location: {
    type: String,
    default: 'Mapusa, Goa'
  },
  preferredSport: {
    type: String,
    default: 'Football'
  },
  profileImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
  },
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpire: {
    type: Date,
    default: undefined
  }
}, {
  timestamps: true
});

// Hash password only when it is new or modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
