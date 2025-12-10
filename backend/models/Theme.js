const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a theme name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  primaryColor: { type: String, default: '#10B981' }, // green by default
  secondaryColor: { type: String, default: '#065F46' },
  accentColor: { type: String, default: '#059669' },
  textColor: { type: String, default: '#111827' },
  backgroundColor: { type: String, default: '#FFFFFF' },
  variables: { type: Object, default: {} }, // optional extra tokens
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ThemeSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Theme', ThemeSchema);
