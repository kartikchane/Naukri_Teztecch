const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Sender (Job Seeker or Employer)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Receiver (Employer or Job Seeker)
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Related job (if applicable)
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    default: null
  },

  // Related application (if applicable)
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    default: null
  },

  // Message content
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },

  // Message type
  type: {
    type: String,
    enum: ['text', 'job-posting', 'application-update', 'offer', 'rejection', 'interview-schedule'],
    default: 'text'
  },

  // Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },

  // Read timestamp
  readAt: {
    type: Date,
    default: null
  },

  // Attachments
  attachments: [{
    type: String, // URL or file reference
    name: String
  }],

  // Metadata for special message types
  metadata: {
    jobTitle: String,
    companyName: String,
    applicationStatus: String,
    interviewDate: Date,
    interviewType: String
  },

  // Created/Updated timestamps
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

// Create index for efficient queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
