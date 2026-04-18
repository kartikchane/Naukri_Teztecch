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
  // Company Registration Documents
  documents: {
    aadharCard: {
      type: String,
      required: [true, 'Aadhar card is required']
    },
    panCard: {
      type: String,
      required: [true, 'PAN card is required']
    },
    gstCertificate: {
      type: String,
      required: [true, 'GST certificate is required']
    },
    udyamAadhar: {
      type: String,
      required: [true, 'Udyam Aadhar registration is required']
    }
  },
  // Company Contact Information
  contactInfo: {
    registeredEmail: {
      type: String,
      required: [true, 'Registered email is required'],
      lowercase: true
    },
    registeredPhone: {
      type: String,
      required: [true, 'Registered phone number is required']
    }
  },
  // Document verification status
  documentVerification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String,
    adminNotes: String
  },

  // Individual document verification
  documentDetails: {
    businessRegistration: {
      fileUrl: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false },
      adminNotes: String
    },
    gstCertificate: {
      fileUrl: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false },
      adminNotes: String
    },
    panCard: {
      fileUrl: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false },
      adminNotes: String
    },
    addressProof: {
      fileUrl: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false },
      adminNotes: String
    },
    bankDetails: {
      fileUrl: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false },
      adminNotes: String
    },
    directorId: {
      fileUrl: String,
      uploadedAt: Date,
      verified: { type: Boolean, default: false },
      adminNotes: String
    }
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

// Pre-save middleware
companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Company', companySchema);
