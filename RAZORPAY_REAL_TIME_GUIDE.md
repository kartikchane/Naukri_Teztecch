# 💳 RAZORPAY - REAL TIME PAYMENT SETUP (HINDI)

## STEP 1: Razorpay Account Banao

### A. Account Sign Up
```
1. Link: https://dashboard.razorpay.com/signup
2. Email aur password se sign up karo
3. Email verify karo
4. Business details fill karo (name, category, etc.)
5. Account ready! 🎉
```

### B. API Keys Prapt Karo

**Kahan jayen?**
```
Dashboard → Settings → API Keys
```

**Test Keys (Development ke liye)**
```
Settings → API Keys
Tab: Test (Default selected)

Key ID:     rzp_test_xxxxxxxxxxxxxx
Key Secret: test_secret_xxxxxxxxx

⚠️ YEH TEST KEYS HAI - REAL PAISA NAHI LEGA
```

**Live Keys (Production ke liye)**
```
Settings → API Keys
Tab: Live (unlock karni padegi)

Key ID:     rzp_live_xxxxxxxxxxxxxx
Key Secret: live_secret_xxxxxxxxx

✅ YEH LIVE KEYS HAI - REAL PAISA LEGA
```

---

## STEP 2: Backend Setup (.env File)

### .env File Banao (Backend folder me)

```bash
# ❌ YEH MAT KARO - Seedha password likho
# ❌ WRONG: password = mypassword

# ✅ YEH KARO - .env file use karo
# ✅ RIGHT: .env me likho

# MongoDB
MONGODB_URI=mongodb://localhost:27017/naukri

# JWT Secret
JWT_SECRET=your_super_secret_key_12345abcde

# Node Environment
NODE_ENV=development  # IMPORTANT!

# Razorpay Keys (TEST - Development ke liye)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxx
RAZORPAY_KEY_SECRET=test_secret_xxxxxxxxxx

# Razorpay Keys (LIVE - Production ke liye)
# RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxx
# RAZORPAY_KEY_SECRET=live_secret_xxxxxxxxxx

# Admin Email
ADMIN_EMAIL=admin@naukri.com
```

### .gitignore File (GitHub pe na jaaye!)

```bash
# .gitignore me likho
.env
.env.local
.env.*.local
node_modules/
```

---

## STEP 3: FRONTEND - COMPLETE PAYMENT FLOW

### A. Plans.js - Updated Code

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';

