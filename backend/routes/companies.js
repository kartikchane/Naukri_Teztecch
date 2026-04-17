const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Company = require('../models/Company');
const { protect, isEmployer } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { sendEmailNotification } = require('../utils/notificationHelper');
const Notification = require('../models/Notification');

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
      const notification = await Notification.create({
        user: req.user._id,
        type: 'company_created',
        title: 'Company Profile Created',
        message: `Your company "${company.name}" has been created successfully!`,
        description: `Next step: Upload documents for verification so you can start posting jobs.`,
        priority: 'high',
        data: { company: company._id },
        contactMethods: { email: true, sms: false, inApp: true },
        actionUrl: `/company-profile`
      });

      await sendEmailNotification(req.user, notification);
      console.log(`Company creation email sent to ${req.user.email}`);
    } catch (emailError) {
      console.error('Error sending company creation email:', emailError);
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
// @desc    Serve company document for viewing in browser
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

    // Resolve the file path
    const path = require('path');
    const fs = require('fs');

    console.log('🔵 Document view request:');
    console.log('  Document Type:', docType);
    console.log('  Stored Path:', documentPath);

    // Handle both relative paths and full paths
    let filePath;
    if (documentPath.includes('uploads')) {
      // If path already includes uploads, use it from backend root
      filePath = path.join(__dirname, '../', documentPath);
    } else {
      // If it's just a filename, prepend uploads
      filePath = path.join(__dirname, '../uploads', documentPath);
    }

    console.log('  Resolved Path:', filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('  ❌ File not found:', filePath);
      return res.status(404).json({ message: 'File not found on server', path: filePath });
    }

    console.log('  ✅ File found, sending to browser...');

    // Set headers to display in browser instead of download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + path.basename(filePath) + '"');

    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('🔴 Document view error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
