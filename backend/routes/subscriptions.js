const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Company = require('../models/Company');
const { protect, isAdmin, isEmployer } = require('../middleware/auth');

// @route   GET /api/subscriptions/my-subscription
// @desc    Get current user's active subscription
// @access  Private
router.get('/my-subscription', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active'
    }).populate('plan');

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions/history
// @desc    Get user's subscription history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      user: req.user._id
    })
      .populate('plan')
      .sort({ createdAt: -1 });

    res.json({
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subscriptions/create
// @desc    Create new subscription with Razorpay payment
// @access  Private
router.post('/create', protect, [
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('paymentMethod').isIn(['razorpay', 'credit-card', 'debit-card', 'upi', 'net-banking', 'wallet', 'manual']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId, paymentMethod } = req.body;

    // Get plan details
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check for existing active subscription of same type
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      type: plan.planType,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({ message: `You already have an active ${plan.planType} subscription` });
    }

    // Check if employer's company profile is verified (if user is not admin)
    if (req.user.role === 'employer') {
      const company = await Company.findOne({ owner: req.user._id });
      if (!company) {
        return res.status(403).json({
          message: 'Please create a company profile first before subscribing to plans',
          requiresCompanyProfile: true,
          redirect: '/create-company'
        });
      }

      if (company.documentVerification?.status !== 'verified') {
        return res.status(403).json({
          message: 'Your company profile must be verified by admin before subscribing to plans',
          verificationStatus: company.documentVerification?.status || 'pending',
          requiresVerification: true,
          redirect: '/company-profile'
        });
      }
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    const durationMonths = plan.subscriptionFeatures.durationMonths || 1;
    endDate.setMonth(endDate.getMonth() + durationMonths);

    // Create subscription with PENDING status (waiting for payment verification)
    const subscription = await Subscription.create({
      user: req.user._id,
      plan: planId,
      type: plan.planType,
      status: 'pending',
      amount: plan.price,
      payment: {
        paymentMethod: paymentMethod,
        paymentDate: null,
        paymentStatus: 'pending',
        transactionId: null
      },
      startDate,
      endDate,
      autoRenew: true
    });

    // Initialize Razorpay (real payment gateway)
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    try {
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: plan.price * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: subscription._id.toString(),
        notes: {
          subscriptionId: subscription._id.toString(),
          userId: req.user._id.toString(),
          planId: planId.toString(),
          userEmail: req.user.email
        }
      });

      // Store Razorpay order ID in subscription
      subscription.payment.transactionId = razorpayOrder.id;
      await subscription.save();

      res.status(201).json({
        message: 'Payment order created. Please complete the payment.',
        subscription,
        razorpayOrder: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID
        }
      });
    } catch (razorpayError) {
      console.error('Razorpay error:', razorpayError);
      // Delete the pending subscription if Razorpay fails
      await Subscription.findByIdAndDelete(subscription._id);
      return res.status(500).json({
        message: 'Failed to create payment order. Please try again.',
        error: razorpayError.message
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/subscriptions/verify-payment
// @desc    Verify payment and activate subscription
// @access  Private
router.post('/verify-payment', protect, [
  body('razorpayPaymentId').notEmpty().withMessage('Payment ID is required'),
  body('razorpayOrderId').notEmpty().withMessage('Order ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Signature is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Get subscription by Razorpay order ID (stored in transactionId)
    const subscription = await Subscription.findOne({
      'payment.transactionId': razorpayOrderId,
      user: req.user._id
    }).populate('plan');
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Verify subscription belongs to user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify signature with Razorpay
    const crypto = require('crypto');
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: 'Payment verification failed. Invalid signature.',
        verified: false
      });
    }

    // Verify payment with Razorpay
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    try {
      const payment = await razorpay.payments.fetch(razorpayPaymentId);

      if (payment.status === 'captured' || payment.status === 'authorized') {
        // Update subscription status
        subscription.status = 'active';
        subscription.payment.paymentStatus = 'completed';
        subscription.payment.paymentDate = new Date();
        subscription.payment.transactionId = razorpayPaymentId;
        await subscription.save();

        // Update user's subscription reference
        await User.findByIdAndUpdate(req.user._id, { subscription: subscription._id });

        // Send confirmation email (optional)
        console.log(`Payment verified successfully for subscription ${subscription._id}`);

        res.json({
          message: `Successfully subscribed to ${subscription.plan.displayName}!`,
          subscription,
          verified: true
        });
      } else {
        return res.status(400).json({
          message: 'Payment failed or is pending.',
          paymentStatus: payment.status,
          verified: false
        });
      }
    } catch (razorpayError) {
      console.error('Razorpay verification error:', razorpayError);
      return res.status(500).json({
        message: 'Failed to verify payment with payment gateway.',
        error: razorpayError.message,
        verified: false
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/subscriptions/:id/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/:id/cancel', protect, [
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check authorization
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this subscription' });
    }

    if (subscription.status !== 'active') {
      return res.status(400).json({ message: 'Only active subscriptions can be cancelled' });
    }

    // Cancel subscription
    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: req.user._id,
      reason: req.body.reason || 'User initiated cancellation'
    };

    await subscription.save();

    // Clear user's subscription reference if this was their active one
    if (req.user.subscription.toString() === subscription._id.toString()) {
      await User.findByIdAndUpdate(req.user._id, { subscription: null });
    }

    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subscriptions/:id/renew
// @desc    Renew subscription
// @access  Private
router.post('/:id/renew', protect, [
  body('paymentMethod').isIn(['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('plan');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check authorization
    if (subscription.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to renew this subscription' });
    }

    // Calculate new end date
    const newEndDate = new Date(subscription.endDate);
    const durationMonths = subscription.plan.subscriptionFeatures.durationMonths || 1;
    newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

    // Add renewal to history
    subscription.renewalHistory.push({
      renewalDate: new Date(),
      amount: subscription.plan.price,
      status: 'completed'
    });

    // Update subscription
    subscription.endDate = newEndDate;
    subscription.status = 'active';
    subscription.payment.paymentDate = new Date();
    subscription.payment.transactionId = `TXN-${Date.now()}-${req.user._id}`;

    await subscription.save();

    res.json({
      message: 'Subscription renewed successfully',
      subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions/:id
// @desc    Get subscription by ID (Admin)
// @access  Private (Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('user', 'name email')
      .populate('plan');

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Check authorization
    if (subscription.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions (Admin)
// @desc    Get all subscriptions
// @access  Private (Admin)
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { status, type } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;

    const subscriptions = await Subscription.find(query)
      .populate('user', 'name email')
      .populate('plan')
      .sort({ createdAt: -1 });

    res.json({
      count: subscriptions.length,
      subscriptions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
