
const Job = require('../models/Job');
const NotificationService = require('../services/notificationService');

/**
 * Automatically close jobs whose application deadline has passed
 */
const closeExpiredJobs = async () => {
  try {
    const now = new Date();
    
    const result = await Job.updateMany(
      {
        status: 'Open',
        applicationDeadline: { $exists: true, $ne: null, $lt: now }
      },
      {
        $set: { status: 'Closed' }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`Closed ${result.modifiedCount} expired job(s)`);
    }

    return result.modifiedCount;
  } catch (error) {
    console.error('Error closing expired jobs:', error);
    return 0;
  }
};

/**
 * Start periodic check for expired jobs (runs every hour)
 */

/**
 * Start periodic check for expired jobs and deadline reminders (runs every hour)
 */
const startJobExpirationChecker = () => {
  // Run immediately on startup
  closeExpiredJobs();
  sendDeadlineReminders();

  // Then run every hour
  setInterval(() => {
    closeExpiredJobs();
    sendDeadlineReminders();
  }, 60 * 60 * 1000); // 1 hour in milliseconds

  console.log('Job expiration checker and deadline reminder started (runs every hour)');
};

/**
 * Send deadline reminder notifications for jobs with deadlines within 24 hours
 */
const sendDeadlineReminders = async () => {
  try {
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    // Find open jobs with a deadline within the next 24 hours and not already passed
    const jobs = await Job.find({
      status: 'Open',
      applicationDeadline: { $gte: now, $lte: in24h }
    }).populate('company');

    for (const job of jobs) {
      // Optionally: prevent duplicate reminders by checking if a reminder already exists for this job and user
      await NotificationService.createDeadlineReminder(job);
    }
    if (jobs.length > 0) {
      console.log(`Sent deadline reminders for ${jobs.length} job(s)`);
    }
  } catch (error) {
    console.error('Error sending deadline reminders:', error);
  }
};

module.exports = {
  closeExpiredJobs,
  startJobExpirationChecker
};
