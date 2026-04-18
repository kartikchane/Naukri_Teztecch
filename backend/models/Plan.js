const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  // Plan name
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    enum: ['free', 'standard', 'classified', 'hot-vacancy', 'company-subscription', 'student-job-viewing']
  },

  // Display name
  displayName: {
    type: String,
    required: true
  },

  // Plan description
  description: String,

  // Pricing
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },

  // Billing cycle (monthly, one-time, etc.)
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'one-time'],
    default: 'monthly'
  },

  // Plan type
  planType: {
    type: String,
    enum: ['job-posting', 'job-viewing', 'company-subscription'],
    required: true
  },

  // Job Posting Plan Features
  features: {
    // Number of jobs per posting
    jobsPerPosting: {
      type: Number,
      default: 1
    },
    // Total job postings allowed per billing cycle
    totalJobPostings: {
      type: Number,
      default: null // null = unlimited
    },
    // Number of job locations
    jobLocations: {
      type: Number,
      default: 1
    },
    // Job validity in days
    jobValidityDays: {
      type: Number,
      default: 30
    },
    // Job description character limit
    descriptionCharLimit: {
      type: Number,
      default: 250
    },
    // Can view applicants
    viewApplicants: {
      type: Boolean,
      default: true
    },
    // Boost on search page
    boostOnSearch: {
      type: Boolean,
      default: false
    },
    // Job branding
    jobBranding: {
      type: Boolean,
      default: false
    },
    // Contact details visible to jobseekers
    contactDetailsVisible: {
      type: Boolean,
      default: true
    },
    // Featured job posting
    featuredPosting: {
      type: Boolean,
      default: false
    },
    // Discount on multiple postings (%)
    discountPercentage: {
      type: Number,
      default: 0
    },
    // Can access resume database
    resumeDatabase: {
      type: Boolean,
      default: false
    }
  },

  // Subscription Features
  subscriptionFeatures: {
    // For company subscription
    companyVerificationFee: {
      type: Number,
      default: 1000 // Monthly subscription for company
    },
    // For student job viewing
    studentViewingFee: {
      type: Number,
      default: 200 // Monthly fee for students
    },
    // Duration in months
    durationMonths: {
      type: Number,
      default: 1
    }
  },

  // Display order
  displayOrder: {
    type: Number,
    default: 0
  },

  // Is active
  isActive: {
    type: Boolean,
    default: true
  },

  // Created at
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Plan', planSchema);
