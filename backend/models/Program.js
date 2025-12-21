const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a program title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['agriculture', 'education', 'health', 'water', 'ai', 'community'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'planning', 'paused', 'completed'],
    default: 'planning',
  },
  beneficiaries: {
    type: Number,
    default: 0,
  },
  duration: {
    type: String,
    default: '',
  },
  impact: {
    type: String,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Program', ProgramSchema);
