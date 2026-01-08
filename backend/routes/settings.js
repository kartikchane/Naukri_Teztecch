const express = require('express');
const router = express.Router();
const { isAdmin, protect, optionalAuth } = require('../middleware/auth');
const Settings = require('../models/Settings');
const multer = require('multer');
const path = require('path');

// Configure multer for logo/image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   GET /api/settings
// @desc    Get site settings (public)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching settings', error: err.message });
  }
});

// @route   PUT /api/settings
// @desc    Update site settings
// @access  Admin only
router.put('/', protect, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      // Update settings with new data
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
          settings[key] = { ...settings[key], ...req.body[key] };
        } else {
          settings[key] = req.body[key];
        }
      });
    }
    await settings.save();
    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

// @route   POST /api/settings/upload-logo
// @desc    Upload site logo
// @access  Admin only
router.post('/upload-logo', protect, isAdmin, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const logoUrl = `/uploads/${req.file.filename}`;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.siteLogo = logoUrl;
    await settings.save();
    
    res.json({ message: 'Logo uploaded successfully', logoUrl });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading logo', error: err.message });
  }
});

// @route   POST /api/settings/upload-favicon
// @desc    Upload site favicon
// @access  Admin only
router.post('/upload-favicon', protect, isAdmin, upload.single('favicon'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const faviconUrl = `/uploads/${req.file.filename}`;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.favicon = faviconUrl;
    await settings.save();
    
    res.json({ message: 'Favicon uploaded successfully', faviconUrl });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading favicon', error: err.message });
  }
});

// @route   POST /api/settings/upload-hero-bg
// @desc    Upload hero background image
// @access  Admin only
router.post('/upload-hero-bg', protect, isAdmin, upload.single('heroBg'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const bgUrl = `/uploads/${req.file.filename}`;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    if (!settings.hero) {
      settings.hero = {};
    }
    settings.hero.backgroundImage = bgUrl;
    await settings.save();
    
    res.json({ message: 'Hero background uploaded successfully', bgUrl });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading hero background', error: err.message });
  }
});

// @route   PUT /api/settings/header
// @desc    Update header settings
// @access  Admin only
router.put('/header', protect, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.getSettings();
    settings.header = { ...settings.header, ...req.body };
    await settings.save();
    res.json({ message: 'Header settings updated', settings });
  } catch (err) {
    res.status(500).json({ message: 'Error updating header', error: err.message });
  }
});

// @route   PUT /api/settings/footer
// @desc    Update footer settings
// @access  Admin only
router.put('/footer', protect, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.getSettings();
    settings.footer = { ...settings.footer, ...req.body };
    await settings.save();
    res.json({ message: 'Footer settings updated', settings });
  } catch (err) {
    res.status(500).json({ message: 'Error updating footer', error: err.message });
  }
});

// @route   PUT /api/settings/social
// @desc    Update social media links
// @access  Admin only
router.put('/social', protect, isAdmin, async (req, res) => {
  try {
    let settings = await Settings.getSettings();
    settings.socialMedia = { ...settings.socialMedia, ...req.body };
    await settings.save();
    res.json({ message: 'Social media links updated', settings });
  } catch (err) {
    res.status(500).json({ message: 'Error updating social media', error: err.message });
  }
});

module.exports = router;
