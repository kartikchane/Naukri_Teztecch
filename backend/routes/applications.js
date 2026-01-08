const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { protect, isEmployer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const NotificationService = require('../services/notificationService');
const fs = require('fs');
const path = require('path');

// Helper function to normalize resume path and check if file exists
const normalizeResumePath = (resumePath) => {
  if (!resumePath) return null;
  
  // If it's already a URL, return as-is
  if (resumePath.startsWith('http')) return resumePath;
  
  // Remove absolute path prefix if exists
  let normalizedPath = resumePath.replace(/^[A-Z]:\\.*?\\uploads\\/i, 'uploads/');
  normalizedPath = normalizedPath.replace(/\\/g, '/');
  
  // Check if file exists
  const fullPath = path.join(__dirname, '../..', normalizedPath);
  console.log(`[DEBUG] Original: ${resumePath}`);
  console.log(`[DEBUG] Normalized: ${normalizedPath}`);
  console.log(`[DEBUG] Full path: ${fullPath}`);
  console.log(`[DEBUG] File exists: ${fs.existsSync(fullPath)}`);
  
  if (fs.existsSync(fullPath)) {
    return normalizedPath;
  }
  
  // File doesn't exist, return null
  console.log(`[DEBUG] File not found, returning null`);
  return null;
};

// @route   POST /api/applications
// @desc    Apply for a job
// @access  Private (Job Seeker only)
router.post('/', protect, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

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


    // Get resume path (optional) - convert to relative path for serving
    let resumePath = null;
    if (req.file) {
      // Convert absolute path to relative: uploads/resume-xxx.pdf
      resumePath = req.file.path.replace(/\\/g, '/').split('/uploads/')[1];
      resumePath = `uploads/${resumePath}`;
    } else if (req.user.resume) {
      resumePath = req.user.resume;
    }

    // Create application (resume is optional)
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

    // Normalize resume paths and check file existence
    const applicationsWithValidResumes = applications.map(app => {
      const appObj = app.toObject();
      appObj.resume = normalizeResumePath(app.resume);
      return appObj;
    });

    res.json({ applications: applicationsWithValidResumes });
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

    // Normalize resume paths and check file existence
    const applicationsWithValidResumes = applications.map(app => {
      const appObj = app.toObject();
      appObj.resume = normalizeResumePath(app.resume);
      return appObj;
    });

    res.json(applicationsWithValidResumes);
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

    // Create notification for applicant about status update
    try {
      await NotificationService.createApplicationStatusNotification(application, status);
    } catch (notificationError) {
      console.error('Error creating application status notification:', notificationError);
      // Do not fail the status update if notification fails
    }

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
