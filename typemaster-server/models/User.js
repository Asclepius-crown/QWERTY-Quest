const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: false,
    minlength: 6
  },
  provider: {
    type: String,
    enum: ['google', 'github', 'discord']
  },
  providerId: {
    type: String
  },
  displayName: {
    type: String
  },
  authenticators: [{
    credentialId: { type: String, required: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 0 },
    transports: [String]
  }],
  challenge: String,
  mfaSecret: String,
  isMfaEnabled: { type: Boolean, default: false },
  avatar: {
    type: String,
    default: 'avatar1'
  },
  stats: {
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    rank: { type: String, default: 'Bronze' },
    racesWon: { type: Number, default: 0 },
    bestWPM: { type: Number, default: 0 },
    avgWPM: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
