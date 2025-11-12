const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['member', 'admin', 'leader'],
    default: 'member'
  },
  position: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  contributions: [{
    event: String,
    role: String,
    date: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);

