const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   POST /api/messages/send
// @desc    Send a message
// @access  Private
router.post('/send', protect, [
  body('receiverId').notEmpty().withMessage('Receiver ID is required'),
  body('message').notEmpty().withMessage('Message is required').trim(),
  body('type').optional().isIn(['text', 'job-posting', 'application-update', 'offer', 'rejection', 'interview-schedule'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiverId, message, type = 'text', jobId, applicationId, metadata } = req.body;

    // Verify receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    // Cannot send message to self
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    // Create message
    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
      type,
      job: jobId || null,
      application: applicationId || null,
      metadata: metadata || {}
    });

    // Populate sender details
    await newMessage.populate('sender', 'name email avatar role');

    // Create notification for receiver
    await Notification.create({
      user: receiverId,
      type: 'message',
      title: `New message from ${req.user.name}`,
      message: message.substring(0, 100),
      priority: 'high',
      data: { application: applicationId, job: jobId },
      contactMethods: { email: true, sms: true, inApp: true },
      actionUrl: `/messages/${req.user._id}`
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/messages/conversations
// @desc    Get all conversations for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    // Get unique users the current user has messaged with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: require('mongoose').Types.ObjectId(req.user._id) },
            { receiver: require('mongoose').Types.ObjectId(req.user._id) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            sender: '$sender',
            receiver: '$receiver'
          },
          lastMessage: { $first: '$$ROOT' },
          messageCount: { $sum: 1 }
        }
      }
    ]);

    // Populate user details for each conversation
    for (let conv of conversations) {
      const otherUserId = conv._id.sender.toString() === req.user._id.toString()
        ? conv._id.receiver
        : conv._id.sender;

      const otherUser = await User.findById(otherUserId).select('name email avatar role');
      conv.otherUser = otherUser;
    }

    res.json({
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get messages between current user and another user
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name email avatar role')
      .populate('receiver', 'name email avatar role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Mark messages as read
    await Message.updateMany(
      {
        receiver: req.user._id,
        sender: userId,
        status: { $ne: 'read' }
      },
      {
        $set: { status: 'read', readAt: new Date() }
      }
    );

    res.json({
      count: messages.length,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.status = 'read';
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Message.findByIdAndDelete(req.params.id);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread message count for current user
// @access  Private
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      status: { $ne: 'read' }
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

module.exports = router;
