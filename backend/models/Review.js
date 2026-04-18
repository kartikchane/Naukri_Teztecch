const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  categoryRatings: {
    salary: { type: Number, min: 1, max: 5, default: 3 },
    culture: { type: Number, min: 1, max: 5, default: 3 },
    growth: { type: Number, min: 1, max: 5, default: 3 },
    security: { type: Number, min: 1, max: 5, default: 3 },
    satisfaction: { type: Number, min: 1, max: 5, default: 3 },
    worklife: { type: Number, min: 1, max: 5, default: 3 },
    benefits: { type: Number, min: 1, max: 5, default: 3 }
  },
  reviewText: {
    type: String,
    minlength: 10,
    maxlength: 1000,
    required: true
  },
  pros: [String],
  cons: [String],
  helpful: {
    type: Number,
    default: 0
  },
  unhelpful: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

// Index for queries
reviewSchema.index({ company: 1, status: 1 });
reviewSchema.index({ reviewedBy: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
