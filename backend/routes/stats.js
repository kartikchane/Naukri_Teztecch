const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const User = require('../models/User');

// @route   GET /api/stats
// @desc    Get platform statistics
// @access  Public
router.get('/', async (req, res) => {
  try {
    const [jobsCount, uniqueCompanyNames, usersCount] = await Promise.all([
      Job.countDocuments({ status: 'Open' }),
      Company.distinct('name'),
      User.countDocuments()
    ]);

    res.json({
      jobs: jobsCount,
      companies: uniqueCompanyNames.length,
      users: usersCount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stats/categories
// @desc    Get job counts by category
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categoryCounts = await Job.aggregate([
      {
        $match: { 
          status: 'Open',
          $or: [
            { applicationDeadline: { $exists: false } },
            { applicationDeadline: null },
            { applicationDeadline: { $gte: new Date() } }
          ]
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Convert to object for easier lookup
    const categories = {};
    categoryCounts.forEach(item => {
      categories[item.category] = item.count;
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
