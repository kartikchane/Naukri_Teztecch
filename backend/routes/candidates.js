const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, isEmployer } = require('../middleware/auth');

// @route   GET /api/candidates
// @desc    Get all job seekers (candidates) for employers to browse
// @access  Private (Employer only)
router.get('/', [protect, isEmployer], async (req, res) => {
  try {
    const {
      search,
      location,
      experience,
      skills,
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    const query = { role: 'jobseeker', suspended: false };

    // Search by name or bio
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query['location.city'] = { $regex: location, $options: 'i' };
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',');
      query.skills = { $in: skillsArray };
    }

    // Filter by experience
    if (experience) {
      if (experience === '0-2') {
        query.$or = [
          { 'experience': { $size: 0 } },
          { 'experience.0': { $exists: true }, 'experience.10': { $exists: false } }
        ];
      } else if (experience === '2-5') {
        query.$expr = {
          $and: [
            { $gte: [{ $size: '$experience' }, 1] },
            { $lt: [{ $size: '$experience' }, 5] }
          ]
        };
      } else if (experience === '5-10') {
        query.$expr = {
          $and: [
            { $gte: [{ $size: '$experience' }, 5] },
            { $lt: [{ $size: '$experience' }, 10] }
          ]
        };
      } else if (experience === '10+') {
        query.$expr = { $gte: [{ $size: '$experience' }, 10] };
      }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch candidates
    const candidates = await User.find(query)
      .select('name email avatar location skills experience education bio')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Get total count
    const total = await User.countDocuments(query);

    // Format candidate data
    const formattedCandidates = candidates.map(candidate => {
      const yearsOfExperience = candidate.experience?.length || 0;
      const education = candidate.education?.[0];

      return {
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        avatar: candidate.avatar,
        location: candidate.location?.city || candidate.location?.state || 'Not specified',
        skills: candidate.skills || [],
        experience: yearsOfExperience,
        education: education?.degree || education?.school || 'Not specified',
        summary: candidate.bio || 'No summary available',
        currentTitle: candidate.experience?.[0]?.position || 'Looking for opportunities'
      };
    });

    res.json({
      candidates: formattedCandidates,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalCandidates: total
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/candidates/:id
// @desc    Get single candidate profile
// @access  Private (Employer only)
router.get('/:id', [protect, isEmployer], async (req, res) => {
  try {
    const candidate = await User.findById(req.params.id)
      .select('name email phone avatar location skills experience education bio createdAt')
      .where('role').equals('jobseeker')
      .where('suspended').equals(false);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
