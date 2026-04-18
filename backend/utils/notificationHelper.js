const Notification = require('../models/Notification');
const Message = require('../models/Message');
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px;">
          <h2 style="margin: 0; font-size: 24px;">${notification.title}</h2>
        </div>
        <div style="padding: 20px;">
          <p style="margin: 0 0 15px 0; color: #333;">${notification.message}</p>
          ${notification.description ? `<p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">${notification.description}</p>` : ''}
          ${notification.actionUrl ? `
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${notification.actionUrl}"
               style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 15px;">
              View Details
            </a>
          ` : ''}
        </div>
        <div style="background: #f8f9fa; padding: 15px 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
          © Teztech Naukri Platform. This is an automated notification.
        </div>
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

// Notify when a new job is posted
const notifyJobPosted = async (job, employer) => {
  try {
    // Create in-app notification
    const notification = await Notification.create({
      user: employer._id,
      type: 'job_posted',
      title: 'Job Posted Successfully',
      message: `Your job "${job.title}" has been posted successfully!`,
      description: `Company: ${job.company}\nLocation: ${job.location}\nSalary: ${job.salary || 'Not specified'}`,
      priority: 'medium',
      data: { job: job._id },
      contactMethods: { email: true, sms: false, inApp: true },
      actionUrl: `/jobs/${job._id}`
    });

    // Send email
    if (notification.contactMethods.email) {
      try {
        await sendEmailNotification(employer, notification);
        notification.delivery.email.sent = true;
        notification.delivery.email.sentAt = new Date();
      } catch (emailError) {
        notification.delivery.email.failureReason = emailError.message;
      }
    }

    await notification.save();
    console.log(`Job posted notification sent for job: ${job._id}`);
  } catch (error) {
    console.error('Error notifying job posted:', error);
  }
};

// Notify employer when they receive an application
const notifyNewApplication = async (application, job, jobSeeker, employer) => {
  try {
    // Generate notification message
    const notificationMessage = `New application received from ${jobSeeker.name} for "${job.title}"`;

    // Create in-app notification
    const notification = await Notification.create({
      user: employer._id,
      type: 'job_application_received',
      title: 'New Application Received',
      message: notificationMessage,
      description: `Applicant: ${jobSeeker.name}\nEmail: ${jobSeeker.email}\nJob: ${job.title}`,
      priority: 'high',
      data: { application: application._id, job: job._id },
      contactMethods: { email: true, sms: false, inApp: true },
      actionUrl: `/employer/applicants/${job._id}`
    });

    // Send email
    if (notification.contactMethods.email) {
      try {
        await sendEmailNotification(employer, notification);
        notification.delivery.email.sent = true;
        notification.delivery.email.sentAt = new Date();
      } catch (emailError) {
        notification.delivery.email.failureReason = emailError.message;
      }
    }

    // Create automatic message to employer
    const autoMessage = await Message.create({
      sender: jobSeeker._id,
      receiver: employer._id,
      message: `Hi! I have applied for the "${job.title}" position at ${job.company}. Looking forward to hearing from you!`,
      type: 'application-update',
      application: application._id,
      job: job._id,
      metadata: {
        jobTitle: job.title,
        companyName: job.company,
        applicationStatus: 'applied'
      }
    });

    await notification.save();
    console.log(`Application notification sent for application: ${application._id}`);
  } catch (error) {
    console.error('Error notifying new application:', error);
  }
};

// Notify job seeker when application status changes
const notifyApplicationStatusChange = async (application, jobSeeker, job, newStatus) => {
  try {
    const statusMessages = {
      'accepted': 'Congratulations! Your application has been accepted!',
      'rejected': 'Thank you for applying. We regret to inform you that your application has not been selected.',
      'shortlisted': 'Great! Your application has been shortlisted. We will be in touch soon.',
      'interview': 'You have been invited for an interview!'
    };

    const message = statusMessages[newStatus] || `Your application status has been updated to: ${newStatus}`;
    const notificationType = newStatus === 'accepted' ? 'application_accepted' : 'application_status_change';

    // Create in-app notification
    const notification = await Notification.create({
      user: jobSeeker._id,
      type: notificationType,
      title: `Application Status Updated`,
      message: message,
      description: `Job: ${job.title}\nCompany: ${job.company}\nNew Status: ${newStatus.toUpperCase()}`,
      priority: newStatus === 'accepted' ? 'high' : 'medium',
      data: { application: application._id, job: job._id },
      contactMethods: { email: true, sms: false, inApp: true },
      actionUrl: `/applications/${application._id}`
    });

    // Send email
    if (notification.contactMethods.email) {
      try {
        await sendEmailNotification(jobSeeker, notification);
        notification.delivery.email.sent = true;
        notification.delivery.email.sentAt = new Date();
      } catch (emailError) {
        notification.delivery.email.failureReason = emailError.message;
      }
    }

    await notification.save();
    console.log(`Application status notification sent for application: ${application._id}`);
  } catch (error) {
    console.error('Error notifying application status change:', error);
  }
};

// Notify when interview is scheduled
const notifyInterviewScheduled = async (jobSeeker, employer, job, interviewDate, interviewType) => {
  try {
    const notification = await Notification.create({
      user: jobSeeker._id,
      type: 'interview_scheduled',
      title: 'Interview Scheduled!',
      message: `Your interview for "${job.title}" has been scheduled!`,
      description: `Date & Time: ${new Date(interviewDate).toLocaleString()}\nType: ${interviewType}\nCompany: ${job.company}`,
      priority: 'high',
      data: { job: job._id },
      contactMethods: { email: true, sms: false, inApp: true },
      metadata: {
        jobTitle: job.title,
        companyName: job.company,
        interviewDate: interviewDate,
        interviewType: interviewType
      }
    });

    // Send email
    if (notification.contactMethods.email) {
      try {
        await sendEmailNotification(jobSeeker, notification);
        notification.delivery.email.sent = true;
        notification.delivery.email.sentAt = new Date();
      } catch (emailError) {
        notification.delivery.email.failureReason = emailError.message;
      }
    }

    // Create message notification
    const message = await Message.create({
      sender: employer._id,
      receiver: jobSeeker._id,
      message: `Your interview for "${job.title}" is scheduled on ${new Date(interviewDate).toLocaleString()}. Please confirm your availability.`,
      type: 'interview-schedule',
      job: job._id,
      metadata: {
        jobTitle: job.title,
        companyName: job.company,
        interviewDate: interviewDate,
        interviewType: interviewType
      }
    });

    await notification.save();
    console.log(`Interview scheduled notification sent for job: ${job._id}`);
  } catch (error) {
    console.error('Error notifying interview scheduled:', error);
  }
};

// Notify when new message received
const notifyMessageReceived = async (sender, receiver, messageContent) => {
  try {
    const notification = await Notification.create({
      user: receiver._id,
      type: 'message',
      title: `Message from ${sender.name}`,
      message: messageContent.substring(0, 100) + (messageContent.length > 100 ? '...' : ''),
      priority: 'high',
      data: {},
      contactMethods: { email: false, sms: false, inApp: true },
      actionUrl: `/messages/${sender._id}`
    });

    await notification.save();
  } catch (error) {
    console.error('Error notifying message received:', error);
  }
};

module.exports = {
  notifyJobPosted,
  notifyNewApplication,
  notifyApplicationStatusChange,
  notifyInterviewScheduled,
  notifyMessageReceived,
  sendEmailNotification
};
