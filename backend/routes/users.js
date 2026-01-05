const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('company')
      .populate('savedJobs');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      bio,
      skills,
      experience,
      education,
      location
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (education) user.education = education;
    if (location) user.location = location;

    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/resume
// @desc    Upload resume
// @access  Private
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Convert absolute path to relative: uploads/resume-xxx.pdf
    const relativePath = req.file.path.replace(/\\/g, '/').split('/uploads/')[1];
    const resumePath = `uploads/${relativePath}`;

    const user = await User.findById(req.user._id);
    user.resume = resumePath;
    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      resume: resumePath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/avatar
// @desc    Upload avatar
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Convert absolute path to relative: uploads/avatar-xxx.png
    const relativePath = req.file.path.replace(/\\/g, '/').split('/uploads/')[1];
    const avatarPath = `uploads/${relativePath}`;

    const user = await User.findById(req.user._id);
    user.avatar = avatarPath;
    await user.save();

    res.json({
      message: 'Avatar uploaded successfully',
      avatar: avatarPath
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/save-job/:jobId
// @desc    Save/unsave a job
// @access  Private
router.post('/save-job/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobId = req.params.jobId;

    // Check if job is already saved
    const index = user.savedJobs.indexOf(jobId);

    if (index > -1) {
      // Remove from saved jobs
      user.savedJobs.splice(index, 1);
      await user.save();
      res.json({ message: 'Job removed from saved jobs', saved: false });
    } else {
      // Add to saved jobs
      user.savedJobs.push(jobId);
      await user.save();
      res.json({ message: 'Job saved successfully', saved: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/saved-jobs
// @desc    Get saved jobs
// @access  Private
router.get('/saved-jobs', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedJobs',
      populate: {
        path: 'company',
        select: 'name logo'
      }
    });

    res.json(user.savedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
