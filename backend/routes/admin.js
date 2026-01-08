const express = require('express');
const router = express.Router();
const { isAdmin, protect } = require('../middleware/auth');
const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const Company = require('../models/Company');

// All admin routes require authentication
router.use(protect);

// GET /api/admin/stats
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const jobs = await Job.countDocuments();
    const users = await User.countDocuments();
    const applications = await Application.countDocuments();
    const companies = await Company.countDocuments();
    const rejections = await Application.countDocuments({ status: 'Rejected' });
    
    console.log('📊 Admin Stats:', { jobs, users, applications, companies, rejections });
    
    res.json({ jobs, users, applications, companies, rejections });
  } catch (err) {
    console.error('❌ Stats Error:', err);
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
      .populate('applicant', 'name email phone')
      .populate({
        path: 'job',
        select: 'title location employmentType salary experience workMode',
        populate: {
          path: 'company',
          select: 'name industry location website companySize founded logo description'
        }
      })
      .lean();

    // Map to include all details
    const formattedApplications = applications.map(app => {
      const job = app.job || {};
      const company = job.company || {};
      
      return {
        _id: app._id,
        user: app.applicant ? app.applicant.name : 'Unknown',
        userEmail: app.applicant ? app.applicant.email : 'Unknown',
        userPhone: app.applicant ? app.applicant.phone : 'N/A',
        job: job.title || 'Unknown',
        jobLocation: job.location ? 
          `${job.location.city || ''}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}` 
          : 'N/A',
        jobType: job.employmentType || 'N/A',
        jobSalary: job.salary?.min && job.salary?.max ? 
          `₹${job.salary.min.toLocaleString('en-IN')} - ₹${job.salary.max.toLocaleString('en-IN')}${job.salary.period ? ' / ' + job.salary.period : ''}` 
          : 'N/A',
        jobExperience: job.experience?.min !== undefined && job.experience?.max !== undefined ? 
          `${job.experience.min} - ${job.experience.max} years` 
          : 'N/A',
        company: company.name || 'Unknown',
        companyIndustry: company.industry || 'N/A',
        companyLocation: company.location ? 
          `${company.location.city || ''}${company.location.state ? ', ' + company.location.state : ''}${company.location.country ? ', ' + company.location.country : ''}` 
          : 'N/A',
        companyWebsite: company.website || null,
        companySize: company.companySize || 'N/A',
        companyFounded: company.founded || 'N/A',
        companyLogo: company.logo || null,
        companyDescription: company.description || null,
        appliedOn: app.appliedAt ? app.appliedAt : app.createdAt,
        status: app.status || 'Applied',
        coverLetter: app.coverLetter || null,
        resume: app.resume || null
      };
    });
    
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

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

// PUT /api/admin/jobs/:id - Update job
router.put('/jobs/:id', isAdmin, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job updated successfully', job });
  } catch (err) {
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
});

// PUT /api/admin/jobs/:id/feature - Toggle featured status
router.put('/jobs/:id/feature', isAdmin, async (req, res) => {
  try {
    console.log('Toggling featured status for job ID:', req.params.id);
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log('Job not found:', req.params.id);
      return res.status(404).json({ message: 'Job not found' });
    }
    console.log('Current featured status:', job.featured);
    job.featured = !job.featured;
    await job.save();
    console.log('New featured status:', job.featured);
    res.json({ message: `Job ${job.featured ? 'featured' : 'unfeatured'} successfully`, job });
  } catch (err) {
    console.error('Error toggling featured status:', err);
    res.status(500).json({ message: 'Error updating job', error: err.message });
  }
});

// GET /api/admin/companies - Get all companies
router.get('/companies', isAdmin, async (req, res) => {
  try {
    const companies = await Company.find({})
      .sort({ createdAt: -1 })
      .populate('owner', 'name email')
      .lean();
    
    // Add job count for each company
    for (let company of companies) {
      company.jobsCount = await Job.countDocuments({ company: company._id });
    }
    
    res.json({ companies });
  } catch (err) {
    console.error('❌ Error fetching companies:', err);
    res.status(500).json({ message: 'Error fetching companies', error: err.message });
  }
});

// PUT /api/admin/companies/:id - Update company
router.put('/companies/:id', isAdmin, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json({ message: 'Company updated successfully', company });
  } catch (err) {
    res.status(500).json({ message: 'Error updating company', error: err.message });
  }
});

// DELETE /api/admin/companies/:id - Delete company
router.delete('/companies/:id', isAdmin, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    // Also delete all jobs posted by this company
    await Job.deleteMany({ company: company._id });
    await company.deleteOne();
    res.json({ message: 'Company and associated jobs deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting company', error: err.message });
  }
});

// DELETE /api/admin/applications/:id - Delete application
router.delete('/applications/:id', isAdmin, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await application.deleteOne();
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting application', error: err.message });
  }
});

// PUT /api/admin/applications/:id/status - Update application status
router.put('/applications/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    application.status = status;
    await application.save();
    res.json({ message: 'Application status updated successfully', application });
  } catch (err) {
    res.status(500).json({ message: 'Error updating application', error: err.message });
  }
});

// GET /api/admin/stats - Enhanced stats
router.get('/stats/detailed', isAdmin, async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const featuredJobs = await Job.countDocuments({ isFeatured: true });
    
    const totalUsers = await User.countDocuments();
    const jobSeekers = await User.countDocuments({ role: 'job_seeker' });
    const employers = await User.countDocuments({ role: 'employer' });
    
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Applied' });
    const acceptedApplications = await Application.countDocuments({ status: 'Accepted' });
    
    const totalCompanies = await Company.countDocuments();
    
    // Recent activities
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).select('title company createdAt').populate('company', 'name');
    const recentApplications = await Application.find().sort({ appliedAt: -1 }).limit(5)
      .populate('applicant', 'name')
      .populate('job', 'title');
    
    res.json({
      stats: {
        jobs: { total: totalJobs, active: activeJobs, featured: featuredJobs },
        users: { total: totalUsers, jobSeekers, employers },
        applications: { total: totalApplications, pending: pendingApplications, accepted: acceptedApplications },
        companies: totalCompanies
      },
      recentActivities: {
        users: recentUsers,
        jobs: recentJobs,
        applications: recentApplications
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching detailed stats', error: err.message });
  }
});

module.exports = router;
