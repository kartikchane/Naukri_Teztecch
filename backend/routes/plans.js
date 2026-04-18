const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { protect, isAdmin, isEmployer } = require('../middleware/auth');

// @route   GET /api/plans
// @desc    Get all available plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };

    if (type) {
      query.planType = type;
    }

    const plans = await Plan.find(query).sort({ displayOrder: 1 });

    res.json({
      count: plans.length,
      plans
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/plans/:id
// @desc    Get plan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/plans
// @desc    Create new plan (Admin only)
// @access  Private (Admin)
router.post('/', protect, isAdmin, [
  body('name').notEmpty().withMessage('Plan name is required'),
  body('displayName').notEmpty().withMessage('Display name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('planType').isIn(['job-posting', 'job-viewing', 'company-subscription']).withMessage('Invalid plan type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = await Plan.create(req.body);

    res.status(201).json({
      message: 'Plan created successfully',
      plan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/plans/:id
// @desc    Update plan (Admin only)
// @access  Private (Admin)
router.put('/:id', protect, isAdmin, async (req, res) => {
  try {
    let plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    plan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Plan updated successfully',
      plan
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/plans/:id
// @desc    Delete plan (Admin only)
// @access  Private (Admin)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndRemove(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
