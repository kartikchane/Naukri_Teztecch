const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  
  // Create notification for new job posting
  static async createJobNotification(job) {
    try {
      // Get all job seekers who might be interested
      const jobSeekers = await User.find({ 
        role: 'job_seeker',
        // Add more filters based on user preferences if needed
      }).select('_id name email');

      // Filter users based on job criteria (optional - can be enhanced)
      const interestedUsers = await this.filterInterestedUsers(jobSeekers, job);

      // Create notifications for interested users
      const notifications = interestedUsers.map(user => ({
        user: user._id,
        type: 'job_posted',
        title: 'New Job Posted',
        message: `A new ${job.title} position is available at ${job.company?.name || 'a company'} in ${job.location?.city || 'your area'}`,
        data: {
          job: job._id,
          company: job.company
        }
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} job notifications for job: ${job.title}`);
      }

      return notifications.length;
    } catch (error) {
      console.error('Error creating job notifications:', error);
      throw error;
    }
  }

  // Filter users based on job requirements and user preferences
  static async filterInterestedUsers(users, job) {
    // For now, return all job seekers
    // This can be enhanced to filter by:
    // - User's preferred job categories
    // - Location preferences
    // - Skill matching
    // - Experience level
    // - Salary expectations
    
    return users;
  }

  // Create application status notification
  static async createApplicationStatusNotification(application, status) {
    try {
      const notification = await Notification.create({
        user: application.applicant,
        type: 'application_status',
        title: 'Application Status Update',
        message: `Your application for ${application.job?.title || 'a position'} has been ${status}`,
        data: {
          application: application._id,
          job: application.job,
          company: application.job?.company
        }
      });

      console.log(`Created application status notification for user: ${application.applicant}`);
      return notification;
    } catch (error) {
      console.error('Error creating application status notification:', error);
      throw error;
    }
  }

  // Create deadline reminder notification
  static async createDeadlineReminder(job) {
    try {
      // Get users who might be interested but haven't applied yet
      const jobSeekers = await User.find({ 
        role: 'job_seeker'
      }).select('_id');

      const notifications = jobSeekers.map(user => ({
        user: user._id,
        type: 'deadline_reminder',
        title: 'Application Deadline Approaching',
        message: `The application deadline for ${job.title} at ${job.company?.name} is approaching. Apply before ${new Date(job.applicationDeadline).toLocaleDateString()}`,
        data: {
          job: job._id,
          company: job.company
        }
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
        console.log(`Created ${notifications.length} deadline reminder notifications`);
      }

      return notifications.length;
    } catch (error) {
      console.error('Error creating deadline reminders:', error);
      throw error;
    }
  }

  // Get unread notification count for user
  static async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        user: userId,
        read: false
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

module.exports = NotificationService;