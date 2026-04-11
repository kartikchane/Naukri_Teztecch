const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide company description']
  },
  website: {
    type: String
  },
  logo: {
    type: String,
    default: 'default-company-logo.png'
  },
  industry: {
    type: String,
    required: true
  },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  founded: {
    type: Number
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String,
    instagram: String,
    youtube: String
  },
  coverImage: {
    type: String,
    default: null
  },
  companyPhotos: [
    {
      type: String
    }
  ],
  specialties: [
    {
      type: String
    }
  ],
  headquarters: {
    address: String,
    city: String,
    state: String,
    country: String
  },
  benefits: [
    {
      type: String
    }
  ],
  cultureTags: [
    {
      type: String
    }
  ],
  followers: {
    type: Number,
    default: 0
  },
  followersList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  totalReviews: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Company', companySchema);
