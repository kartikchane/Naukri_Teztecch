const Job = require('../models/Job');

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
const startJobExpirationChecker = () => {
  // Run immediately on startup
  closeExpiredJobs();
  
  // Then run every hour
  setInterval(() => {
    closeExpiredJobs();
  }, 60 * 60 * 1000); // 1 hour in milliseconds

  console.log('Job expiration checker started (runs every hour)');
};

module.exports = {
  closeExpiredJobs,
  startJobExpirationChecker
};
