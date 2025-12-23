const express = require('express');
const router = express.Router();
const { isAdmin, protect } = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// All admin routes require authentication
router.use(protect);

// GET /api/admin/stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const jobs = await Job.countDocuments();
    const users = await User.countDocuments();
    const applications = await Application.countDocuments();
    res.json({ jobs, users, applications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

// GET /api/admin/jobs
router.get('/jobs', isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('company', 'name')
      .lean();
    // Add applications count for each job
    for (let job of jobs) {
      job.applicationsCount = await Application.countDocuments({ job: job._id });
    }
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
});

// DELETE /api/admin/jobs/:id
router.delete('/jobs/:id', isAdmin, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
});

// POST /api/admin/jobs
router.post('/jobs', isAdmin, async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: 'Error creating job', error: err.message });
  }
});

// GET /api/admin/applications
router.get('/applications', isAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const applications = await Application.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('applicant', 'name email')
      .populate('job', 'title')
      .lean();

    // Map to include applicant name/email, job title, and appliedAt
    const formattedApplications = applications.map(app => ({
      user: app.applicant ? app.applicant.name : 'Unknown',
      userEmail: app.applicant ? app.applicant.email : 'Unknown',
      job: app.job ? app.job.title : 'Unknown',
      appliedOn: app.appliedAt ? app.appliedAt : null,
      status: app.status || 'Applied',
    }));
    res.json({ applications: formattedApplications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
});

// GET /api/admin/users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('name email role createdAt')
      .lean();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// POST /api/admin/users
router.post('/users', isAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router;