const Plans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [subscribing, setSubscribing] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  // Plans fetch karo
  const fetchPlans = async () => {
    try {
      const response = await API.get('/plans?type=job-posting');
      setPlans(Array.isArray(response.data?.plans || response.data || []) ? 
        (response.data?.plans || response.data) : []);
    } catch (error) {
      console.error('Plans fetch error:', error);
      toast.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  // Current subscription check karo
  const fetchCurrentSubscription = async () => {
    try {
      const response = await API.get('/subscriptions/my-subscription');
      setCurrentSubscription(response.data);
      console.log('✅ Active subscription:', response.data);
    } catch (error) {
      // Koi subscription nahi
      setCurrentSubscription(null);
    }
  };

  // Step 1: Plan select karo
  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  // Step 2: REAL RAZORPAY PAYMENT PROCESS
  const handlePayment = async () => {
    if (!selectedPlan) return;

    setSubscribing(true);

    try {
      console.log('🔄 Payment step 1: Creating order...');

      // ==========================================
      // STEP A: Backend se order banao
      // ==========================================
      const createResponse = await API.post('/subscriptions/create', {
        planId: selectedPlan._id,
        paymentMethod: paymentMethod
      });

      console.log('✅ Order created:', createResponse.data);

      const { subscription, razorpayOrder } = createResponse.data;

      // ==========================================
      // STEP B: Razorpay payment modal open karo
      // ==========================================
      const options = {
        // Razorpay Key ID
        key: razorpayOrder.key,

        // Order details
        amount: razorpayOrder.amount, // Paise mein (100 = ₹1)
        currency: razorpayOrder.currency, // INR
        order_id: razorpayOrder.orderId, // Razorpay order ID

        // Company details
        name: 'Teztech - Naukri Platform',
        description: `Subscribe to ${selectedPlan.displayName} Plan`,
        image: '/teztech-logo.svg',

        // Success callback
        handler: async (response) => {
          try {
            console.log('🔄 Payment step 2: Verifying payment...');
            console.log('Payment response:', response);

            // ==========================================
            // STEP C: Backend ko verify karaao
            // ==========================================
            const verifyResponse = await API.post('/subscriptions/verify-payment', {
              subscriptionId: subscription._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });

            console.log('✅ Payment verified:', verifyResponse.data);

            if (verifyResponse.data.verified) {
              // ✅ PAYMENT SUCCESS
              toast.success(`✅ Successfully subscribed to ${selectedPlan.displayName}!`);
              
              // Modal close karo
              setShowPaymentModal(false);
              setSelectedPlan(null);

              // 1.5 second baad post-job page pe jaao
              setTimeout(() => {
                navigate('/post-job');
              }, 1500);
            } else {
              toast.error('❌ Payment verification failed');
            }
          } catch (verifyError) {
            console.error('❌ Verification error:', verifyError);
            toast.error(
              verifyError.response?.data?.message || 
              'Payment verification failed. Please contact support.'
            );
          } finally {
            setSubscribing(false);
          }
        },

        // User details (pre-fill karo)
        prefill: {
          email: 'user@example.com', // User ka email
          contact: '9999999999' // User ka phone
        },

        // Theme
        theme: {
          color: '#2563eb' // Blue color
        },

        // Payment methods jo available honi chahiye
        method: {
          emandate: false
        },

        // Modal settings
        modal: {
          // Agar user cancel kare
          ondismiss: () => {
            setSubscribing(false);
            toast.warning('⚠️ Payment cancelled');
          },
          // Duration: payment modal kitni der khula rahe
          escape: false // User Esc key se close na kar sake
        }
      };

      // ==========================================
      // STEP D: Razorpay script load karo
      // ==========================================
      if (typeof window.Razorpay === 'undefined') {
        // Script abhi load nahi hua
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
          console.log('✅ Razorpay script loaded');
          new window.Razorpay(options).open();
        };

        script.onerror = () => {
          console.error('❌ Failed to load Razorpay script');
          toast.error('Failed to load payment system. Try again.');
          setSubscribing(false);
        };

        document.body.appendChild(script);
      } else {
        // Script already loaded
        console.log('✅ Razorpay script already loaded');
        new window.Razorpay(options).open();
      }

    } catch (error) {
      console.error('❌ Payment error:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
      setSubscribing(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post Jobs & Attract Candidates
          </h1>
          <p className="text-xl text-gray-600">
            Choose the perfect plan to post job openings
          </p>
        </div>

        {/* Current Subscription - Green Banner */}
        {currentSubscription && (
          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-900">✅ Active Subscription</h3>
                <p className="text-green-700 mt-2">
                  Plan: <span className="font-bold">{currentSubscription.plan?.displayName}</span>
                </p>
                <p className="text-sm text-green-600">
                  Valid until: {new Date(currentSubscription.endDate).toLocaleDateString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => navigate('/post-job')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
              >
                📝 Post a Job Now
              </button>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map(plan => (
            <div
              key={plan._id}
              className={`rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                plan.name === 'hot-vacancy'
                  ? 'ring-2 ring-red-500 transform scale-105'
                  : 'bg-white'
              }`}
            >
              {/* Plan Header */}
              <div className={`p-6 ${
                plan.name === 'hot-vacancy'
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                  : 'bg-blue-50'
              }`}>
                <h3 className="text-2xl font-bold">{plan.displayName}</h3>
                <p className="text-3xl font-bold mt-2">₹{plan.price}</p>
                <p className="text-sm opacity-90 mt-1">/month</p>
              </div>

              {/* Plan Body */}
              <div className="p-6">
                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-3">✅</span>
                    <div>
                      <p className="font-semibold">Job Postings</p>
                      <p className="text-sm text-gray-600">
                        {plan.features.totalJobPostings > 0 
                          ? `${plan.features.totalJobPostings} postings` 
                          : 'Unlimited'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-green-500 mr-3">✅</span>
                    <div>
                      <p className="font-semibold">Job Validity</p>
                      <p className="text-sm text-gray-600">
                        {plan.features.jobValidityDays} days
                      </p>
                    </div>
                  </div>

                  {plan.features.boostOnSearch && (
                    <div className="flex items-start">
                      <span className="text-green-500 mr-3">✅</span>
                      <div>
                        <p className="font-semibold">Boost on Search</p>
                        <p className="text-sm text-gray-600">High visibility</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6">💳 Complete Payment</h3>

            {/* Plan Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
              <p className="text-gray-600 mb-2">Plan Selected</p>
              <p className="text-xl font-bold text-gray-900">{selectedPlan.displayName}</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">₹{selectedPlan.price}</p>
              <p className="text-sm text-gray-500 mt-1">GST as applicable</p>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                💳 Select Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="net-banking">Net Banking</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={subscribing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={subscribing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {subscribing ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processing...
                  </>
                ) : (
                  <>
                    💳 Proceed to Pay
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              ✅ Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
```

---

## STEP 4: BACKEND - REAL RAZORPAY VERIFICATION

### subscriptions.js - Complete Backend Code

```javascript
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const User = require('../models/User');
const { protect, isAdmin, isEmployer } = require('../middleware/auth');
const crypto = require('crypto');

// Razorpay initialize karo
const Razorpay = require('razorpay');

// ==========================================
// API 1: Create Razorpay Order
// ==========================================
// POST /api/subscriptions/create
// Frontend se plan select karke payment ke liye order banao

router.post('/create', protect, [
  body('planId').notEmpty().withMessage('Plan ID is required'),
  body('paymentMethod')
    .isIn(['credit-card', 'debit-card', 'upi', 'net-banking', 'wallet'])
    .withMessage('Invalid payment method')
], async (req, res) => {
  try {
    console.log('📦 STEP 1: Creating subscription order...');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId, paymentMethod } = req.body;
    console.log('Plan ID:', planId);
    console.log('Payment Method:', paymentMethod);

    // Plan details nikalo
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    console.log('✅ Plan found:', plan.displayName);

    // Check: Kya already active subscription hai?
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      type: plan.planType,
      status: 'active'
    });

    if (existingSubscription) {
      return res.status(400).json({
        message: `You already have an active ${plan.planType} subscription`
      });
    }

    // Subscription dates calculate karo
    const startDate = new Date();
    const endDate = new Date();
    const durationMonths = plan.subscriptionFeatures?.durationMonths || 1;
    endDate.setMonth(endDate.getMonth() + durationMonths);

    console.log('📅 Subscription period:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      duration: durationMonths
    });

    // Database mein subscription save karo (PENDING status)
    const subscription = await Subscription.create({
      user: req.user._id,
      plan: planId,
      type: plan.planType,
      status: 'pending', // ⚠️ PENDING - Payment verify hone tak
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

    console.log('✅ Pending subscription created:', subscription._id);

    // ==========================================
    // RAZORPAY ORDER BANAO
    // ==========================================
    
    try {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });

      console.log('🔐 Razorpay credentials loaded');

      // Order banao
      const razorpayOrder = await razorpay.orders.create({
        amount: plan.price * 100, // ⚠️ PAISE MEIN! (₹100 = 10000 paise)
        currency: 'INR',
        receipt: subscription._id.toString(),
        notes: {
          subscriptionId: subscription._id.toString(),
          userId: req.user._id.toString(),
          planId: planId.toString(),
          userEmail: req.user.email,
          planName: plan.displayName
        }
      });

      console.log('✅ Razorpay order created:', razorpayOrder.id);

      // Order ID database mein save karo
      subscription.payment.transactionId = razorpayOrder.id;
      await subscription.save();

      // Frontend ko send karo
      res.status(201).json({
        message: 'Payment order created. Please complete the payment.',
        subscription,
        razorpayOrder: {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount, // Paise mein
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID // Frontend ko bhejna padega
        }
      });

    } catch (razorpayError) {
      console.error('❌ Razorpay error:', razorpayError);
      
      // Agar Razorpay fail hua to subscription delete karo
      await Subscription.findByIdAndDelete(subscription._id);
      
      return res.status(500).json({
        message: 'Failed to create payment order',
        error: razorpayError.message
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// ==========================================
// API 2: Verify Razorpay Payment
// ==========================================
// POST /api/subscriptions/verify-payment
// Frontend se payment complete hone baad verify karo

router.post('/verify-payment', protect, [
  body('subscriptionId').notEmpty().withMessage('Subscription ID required'),
  body('razorpayPaymentId').notEmpty().withMessage('Payment ID required'),
  body('razorpayOrderId').notEmpty().withMessage('Order ID required'),
  body('razorpaySignature').notEmpty().withMessage('Signature required')
], async (req, res) => {
  try {
    console.log('🔍 STEP 2: Verifying payment...');

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      subscriptionId, 
      razorpayPaymentId, 
      razorpayOrderId, 
      razorpaySignature 
    } = req.body;

    console.log('Payment details:', {
      subscriptionId,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId
    });

    // Subscription database mein check karo
    const subscription = await Subscription.findById(subscriptionId).populate('plan');
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Security check: Kya yeh user ka subscription hai?
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // ==========================================
    // SIGNATURE VERIFICATION (HASHING)
    // ==========================================
    // Razorpay ne jo signature bheja hai, usko verify karo
    // Isse ensure hota hai ki payment legitimate hai

    console.log('🔐 Verifying signature...');

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', razorpaySignature);

    if (expectedSignature !== razorpaySignature) {
      console.error('❌ SIGNATURE MISMATCH - Invalid payment');
      return res.status(400).json({
        message: 'Payment verification failed. Invalid signature.',
        verified: false
      });
    }

    console.log('✅ Signature verified!');

    // ==========================================
    // RAZORPAY API SE PAYMENT STATUS CHECK KARO
    // ==========================================

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    try {
      // Razorpay API ko call karo aur check karo payment successful hua ya nahi
      const payment = await razorpay.payments.fetch(razorpayPaymentId);

      console.log('💳 Payment status from Razorpay:', payment.status);
      console.log('Payment amount:', payment.amount);

      // Payment status check karo
      if (payment.status === 'captured' || payment.status === 'authorized') {
        console.log('✅ PAYMENT SUCCESSFUL!');

        // ==========================================
        // DATABASE UPDATE - ACTIVATE SUBSCRIPTION
        // ==========================================

        subscription.status = 'active'; // ✅ ACTIVATE KAR DO
        subscription.payment.paymentStatus = 'completed';
        subscription.payment.paymentDate = new Date();
        subscription.payment.transactionId = razorpayPaymentId; // Real payment ID
        await subscription.save();

        console.log('✅ Subscription activated in database');

        // User ke reference mein subscription ID save karo
        await User.findByIdAndUpdate(req.user._id, { 
          subscription: subscription._id 
        });

        console.log('✅ User updated with subscription');

        // ==========================================
        // SUCCESS RESPONSE BHEJO
        // ==========================================

        res.json({
          message: `✅ Successfully subscribed to ${subscription.plan.displayName}!`,
          subscription,
          verified: true,
          payment: {
            status: 'completed',
            transactionId: razorpayPaymentId,
            amount: payment.amount / 100, // Convert paisa to rupees
            timestamp: new Date().toISOString()
          }
        });

      } else {
        // Payment captured nahi hua
        console.error('❌ Payment not captured:', payment.status);
        return res.status(400).json({
          message: `Payment failed or pending. Status: ${payment.status}`,
          paymentStatus: payment.status,
          verified: false
        });
      }

    } catch (razorpayCheckError) {
      console.error('❌ Razorpay API error:', razorpayCheckError);
      return res.status(500).json({
        message: 'Failed to verify payment with payment gateway',
        error: razorpayCheckError.message,
        verified: false
      });
    }

  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// ==========================================
// API 3: Get Current Subscription
// ==========================================
// GET /api/subscriptions/my-subscription

router.get('/my-subscription', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
      endDate: { $gte: new Date() } // ⚠️ Abhi valid hai
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

// ==========================================
// API 4: Cancel Subscription
// ==========================================

router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    // Authorization check
    if (subscription.user.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.cancellation = {
      cancelledAt: new Date(),
      cancelledBy: req.user._id,
      reason: req.body.reason || 'User initiated'
    };

    await subscription.save();

    // User reference clear karo
    await User.findByIdAndUpdate(req.user._id, { subscription: null });

    res.json({
      message: 'Subscription cancelled successfully',
      subscription
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

---

## STEP 5: TEST CARD NUMBERS

### Testing Razorpay ke liye

```
✅ SUCCESSFUL PAYMENT:
Card Number:  4111 1111 1111 1111
Expiry:       Any future date (MM/YY)
CVV:          Any 3 digits (e.g., 123)
OTP:          Leave blank (auto-verify in test mode)

Result: Payment successfully captured ✅

❌ FAILED PAYMENT:
Card Number:  4111 1111 1111 0002
Expiry:       Any future date
CVV:          Any 3 digits

Result: Payment rejected ❌

💳 MASTERCARD:
Card Number:  5555 5555 5555 4444
Expiry:       Any future date
CVV:          Any 3 digits

Result: Payment successfully captured ✅

🏦 NET BANKING:
Select: Any bank from dropdown
No additional details needed
```

---

## STEP 6: COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    USER SIDE (FRONTEND)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Plans page kholo                                        │
│     ↓                                                        │
│  2. "Choose Plan" button click karo                         │
│     ↓                                                        │
│  3. Payment method select karo                              │
│     (Credit Card / Debit / UPI / Net Banking / Wallet)      │
│     ↓                                                        │
│  4. "Proceed to Pay" click karo                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    /api/subscriptions/create
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND SIDE (NODE.JS)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Subscription database mein create karo (PENDING)        │
│     ↓                                                        │
│  2. Razorpay API ko call karo                               │
│     razorpay.orders.create({...})                           │
│     ↓                                                        │
│  3. Order ID return karo frontend ko                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Razorpay Checkout Modal
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              RAZORPAY PAYMENT GATEWAY                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Payment modal open ho                                   │
│     ↓                                                        │
│  2. User card details enter kare                            │
│  3. OTP verify hoga (automatically in test mode)            │
│     ↓                                                        │
│  4. Payment captured!                                       │
│     Frontend ko 3 things milte hain:                        │
│     - Payment ID                                            │
│     - Order ID                                              │
│     - Signature (HMAC hash)                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
                /api/subscriptions/verify-payment
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          BACKEND - VERIFY & ACTIVATE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Signature verify karo (HMAC-SHA256)                     │
│     if (calculated_hash === received_hash) ✅               │
│     ↓                                                        │
│  2. Razorpay API ko call karo payment status check         │
│     razorpay.payments.fetch(paymentId)                      │
│     ↓                                                        │
│  3. Agar "captured" hai to subscription ACTIVE karo        │
│     ↓                                                        │
│  4. Database update karo                                   │
│     subscription.status = 'active'                          │
│     subscription.payment.paymentStatus = 'completed'        │
│     ↓                                                        │
│  5. Success response bhejo                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 USER SIDE - SUCCESS!                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Success toast message                                   │
│     "✅ Successfully subscribed to Premium Plan!"           │
│     ↓                                                        │
│  2. 1.5 second baad automatic redirect                      │
│     /post-job page pe                                      │
│     ↓                                                        │
│  3. Ab user job post kar sakta hai! 🎉                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## STEP 7: RUNNING & TESTING

### Backend Start Karo

```bash
# Terminal mein
cd backend

# .env file check karo
echo $RAZORPAY_KEY_ID  # Should print something

# Start server
npm run dev
# Output: Server running on port 5000 ✅
```

### Frontend Start Karo

```bash
# Naya terminal
cd frontend

npm start
# Output: Running on http://localhost:3000 ✅
```

### Payment Test Karo

```
1. Browser kholo: http://localhost:3000/plans

2. "Choose Plan" click karo

3. Payment modal open hoga

4. Test card use karo: 4111 1111 1111 1111

5. Expiry: Any future (12/25)

6. CVV: 123 (koi bhi 3 digit)

7. "Pay" click karo

8. ✅ Success message aana chahiye!

9. /post-job page pe redirect ho jana chahiye
```

---

## STEP 8: CONSOLE LOGS - DEBUGGING

### Agar kuch galat ho to check karo

```javascript
// Backend logs dekhne ke liye:
// Terminal mein `npm run dev` output dekhta raho

// Frontend logs:
// Browser mein F12 → Console tab

// Expected logs:
🔄 STEP 1: Creating subscription order...
✅ Plan found: Premium Plan
✅ Pending subscription created: [ID]
✅ Razorpay order created: order_xxxxx

🔄 STEP 2: Verifying payment...
🔐 Verifying signature...
✅ Signature verified!
💳 Payment status from Razorpay: captured
✅ PAYMENT SUCCESSFUL!
✅ Subscription activated in database
✅ User updated with subscription
```

---

## STEP 9: PRODUCTION SETUP (LIVE PAYMENTS)

### Live Keys Setup

```bash
# 1. Razorpay dashboard ja
# Settings → API Keys → Live tab

# 2. .env file update karo
RAZORPAY_KEY_ID=rzp_live_xxxxxxx
RAZORPAY_KEY_SECRET=live_secret_xxxxx

# ⚠️ YEH LIVE KEYS HAI - REAL PAISA LEGA!
# Test keys (rzp_test_) ke baad live keys (rzp_live_) use karo
```

### Environment Variables

```bash
# .env (Final)
NODE_ENV=production
MONGODB_URI=mongodb://xxx
JWT_SECRET=xxxxx

# LIVE KEYS (Production)
RAZORPAY_KEY_ID=rzp_live_xxxxxxx
RAZORPAY_KEY_SECRET=live_secret_xxxxx
```

---

## 🎯 SUMMARY

**Payment Flow:**
1. User plan select → Order create
2. Modal open → Payment enter
3. Razorpay process → Signature return
4. Backend verify → Signature check
5. Database activate → Subscription active
6. User post job ✅

**Security:**
- ✅ HMAC-SHA256 signature verification
- ✅ Server-side payment verification
- ✅ Real Razorpay API calls
- ✅ No fake transactions

**Testing:**
- ✅ Test cards available
- ✅ No real money charged
- ✅ Instant confirmation

---

**Ab to bilkul clear ho gaya na? Koi confusion ho to pooch! 🚀**
