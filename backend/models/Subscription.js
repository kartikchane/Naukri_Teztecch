const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  // User subscribing
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Plan subscribed to
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },

  // Subscription type
  type: {
    type: String,
    enum: ['job-posting', 'job-viewing', 'company-subscription'],
    required: true
  },

  // Subscription status
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended', 'expired', 'cancelled'],
    default: 'active'
  },

  // Amount charged
  amount: {
    type: Number,
    required: true
  },

  // Currency
  currency: {
    type: String,
    default: 'INR'
  },

  // Payment details
  payment: {
    transactionId: String,
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'credit-card', 'debit-card', 'upi', 'net-banking', 'wallet', 'manual'],
      default: 'razorpay'
    },
    paymentDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },

  // Subscription period
  startDate: {
    type: Date,
    default: Date.now
  },

  endDate: {
    type: Date,
    required: true
  },

  // Auto-renewal
  autoRenew: {
    type: Boolean,
    default: true
  },

  // Tracking usage (for job posting plans)
  jobsPosted: {
    type: Number,
    default: 0
  },

  // Features limit tracking
  usageTracking: {
    applicantsViewed: { type: Number, default: 0 },
    jobsCreated: { type: Number, default: 0 },
    profilesDownloaded: { type: Number, default: 0 }
  },

  // Renewal history
  renewalHistory: [{
    renewalDate: Date,
    amount: Number,
    status: String
  }],

  // Cancellation details
  cancellation: {
    cancelledAt: Date,
    cancelledBy: mongoose.Schema.Types.ObjectId,
    reason: String,
    refundAmount: Number,
    refundProcessed: Boolean
  },

  // Notes
  notes: String,

  // Created/Updated timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
subscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
