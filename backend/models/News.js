const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'News title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: [true, 'News content is required']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: ['announcements', 'projects', 'partnerships', 'events', 'research', 'community'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    caption: String,
    isFeatured: {
      type: Boolean,
      default: false
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  relatedProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  relatedNews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reading time
newsSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const words = this.content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
});

// Indexes for better query performance
newsSchema.index({ title: 'text', content: 'text' });
newsSchema.index({ category: 1, published: 1 });
newsSchema.index({ isFeatured: 1, published: 1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ author: 1 });

// Pre-save middleware to generate slug
newsSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();

  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  next();
});

// Pre-save middleware to set publishedAt
newsSchema.pre('save', function(next) {
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('News', newsSchema);
