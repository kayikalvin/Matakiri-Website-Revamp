const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  url: {
    type: String,
    required: [true, 'Media URL is required']
  },
  thumbnail: {
    type: String // For videos, this would be a poster image
  },
  album: {
    type: String,
    default: 'General'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    width: Number, // For images
    height: Number, // For images
    size: Number, // File size in bytes
    format: String, // jpg, png, mp4, etc.
    duration: Number // For videos in seconds
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  location: {
    type: String
  },
  captureDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted upload date
gallerySchema.virtual('formattedUploadedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Indexes for better query performance
gallerySchema.index({ type: 1, album: 1 });
gallerySchema.index({ isFeatured: 1 });
gallerySchema.index({ uploadedBy: 1 });
gallerySchema.index({ tags: 1 });
gallerySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
