const mongoose = require('mongoose');

const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide partner name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide partner description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  logo: {
    type: String,
    required: [true, 'Please provide partner logo URL']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide a valid URL with HTTP or HTTPS'
    ]
  },
  partnershipLevel: {
    type: String,
    enum: ['strategic', 'gold', 'silver', 'bronze'],
    default: 'silver'
  },
  category: {
    type: String,
    enum: ['international', 'government', 'corporate', 'ngo', 'academic'],
    default: 'ngo'
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  partnershipStart: {
    type: Date,
    default: Date.now
  },
  partnershipEnd: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Partner', PartnerSchema);