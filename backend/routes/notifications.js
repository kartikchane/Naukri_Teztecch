const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email notification helper
const sendEmailNotification = async (user, notification) => {
  try {
    const subject = notification.title;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">${notification.title}</h2>
        <p>${notification.message}</p>
        ${notification.description ? `<p>${notification.description}</p>` : ''}
        <div style="margin: 20px 0;">
          ${notification.actionUrl ? `
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${notification.actionUrl}"
               style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              View Details
            </a>
          ` : ''}
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from Teztech Naukri Platform
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@teztech.com',
      to: user.email,
      subject,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      read
    } = req.query;

    const query = { user: req.user._id };

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // Filter by read status if provided
    if (read !== undefined) {
      query.read = read === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('data.job', 'title company location salary')
      .populate('data.company', 'name logo')
      .populate('data.application', 'status')
      .populate('data.subscription', 'plan endDate')
      .populate('data.plan', 'displayName price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalNotifications: total,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/notifications
// @desc    Delete all notifications for user
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications/send-expiry-reminders
// @desc    Send plan expiration reminders (run as scheduled job)
// @access  Admin
router.post('/send-expiry-reminders', protect, isAdmin, async (req, res) => {
  try {
    // Find subscriptions expiring in 7 days
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const expiringSubscriptions = await Subscription.find({
      status: 'active',
      endDate: {
        $gte: new Date(),
        $lte: sevenDaysFromNow
      }
    }).populate('user').populate('plan');

    let sentCount = 0;

    for (let subscription of expiringSubscriptions) {
      // Check if notification already sent for this subscription
      const existingNotification = await Notification.findOne({
        user: subscription.user._id,
        type: 'plan_expiring_soon',
        'data.subscription': subscription._id
      });

      if (existingNotification) continue;

      // Create notification
      const notification = await Notification.create({
        user: subscription.user._id,
        type: 'plan_expiring_soon',
        title: `Your ${subscription.plan.displayName} plan is expiring soon`,
        message: `Your subscription will expire on ${new Date(subscription.endDate).toLocaleDateString()}. Renew now to keep posting jobs.`,
        description: `Plan: ${subscription.plan.displayName}\nExpiry Date: ${new Date(subscription.endDate).toLocaleDateString()}`,
        priority: 'high',
        data: { subscription: subscription._id, plan: subscription.plan._id },
        contactMethods: { email: true, sms: false, inApp: true },
        actionUrl: '/plans'
      });

      // Send email if enabled
      if (notification.contactMethods.email) {
        try {
          await sendEmailNotification(subscription.user, notification);
          notification.delivery.email.sent = true;
          notification.delivery.email.sentAt = new Date();
        } catch (emailError) {
          notification.delivery.email.failureReason = emailError.message;
        }
      }

      await notification.save();
      sentCount++;
    }

    res.json({
      message: `Sent ${sentCount} expiration reminder notifications`,
      sentCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/notifications/send-expired-reminders
// @desc    Send plan expired notifications (run as scheduled job)
// @access  Admin
router.post('/send-expired-reminders', protect, isAdmin, async (req, res) => {
  try {
    // Find subscriptions that just expired
    const expiredSubscriptions = await Subscription.find({
      status: 'active',
      endDate: {
        $lt: new Date()
      }
    }).populate('user').populate('plan');

    let sentCount = 0;

    for (let subscription of expiredSubscriptions) {
      // Update subscription status
      subscription.status = 'expired';
      await subscription.save();

      // Create notification
      const notification = await Notification.create({
        user: subscription.user._id,
        type: 'plan_expired',
        title: `Your ${subscription.plan.displayName} plan has expired`,
        message: `Your subscription has expired. Renew to continue posting jobs and accessing premium features.`,
        priority: 'critical',
        data: { subscription: subscription._id, plan: subscription.plan._id },
        contactMethods: { email: true, sms: false, inApp: true },
        actionUrl: '/plans'
      });

      // Send email
      try {
        await sendEmailNotification(subscription.user, notification);
        notification.delivery.email.sent = true;
        notification.delivery.email.sentAt = new Date();
      } catch (emailError) {
        notification.delivery.email.failureReason = emailError.message;
      }

      await notification.save();
      sentCount++;
    }

    res.json({
      message: `Marked ${sentCount} subscriptions as expired and sent notifications`,
      sentCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;