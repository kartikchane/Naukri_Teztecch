const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Software Development',
      'Data & Analytics',
      'Design',
      'Marketing',
      'Sales',
      'Customer Support',
      'Human Resources',
      'Finance & Accounting',
      'Operations',
      'Product Management',
      'Engineering',
      'Healthcare',
      'Education',
      'Legal',
      'Banking & Finance',
      'HR & Recruitment',
      'Cloud & DevOps',
      'Other'
    ]
  },
  employmentType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
  },
  workMode: {
    type: String,
    required: true,
    enum: ['On-site', 'Remote', 'Hybrid']
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  salary: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    period: {
      type: String,
      enum: ['Yearly', 'Monthly', 'Hourly'],
      default: 'Yearly'
    }
  },
  experience: {
    min: {
      type: Number,
      required: true,
      default: 0
    },
    max: {
      type: Number,
      required: true
    }
  },
  skills: [{
    type: String,
    required: true
  }],
  requirements: [{
    type: String
  }],
  responsibilities: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  openings: {
    type: Number,
    default: 1
  },
  applicationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'On Hold'],
    default: 'Open'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);
