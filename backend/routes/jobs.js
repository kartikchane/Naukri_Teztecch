const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');
const { protect, isEmployer, optionalAuth } = require('../middleware/auth');
const NotificationService = require('../services/notificationService');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      location,
      workMode,
      employmentType,
      minSalary,
      maxSalary,
      experience,
      search,
      page = 1,
      limit = 10,
      featured,
      company
    } = req.query;

    // Build query
    const query = { status: 'Open' };
    // If company is specified, filter by company
    if (company) {
      query.company = company;
    }

    // Exclude jobs with expired deadlines
    query.$or = [
      { applicationDeadline: { $exists: false } }, // Jobs with no deadline
      { applicationDeadline: null }, // Jobs with null deadline
      { applicationDeadline: { $gte: new Date() } } // Jobs with future deadline
    ];

    if (category) query.category = category;
    if (workMode) query.workMode = workMode;
    if (employmentType) query.employmentType = employmentType;
    if (featured) query.featured = featured === 'true';
    
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    if (minSalary || maxSalary) {
      query['salary.min'] = {};
      if (minSalary) query['salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) query['salary.max'].$lte = parseInt(maxSalary);
    }

    if (experience) {
      query['experience.min'] = { $lte: parseInt(experience) };
    }

    if (search) {
      // Combine search with deadline filter using $and
      query.$and = [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { skills: { $regex: search, $options: 'i' } }
          ]
        }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let jobs = await Job.find(query)
      .populate('company', 'name logo location')
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Check if user has applied to each job (if user is logged in)
    if (req.user) {
      const jobIds = jobs.map(job => job._id);
      const applications = await Application.find({
        job: { $in: jobIds },
        applicant: req.user._id
      }).select('job');
      
      const appliedJobIds = new Set(applications.map(app => app.job.toString()));
      
      jobs = jobs.map(job => {
        const jobObj = job.toObject();
        jobObj.hasApplied = appliedJobIds.has(job._id.toString());
        return jobObj;
      });
    }

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalJobs: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('postedBy', 'name email phone')
      .populate({
        path: 'applications',
        populate: {
          path: 'applicant',
          select: 'name email phone'
        }
      });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (Employer only)
router.post('/', [protect, isEmployer], [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('employmentType').notEmpty().withMessage('Employment type is required'),
  body('workMode').notEmpty().withMessage('Work mode is required'),
  body('location.city').notEmpty().withMessage('Location city is required'),
  body('salary.min').isNumeric().withMessage('Minimum salary must be a number'),
  body('salary.max').isNumeric().withMessage('Maximum salary must be a number'),
  body('experience.min').isNumeric().withMessage('Minimum experience must be a number'),
  body('experience.max').isNumeric().withMessage('Maximum experience must be a number'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required')
], async (req, res) => {
  try {
    console.log('POST /api/jobs - Request body:', JSON.stringify(req.body, null, 2));
    console.log('POST /api/jobs - User:', req.user._id, 'Role:', req.user.role);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array().map(err => ({ 
          field: err.path || err.param, 
          message: err.msg 
        }))
      });
    }

    // Check if user has a company
    const company = await Company.findOne({ owner: req.user._id });
    if (!company) {
      console.log('No company found for user:', req.user._id);
      return res.status(400).json({ message: 'Please create a company profile first to post jobs' });
    }

    // Remove company field from request body if it exists (we'll use the user's company)
    const { company: _, ...cleanedBody } = req.body;

    const jobData = {
      ...cleanedBody,
      company: company._id,
      postedBy: req.user._id
    };

    console.log('Creating job with data:', JSON.stringify(jobData, null, 2));

    const job = await Job.create(jobData);
    const populatedJob = await Job.findById(job._id)
      .populate('company')
      .populate('postedBy', 'name email');

    console.log('Job created successfully:', job._id);

    // Send notifications to job seekers
    try {
      const notificationCount = await NotificationService.createJobNotification(populatedJob);
      console.log(`Sent notifications to ${notificationCount} users`);
    } catch (notificationError) {
      console.error('Error sending job notifications:', notificationError);
      // Don't fail the job creation if notification fails
    }

    res.status(201).json(populatedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    console.error('Error stack:', error.stack);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({ 
      message: 'Server error occurred while creating job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (Employer only - own jobs)
router.put('/:id', [protect, isEmployer], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns the job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company').populate('postedBy', 'name email');

    res.json(updatedJob);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private (Employer only - own jobs)
router.delete('/:id', [protect, isEmployer], async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns the job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/jobs/:id/view
// @desc    Track job view
// @access  Public
router.post('/:id/view', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.views = (job.views || 0) + 1;
    await job.save();

    res.json({ message: 'View tracked', views: job.views });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/jobs/employer/my-jobs
// @desc    Get jobs posted by logged-in employer
// @access  Private (Employer only)
router.get('/employer/my-jobs', [protect, isEmployer], async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate('company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
