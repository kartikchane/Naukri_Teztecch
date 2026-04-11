const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const { protect, isEmployer } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/companies
// @desc    Create company profile
// @access  Private (Employer only)
router.post('/', [protect, isEmployer], [
  body('name').notEmpty().withMessage('Company name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('industry').notEmpty().withMessage('Industry is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a company
    const existingCompany = await Company.findOne({ owner: req.user._id });
    if (existingCompany) {
      return res.status(400).json({ message: 'You already have a company profile' });
    }

    const company = await Company.create({
      ...req.body,
      owner: req.user._id
    });

    // Update user's company reference
    req.user.company = company._id;
    await req.user.save();

    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/my-company
// @desc    Get current user's company
// @access  Private (Employer only)
router.get('/my-company', [protect, isEmployer], async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id });
    
    if (!company) {
      return res.status(404).json({ message: 'No company profile found' });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id
// @desc    Get company by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('owner', 'name email');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, industry, companySize } = req.query;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (industry) {
      query.industry = industry;
    }
    
    if (companySize) {
      query.companySize = companySize;
    }
    
    const companies = await Company.find(query).sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private (Owner only)
router.put('/:id', [protect, isEmployer], async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user owns the company
    if (company.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/companies/:id/logo
// @desc    Upload company logo
// @access  Private (Owner only)
router.post('/:id/logo', [protect, isEmployer], upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Convert absolute path to relative: uploads/logo-xxx.png
    const relativePath = req.file.path.replace(/\\/g, '/').split('/uploads/')[1];
    const logoPath = `uploads/${relativePath}`;

    company.logo = logoPath;
    await company.save();

    res.json({
      message: 'Logo uploaded successfully',
      logo: logoPath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/companies/:id/follow
// @desc    Follow company
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user already follows
    if (company.followersList.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already following this company' });
    }

    company.followersList.push(req.user._id);
    company.followers = company.followersList.length;
    await company.save();

    res.json({
      message: 'Following company',
      followers: company.followers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/companies/:id/follow
// @desc    Unfollow company
// @access  Private
router.delete('/:id/follow', protect, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.followersList = company.followersList.filter(
      id => id.toString() !== req.user._id.toString()
    );
    company.followers = company.followersList.length;
    await company.save();

    res.json({
      message: 'Unfollowed company',
      followers: company.followers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/rating-summary
// @desc    Get company rating summary (aggregated from jobs)
// @access  Public
router.get('/:id/rating-summary', async (req, res) => {
  try {
    const Job = require('../models/Job');

    const jobs = await Job.find({ company: req.params.id });

    let totalRating = 0;
    let ratingCount = 0;
    const categoryRatings = {
      salary: [],
      culture: [],
      growth: [],
      security: [],
      satisfaction: [],
      worklife: [],
      benefits: []
    };

    // Calculate average salary across jobs
    const salaries = jobs.map(j => ((j.salary?.min || 0) + (j.salary?.max || 0)) / 2).filter(s => s > 0);
    if (salaries.length > 0) {
      const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
      const salaryRating = Math.min(5, (avgSalary / 50000) * 5); // Normalize to 1-5
      categoryRatings.salary = [salaryRating];
    }

    // Default ratings for other categories (can be enhanced with actual data)
    if (jobs.length > 0) {
      categoryRatings.culture = [3.7];
      categoryRatings.growth = [3.6];
      categoryRatings.security = [3.8];
      categoryRatings.satisfaction = [3.7];
      categoryRatings.worklife = [3.4];
      categoryRatings.benefits = [3.5];
    }

    // Calculate overall average rating
    const allRatings = Object.values(categoryRatings).flat();
    const avgRating = allRatings.length > 0
      ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
      : 0;

    res.json({
      overallRating: parseFloat(avgRating),
      totalReviews: jobs.length,
      categoryRatings: {
        salary: categoryRatings.salary[0]?.toFixed(1) || 0,
        culture: categoryRatings.culture[0]?.toFixed(1) || 0,
        growth: categoryRatings.growth[0]?.toFixed(1) || 0,
        security: categoryRatings.security[0]?.toFixed(1) || 0,
        satisfaction: categoryRatings.satisfaction[0]?.toFixed(1) || 0,
        worklife: categoryRatings.worklife[0]?.toFixed(1) || 0,
        benefits: categoryRatings.benefits[0]?.toFixed(1) || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/departments
// @desc    Get departments with job opening counts
// @access  Public
router.get('/:id/departments', async (req, res) => {
  try {
    const Job = require('../models/Job');

    const jobs = await Job.find({ company: req.params.id });

    // Group jobs by department
    const departmentMap = {};
    jobs.forEach(job => {
      const dept = job.category || 'Other';
      if (!departmentMap[dept]) {
        departmentMap[dept] = 0;
      }
      departmentMap[dept] += job.openings || 1;
    });

    const departments = Object.entries(departmentMap).map(([name, openings]) => ({
      name,
      openings
    }));

    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/benefits
// @desc    Get company benefits
// @access  Public
router.get('/:id/benefits', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Return company benefits or default benefits
    const defaultBenefits = [
      { name: 'Free meal', count: 12 },
      { name: 'Health insurance', count: 15 },
      { name: 'Cafeteria', count: 18 },
      { name: 'Job/Soft skill training', count: 14 },
      { name: 'Child care facility', count: 5 }
    ];

    const benefits = company.benefits.length > 0
      ? company.benefits.map((b, i) => ({ name: b, count: Math.floor(Math.random() * 20) + 5 }))
      : defaultBenefits;

    res.json(benefits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/salaries
// @desc    Get salary data for company
// @access  Public
router.get('/:id/salaries', async (req, res) => {
  try {
    const Job = require('../models/Job');

    const jobs = await Job.find({ company: req.params.id });

    // Group salaries by job title and experience level
    const salaryMap = {};
    jobs.forEach(job => {
      const key = `${job.title}-${job.experience?.min || 0}-${job.experience?.max || 5}`;
      if (!salaryMap[key]) {
        salaryMap[key] = {
          jobTitle: job.title,
          experienceLevel: `${job.experience?.min || 0}-${job.experience?.max || 5} yrs`,
          minSalary: job.salary?.min || 0,
          maxSalary: job.salary?.max || 0,
          currency: job.salary?.currency || 'INR',
          count: 0
        };
      }
      salaryMap[key].count++;
    });

    const salaries = Object.values(salaryMap);

    res.json(salaries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/companies/:id/cover-image
// @desc    Upload company cover image
// @access  Private (Owner only)
router.patch('/:id/cover-image', [protect, isEmployer], upload.single('coverImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const relativePath = req.file.path.replace(/\\/g, '/').split('/uploads/')[1];
    const imagePath = `uploads/${relativePath}`;

    company.coverImage = imagePath;
    await company.save();

    res.json({
      message: 'Cover image uploaded successfully',
      coverImage: imagePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PATCH /api/companies/:id/photos
// @desc    Upload company photos
// @access  Private (Owner only)
router.patch('/:id/photos', [protect, isEmployer], upload.array('photos', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one photo' });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const photoPaths = req.files.map(file => {
      const relativePath = file.path.replace(/\\/g, '/').split('/uploads/')[1];
      return `uploads/${relativePath}`;
    });

    company.companyPhotos = [...(company.companyPhotos || []), ...photoPaths];
    await company.save();

    res.json({
      message: 'Photos uploaded successfully',
      photos: company.companyPhotos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
