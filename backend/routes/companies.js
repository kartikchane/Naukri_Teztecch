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

    company.logo = req.file.path;
    await company.save();

    res.json({
      message: 'Logo uploaded successfully',
      logo: req.file.path
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
