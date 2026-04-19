const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const User = require('../models/User');
const { protect, isEmployer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const EmailService = require('../services/emailService');

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

    // Send email notification to employer
    try {
      await EmailService.companyCretedEmail(req.user, company);
    } catch (emailError) {
      console.error('Error sending company created email:', emailError);
      // Don't fail if email fails
    }

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

// @route   GET /api/companies/my-company/verification-status
// @desc    Check if company is verified (refresh)
// @access  Private (Employer only)
router.get('/my-company/verification-status', [protect, isEmployer], async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user._id })
      .select('name documentVerification.status documentVerification.verifiedAt documentVerification.rejectionReason');

    if (!company) {
      return res.status(404).json({ message: 'No company profile found' });
    }

    res.json({
      name: company.name,
      isVerified: company.documentVerification?.status === 'verified',
      status: company.documentVerification?.status || 'pending',
      verifiedAt: company.documentVerification?.verifiedAt,
      rejectionReason: company.documentVerification?.rejectionReason
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// SPECIFIC ROUTES - MUST COME BEFORE /:id ROUTE

// @route   GET /api/companies/:id/rating-summary
// @desc    Get company rating summary
// @access  Public
router.get('/:id/rating-summary', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const { id } = req.params;

    // Get company to verify it exists
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get all approved reviews for this company
    const reviews = await Review.find({
      company: id,
      status: 'approved'
    }).populate('reviewedBy', 'name');

    if (reviews.length === 0) {
      return res.json({
        overallRating: 0,
        totalReviews: 0,
        categoryRatings: {
          salary: 0,
          culture: 0,
          growth: 0,
          security: 0,
          satisfaction: 0,
          worklife: 0,
          benefits: 0
        },
        reviewsByJobProfile: {}
      });
    }

    // Calculate overall rating
    const overallRating = (reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1);

    // Calculate category averages
    const categoryRatings = {
      salary: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.salary || 0), 0) / reviews.length).toFixed(1),
      culture: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.culture || 0), 0) / reviews.length).toFixed(1),
      growth: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.growth || 0), 0) / reviews.length).toFixed(1),
      security: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.security || 0), 0) / reviews.length).toFixed(1),
      satisfaction: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.satisfaction || 0), 0) / reviews.length).toFixed(1),
      worklife: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.worklife || 0), 0) / reviews.length).toFixed(1),
      benefits: (reviews.reduce((sum, r) => sum + (r.categoryRatings?.benefits || 0), 0) / reviews.length).toFixed(1)
    };

    // Group reviews by job title
    const reviewsByJobProfile = {};
    reviews.forEach(review => {
      if (!reviewsByJobProfile[review.jobTitle]) {
        reviewsByJobProfile[review.jobTitle] = [];
      }
      reviewsByJobProfile[review.jobTitle].push(review);
    });

    res.json({
      overallRating,
      totalReviews: reviews.length,
      categoryRatings,
      reviewsByJobProfile: Object.entries(reviewsByJobProfile).reduce((acc, [job, jobReviews]) => {
        acc[job] = {
          averageRating: (jobReviews.reduce((sum, r) => sum + r.overallRating, 0) / jobReviews.length).toFixed(1),
          totalReviews: jobReviews.length
        };
        return acc;
      }, {})
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/reviews
// @desc    Get all company reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const Review = require('../models/Review');
    const { id } = req.params;
    const { page = 1, limit = 10, sortBy = 'recent' } = req.query;

    const skip = (page - 1) * limit;

    const sortOptions = {
      recent: { createdAt: -1 },
      helpful: { helpful: -1 },
      highest: { overallRating: -1 },
      lowest: { overallRating: 1 }
    };

    const reviews = await Review.find({
      company: id,
      status: 'approved'
    })
      .populate('reviewedBy', 'name')
      .sort(sortOptions[sortBy] || sortOptions.recent)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      company: id,
      status: 'approved'
    });

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/companies/:id/reviews
// @desc    Add a review for a company
// @access  Private (authenticated users)
router.post('/:id/reviews', protect, [
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('overallRating').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1-5'),
  body('reviewText').isLength({ min: 10, max: 1000 }).withMessage('Review must be between 10-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const Review = require('../models/Review');
    const { id } = req.params;

    // Check if company exists
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if user already reviewed this company
    const existingReview = await Review.findOne({
      company: id,
      reviewedBy: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this company' });
    }

    const review = new Review({
      company: id,
      reviewedBy: req.user._id,
      ...req.body,
      status: 'pending' // Reviews need admin approval
    });

    await review.save();

    res.status(201).json({
      message: 'Review submitted successfully. It will be published after approval.',
      review
    });
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

    console.log('🔵 Company update START');
    console.log('  Current logo before update:', company.logo);
    console.log('  Update data:', req.body);

    // Clean up empty values to avoid validation errors
    const updateData = { ...req.body };

    // Remove empty strings for enum fields
    if (updateData.companySize === '' || updateData.companySize === null) {
      delete updateData.companySize;
    }
    if (!updateData.founded) {
      delete updateData.founded;
    }

    // IMPORTANT: Preserve existing logo if not included in update
    if (!updateData.logo && company.logo) {
      updateData.logo = company.logo;
      console.log('  Preserving existing logo:', company.logo);
    }

    console.log('  Cleaned update data:', updateData);

    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('🟢 Company update SUCCESS');
    console.log('  New logo after update:', updatedCompany.logo);

    res.json(updatedCompany);
  } catch (error) {
    console.error('🔴 Company update ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

    // Extract just the filename - frontend will add /uploads/ prefix
    const fileName = req.file.filename;
    // Store only the filename, NOT the uploads/ prefix
    // Frontend URL construction: ${API_URL}/uploads/${filename}

    console.log('🔵 Logo upload START');
    console.log('  Original path:', req.file.path);
    console.log('  Filename:', fileName);
    console.log('  Storing in DB:', fileName);
    console.log('  Company ID:', req.params.id);

    company.logo = fileName;
    const savedCompany = await company.save();

    console.log('🟢 Logo upload SUCCESS');
    console.log('  Saved logo in DB:', savedCompany.logo);

    res.json({
      message: 'Logo uploaded successfully',
      logo: fileName,
      savedLogo: savedCompany.logo
    });
  } catch (error) {
    console.error('🔴 Logo upload ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/companies/:id/documents
// @desc    Upload company documents (Aadhar, PAN, GST, Udyam)
// @access  Private (Owner only)
router.post('/:id/documents', [protect, isEmployer], upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { documentType } = req.body;
    const validDocTypes = ['aadharCard', 'panCard', 'gstCertificate', 'udyamAadhar'];

    if (!documentType || !validDocTypes.includes(documentType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Convert absolute path to relative
    const relativePath = req.file.path.replace(/\\/g, '/').split('/uploads/')[1];
    const documentPath = `uploads/${relativePath}`;

    // Update documents
    if (!company.documents) {
      company.documents = {};
    }
    company.documents[documentType] = documentPath;

    // Update documentDetails for verification tracking
    if (!company.documentDetails) {
      company.documentDetails = {};
    }

    const detailsKey = documentType === 'aadharCard' ? 'businessRegistration' :
                       documentType === 'panCard' ? 'panCard' :
                       documentType === 'gstCertificate' ? 'gstCertificate' : 'addressProof';

    company.documentDetails[detailsKey] = {
      fileUrl: documentPath,
      uploadedAt: new Date(),
      verified: false,
      adminNotes: ''
    };

    await company.save();

    res.json({
      message: 'Document uploaded successfully',
      documentType: documentType,
      filePath: documentPath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/companies/:id/documents/:docType
// @desc    Get document download URL (redirects to static file serving)
// @access  Public (viewable by registered users)
router.get('/:id/documents/:docType', async (req, res) => {
  try {
    const { id, docType } = req.params;
    const validDocTypes = ['aadharCard', 'panCard', 'gstCertificate', 'udyamAadhar'];

    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const documentPath = company.documents?.[docType];
    if (!documentPath) {
      return res.status(404).json({ message: 'Document not found in database' });
    }

    console.log('🔵 Document URL request:');
    console.log('  Document Type:', docType);
    console.log('  Stored Path:', documentPath);

    // Ensure the path starts with /uploads/
    const normalizedPath = documentPath.startsWith('/')
      ? documentPath
      : `/${documentPath}`;

    console.log('  Normalized Path:', normalizedPath);
    console.log('  ✅ Redirecting to static file endpoint...');

    // Redirect to the static file serving middleware
    // This allows Render's proxy and CDN to handle file serving properly
    res.redirect(normalizedPath);
  } catch (error) {
    console.error('🔴 Document URL error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
