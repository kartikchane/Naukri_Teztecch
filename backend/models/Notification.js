const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'job_posted',
      'application_status',
      'message',
      'system',
      'deadline_reminder',
      'plan_expiring_soon',
      'plan_expired',
      'plan_renewed',
      'subscription_success',
      'subscription_failed',
      'job_application_received',
      'application_accepted',
      'interview_scheduled',
      'offer_received',
      'profile_viewed'
    ],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  data: {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan'
    }
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  // Contact preferences for this notification
  contactMethods: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  // Delivery tracking
  delivery: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      opened: { type: Boolean, default: false },
      failureReason: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      failureReason: String
    }
  },
  actionUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });

// Update updatedAt before saving
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);