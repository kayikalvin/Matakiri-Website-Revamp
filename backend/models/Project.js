const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  category: {
    type: String,
    enum: ['agriculture', 'education', 'health', 'water', 'ai', 'innovation', 'community'],
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'paused'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  location: {
    type: String,
    required: true
  },
  impactMetrics: {
    beneficiaries: Number,
    communitiesReached: Number,
    successRate: Number
  },
  images: [{
    url: String,
    caption: String,
    isFeatured: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    caption: String,
    platform: String
  }],
  team: [{
    name: String,
    role: String,
    avatar: String
  }],
  partners: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner'
  }],
  aiComponents: [{
    name: String,
    description: String,
    technology: String
  }],
  budget: {
    estimated: Number,
    spent: Number,
    currency: {
      type: String,
      default: 'KES'
    }
  },
  reports: [{
    title: String,
    fileUrl: String,
    date: Date,
    type: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isAIPowered: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration
projectSchema.virtual('duration').get(function() {
  if (!this.endDate) return 'Ongoing';
  const months = (this.endDate.getMonth() - this.startDate.getMonth()) + 
    (12 * (this.endDate.getFullYear() - this.startDate.getFullYear()));
  return `${months} months`;
});

// Indexes for better query performance
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ isFeatured: 1 });
projectSchema.index({ isAIPowered: 1 });
projectSchema.index({ createdAt: -1 });

// Pre-save middleware to generate slug
// Ensure slug exists before validation so `required` validators pass
projectSchema.pre('validate', function(next) {
  // If there's no title yet, proceed and let validation handle it
  if (!this.title) return next();

  // Generate slug when creating a new doc or when title changed, or if slug missing
  if (this.isNew || this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toString()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim();
  }

  next();
});

module.exports = mongoose.model('Project', projectSchema);