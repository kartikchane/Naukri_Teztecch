const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, isEmployer } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seeker only)
router.post('/', protect, upload.single('resume'), async (req, res) => {
  try {
    const fs = require('fs');
    const { jobId, coverLetter } = req.body;

    // Debug logs to help diagnose upload/apply failures
    try {
      console.log('Apply request received:');
      console.log(' - Authorization header present:', !!req.headers.authorization);
      console.log(' - Body:', req.body);
      console.log(' - File:', req.file ? { originalname: req.file.originalname, size: req.file.size } : null);
    } catch (logErr) {
      console.warn('Failed to log apply request details:', logErr.message);
    }

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Get resume path (prefer uploaded file; fall back to user's profile if file exists)
    let resumePath = null;
    if (req.file) {
      resumePath = req.file.path;
    } else if (req.user && req.user.resume) {
      try {
        if (fs.existsSync(req.user.resume)) {
          resumePath = req.user.resume;
        } else {
          console.warn('Profile resume file missing:', req.user.resume);
          resumePath = null;
        }
      } catch (err) {
        console.warn('Error checking resume file:', err.message);
        resumePath = null;
      }
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resumePath,
      coverLetter
    });

    // Add application to job
    job.applications.push(application._id);
    await job.save();

    const populatedApplication = await Application.findById(application._id)
      .populate('job')
      .populate('applicant', 'name email phone');

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error('Application submission error:', error);
    const msg = process.env.NODE_ENV === 'development' ? (error.message || 'Server error') : 'Server error';
    res.status(500).json({ message: msg });
  }
});

// @route   GET /api/applications/my
// @desc    Get applications by logged-in user
// @access  Private (Job Seeker only)
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/user (Legacy route - kept for compatibility)
// @desc    Get applications by logged-in user
// @access  Private (Job Seeker only)
router.get('/user', protect, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name logo'
        }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job
// @access  Private (Employer only - job owner)
router.get('/job/:jobId', [protect, isEmployer], async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user owns the job
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone skills experience education')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer only)
router.put('/:id/status', [protect, isEmployer], async (req, res) => {
  try {
    const { status, notes } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user owns the job
    if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    if (notes) application.notes = notes;
    application.updatedAt = Date.now();

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate('job')
      .populate('applicant', 'name email');

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/applications/:id
// @desc    Delete/withdraw application
// @access  Private (Applicant only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user owns the application
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await application.deleteOne();
    res.json({ message: 'Application withdrawn' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
