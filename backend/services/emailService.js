const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

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

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error.message);
  } else {
    console.log('✅ Email service ready: ', success);
  }
});

// Generic email HTML template
const getEmailTemplate = (title, message, details, actionUrl, actionText = 'View Details') => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">${title}</h1>
      </div>

      <!-- Body -->
      <div style="padding: 30px 20px;">
        <p style="margin: 0 0 20px 0; color: #333; font-size: 16px; line-height: 1.6;">${message}</p>

        ${details ? `
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            ${details}
          </div>
        ` : ''}

        ${actionUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}${actionUrl}"
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; transition: transform 0.2s;">
              ${actionText}
            </a>
          </div>
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; text-align: center;">
        <p style="margin: 0 0 10px 0;">© Teztech Naukri Platform - Your Job Portal</p>
        <p style="margin: 0; color: #999;">This is an automated notification. Please do not reply to this email.</p>
      </div>
    </div>
  `;
};

// Email Service Class
class EmailService {

  // Send generic email
  static async sendEmail(to, subject, htmlContent) {
    try {
      console.log(`📧 Sending email to: ${to}`);

      const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@teztech.com',
        to,
        subject,
        html: htmlContent
      });

      console.log(`✅ Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      console.error(`❌ Error sending email to ${to}:`, error.message);
      throw error;
    }
  }

  // 1️⃣ COMPANY CREATED - Email to Employer
  static async companyCretedEmail(employer, company) {
    try {
      const htmlContent = getEmailTemplate(
        '🎉 Company Profile Created!',
        `Welcome to Teztech Naukri Platform, ${employer.name}!<br><br>Your company profile has been successfully created. Now you need to upload required documents for verification so you can start posting jobs.`,
        `
          <p style="margin: 10px 0;"><strong>Company Name:</strong> ${company.name}</p>
          <p style="margin: 10px 0;"><strong>Industry:</strong> ${company.industry}</p>
          <p style="margin: 10px 0;"><strong>Location:</strong> ${company.location?.city}, ${company.location?.state}, ${company.location?.country}</p>
          <p style="margin: 10px 0; color: #d97706;"><strong>⚠️ Next Step:</strong> Upload company documents for verification (24-48 hours)</p>
        `,
        '/company-profile',
        'Complete Your Profile'
      );

      await this.sendEmail(employer.email, '🎉 Welcome to Naukri Platform - Company Created', htmlContent);
      console.log(`✅ Company created email sent to ${employer.email}`);
    } catch (error) {
      console.error('❌ Error sending company created email:', error);
    }
  }

  // 2️⃣ DOCUMENT VERIFICATION STATUS - Email to Employer
  static async verificationStatusEmail(employer, company, status, rejectionReason = '', adminNotes = '') {
    try {
      let title, message, details, bgColor;

      if (status === 'verified') {
        title = '✅ Company Verified!';
        message = `Great news! Your company "${company.name}" has been verified by our admin team. You can now start posting jobs on our platform.`;
        details = `
          <p style="margin: 10px 0; color: #059669;"><strong>✅ Status:</strong> VERIFIED</p>
          <p style="margin: 10px 0;"><strong>What's Next:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Post your first job</li>
            <li>Review incoming applications</li>
            <li>Connect with talented candidates</li>
          </ul>
        `;
        bgColor = '#d1fae5';
      } else if (status === 'rejected') {
        title = '❌ Verification Not Approved';
        message = `We're unable to verify your company at this moment. Please review the feedback below and resubmit your documents.`;
        details = `
          <p style="margin: 10px 0; color: #dc2626;"><strong>❌ Status:</strong> REJECTED</p>
          <p style="margin: 10px 0;"><strong>Rejection Reason:</strong></p>
          <p style="margin: 10px 0; color: #dc2626;">${rejectionReason}</p>
          ${adminNotes ? `<p style="margin: 10px 0;"><strong>Admin Notes:</strong> ${adminNotes}</p>` : ''}
          <p style="margin: 10px 0; color: #d97706;"><strong>⚠️ Action Required:</strong> Please update your documents and resubmit</p>
        `;
        bgColor = '#fee2e2';
      } else {
        title = '⏳ Verification Under Review';
        message = `Your company documents are currently under review by our admin team. We'll notify you as soon as the verification is complete.`;
        details = `
          <p style="margin: 10px 0; color: #d97706;"><strong>⏳ Status:</strong> PENDING REVIEW</p>
          <p style="margin: 10px 0;"><strong>Expected Time:</strong> 24-48 hours</p>
          ${adminNotes ? `<p style="margin: 10px 0;"><strong>Admin Notes:</strong> ${adminNotes}</p>` : ''}
        `;
        bgColor = '#fef3c7';
      }

      const htmlContent = getEmailTemplate(
        title,
        message,
        `<div style="background: ${bgColor}; padding: 15px; border-radius: 6px; border-left: 4px solid ${bgColor};">${details}</div>`,
        status === 'verified' ? '/post-job' : '/company-profile',
        status === 'verified' ? 'Post Your First Job' : 'View Feedback'
      );

      await this.sendEmail(
        employer.email,
        `${title} - Company Verification`,
        htmlContent
      );
      console.log(`✅ Verification status email sent to ${employer.email}`);
    } catch (error) {
      console.error('❌ Error sending verification email:', error);
    }
  }

  // 3️⃣ JOB POSTED CONFIRMATION - Email to Employer
  static async jobPostedEmail(employer, job) {
    try {
      const htmlContent = getEmailTemplate(
        '✅ Job Posted Successfully!',
        `Your job posting is now live on Naukri Platform. Job seekers can now view and apply for this position.`,
        `
          <p style="margin: 10px 0;"><strong>📋 Job Title:</strong> ${job.title}</p>
          <p style="margin: 10px 0;"><strong>🏢 Company:</strong> ${job.company?.name || 'Your Company'}</p>
          <p style="margin: 10px 0;"><strong>📍 Location:</strong> ${job.location?.city}, ${job.location?.state}</p>
          <p style="margin: 10px 0;"><strong>💼 Type:</strong> ${job.employmentType}</p>
          <p style="margin: 10px 0;"><strong>💰 Salary:</strong> ₹${job.salary?.min?.toLocaleString('en-IN')} - ₹${job.salary?.max?.toLocaleString('en-IN')}</p>
          <p style="margin: 10px 0;"><strong>⏰ Applications Close:</strong> ${job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Open'}</p>
        `,
        `/employer/jobs/${job._id}`,
        'View Your Job'
      );

      await this.sendEmail(
        employer.email,
        '✅ Job Posted - ' + job.title,
        htmlContent
      );
      console.log(`✅ Job posted email sent to ${employer.email}`);
    } catch (error) {
      console.error('❌ Error sending job posted email:', error);
    }
  }

  // 4️⃣ NEW JOB NOTIFICATION - Email to ALL Job Seekers
  static async newJobNotificationEmail(jobSeekers, job) {
    try {
      const htmlContent = getEmailTemplate(
        `🎯 New ${job.title} Position Posted!`,
        `A new job that matches your profile has been posted on Naukri Platform. Review the details and apply now!`,
        `
          <p style="margin: 10px 0;"><strong>📋 Job Title:</strong> ${job.title}</p>
          <p style="margin: 10px 0;"><strong>🏢 Company:</strong> ${job.company?.name || 'A top company'}</p>
          <p style="margin: 10px 0;"><strong>📍 Location:</strong> ${job.location?.city}, ${job.location?.state}</p>
          <p style="margin: 10px 0;"><strong>💼 Type:</strong> ${job.employmentType} | ${job.workMode}</p>
          <p style="margin: 10px 0;"><strong>💰 Salary:</strong> ₹${job.salary?.min?.toLocaleString('en-IN')} - ₹${job.salary?.max?.toLocaleString('en-IN')} ${job.salary?.period || 'per annum'}</p>
          <p style="margin: 10px 0;"><strong>📚 Experience Required:</strong> ${job.experience?.min} - ${job.experience?.max} years</p>
        `,
        `/jobs/${job._id}`,
        'View & Apply Now'
      );

      // Send to each job seeker
      for (const seeker of jobSeekers) {
        try {
          await this.sendEmail(
            seeker.email,
            `🎯 New Job: ${job.title} at ${job.company?.name}`,
            htmlContent
          );
        } catch (error) {
          console.error(`❌ Failed to send email to ${seeker.email}:`, error.message);
        }
      }
      console.log(`✅ New job notifications sent to ${jobSeekers.length} job seekers`);
    } catch (error) {
      console.error('❌ Error sending job notification emails:', error);
    }
  }

  // 5️⃣ APPLICATION RECEIVED - Email to Employer
  static async applicationReceivedEmail(employer, applicant, job) {
    try {
      const htmlContent = getEmailTemplate(
        '🎯 New Application Received!',
        `${applicant.name} has applied for your job posting "${job.title}". Review their profile and CV to decide.`,
        `
          <p style="margin: 10px 0;"><strong>👤 Applicant Name:</strong> ${applicant.name}</p>
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${applicant.email}</p>
          <p style="margin: 10px 0;"><strong>📱 Phone:</strong> ${applicant.phone || 'Not provided'}</p>
          <p style="margin: 10px 0;"><strong>📋 Applied For:</strong> ${job.title}</p>
          <p style="margin: 10px 0;"><strong>📅 Applied On:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
        `,
        `/employer/applicants/${job._id}`,
        'Review Application'
      );

      await this.sendEmail(
        employer.email,
        `🎯 New Application for ${job.title}`,
        htmlContent
      );
      console.log(`✅ Application received email sent to ${employer.email}`);
    } catch (error) {
      console.error('❌ Error sending application received email:', error);
    }
  }

  // 6️⃣ APPLICATION SUBMITTED CONFIRMATION - Email to Job Seeker
  static async applicationSubmittedEmail(jobSeeker, job, company) {
    try {
      const htmlContent = getEmailTemplate(
        '✅ Application Submitted Successfully!',
        `Your application for "${job.title}" has been successfully submitted to ${company.name}. The employer will review your profile and get back to you soon.`,
        `
          <p style="margin: 10px 0;"><strong>📋 Job Title:</strong> ${job.title}</p>
          <p style="margin: 10px 0;"><strong>🏢 Company:</strong> ${company.name}</p>
          <p style="margin: 10px 0;"><strong>📍 Location:</strong> ${job.location?.city}, ${job.location?.state}</p>
          <p style="margin: 10px 0;"><strong>📧 Employer Email:</strong> ${company.contactInfo?.registeredEmail || 'Will be shared soon'}</p>
          <p style="margin: 10px 0; color: #059669;"><strong>✅ Status:</strong> APPLIED</p>
          <p style="margin: 10px 0; color: #d97706;"><strong>💡 Tip:</strong> Check your email regularly for updates from the employer</p>
        `,
        `/applications`,
        'View My Applications'
      );

      await this.sendEmail(
        jobSeeker.email,
        `✅ Application Submitted - ${job.title}`,
        htmlContent
      );
      console.log(`✅ Application submitted email sent to ${jobSeeker.email}`);
    } catch (error) {
      console.error('❌ Error sending application submitted email:', error);
    }
  }

  // 7️⃣ APPLICATION STATUS UPDATE - Email to Job Seeker
  static async applicationStatusEmail(jobSeeker, job, company, status, notes = '') {
    try {
      let title, message, statusColor, statusEmoji;

      const statusMap = {
        'accepted': { emoji: '🎉', title: 'Congratulations! Application Accepted', color: '#059669', color2: '#10b981' },
        'rejected': { emoji: '😞', title: 'Application Not Selected', color: '#dc2626', color2: '#ef4444' },
        'shortlisted': { emoji: '⭐', title: 'Great! Application Shortlisted', color: '#2563eb', color2: '#3b82f6' },
        'interview': { emoji: '📞', title: 'Interview Scheduled!', color: '#7c3aed', color2: '#8b5cf6' },
        'holding': { emoji: '⏳', title: 'Application Under Review', color: '#d97706', color2: '#f59e0b' }
      };

      const statusInfo = statusMap[status] || { emoji: '📋', title: 'Application Status Updated', color: '#6b7280', color2: '#9ca3af' };

      let statusDetails = '';
      if (status === 'accepted') {
        statusDetails = `
          <p style="margin: 10px 0; color: ${statusInfo.color};"><strong>${statusInfo.emoji} Congratulations!</strong></p>
          <p style="margin: 10px 0;">Your application has been accepted by ${company.name}. The employer will contact you soon with further details.</p>
          ${notes ? `<p style="margin: 10px 0;"><strong>Message from Employer:</strong> ${notes}</p>` : ''}
        `;
      } else if (status === 'rejected') {
        statusDetails = `
          <p style="margin: 10px 0; color: ${statusInfo.color};"><strong>${statusInfo.emoji} Thank you for applying!</strong></p>
          <p style="margin: 10px 0;">We appreciate your interest, but unfortunately your application hasn't been selected at this time.</p>
          ${notes ? `<p style="margin: 10px 0;"><strong>Feedback:</strong> ${notes}</p>` : ''}
          <p style="margin: 10px 0; color: #059669;"><strong>💡 Keep trying!</strong> Browse more jobs and apply today.</p>
        `;
      } else if (status === 'shortlisted') {
        statusDetails = `
          <p style="margin: 10px 0; color: ${statusInfo.color};"><strong>${statusInfo.emoji} Great News!</strong></p>
          <p style="margin: 10px 0;">Your application has been shortlisted! The employer will contact you soon for the next round.</p>
          ${notes ? `<p style="margin: 10px 0;"><strong>Message:</strong> ${notes}</p>` : ''}
        `;
      } else if (status === 'interview') {
        statusDetails = `
          <p style="margin: 10px 0; color: ${statusInfo.color};"><strong>${statusInfo.emoji} Interview Invitation!</strong></p>
          <p style="margin: 10px 0;">You've been invited for an interview with ${company.name}.</p>
          ${notes ? `<p style="margin: 10px 0;"><strong>Interview Details:</strong> ${notes}</p>` : ''}
          <p style="margin: 10px 0; color: #059669;"><strong>📅 Prepare well!</strong> Good luck with your interview.</p>
        `;
      } else {
        statusDetails = `
          <p style="margin: 10px 0;"><strong>Status:</strong> ${status}</p>
          ${notes ? `<p style="margin: 10px 0;"><strong>Details:</strong> ${notes}</p>` : ''}
        `;
      }

      const htmlContent = getEmailTemplate(
        `${statusInfo.emoji} ${statusInfo.title}`,
        `Your application status for "${job.title}" at ${company.name} has been updated.`,
        `
          <div style="background: linear-gradient(135deg, ${statusInfo.color} 0%, ${statusInfo.color2} 100%); padding: 15px; border-radius: 6px; border-left: 4px solid ${statusInfo.color}; color: white;">
            ${statusDetails}
          </div>
          <p style="margin: 15px 0;"><strong>📋 Job Details:</strong></p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Job: ${job.title}</li>
            <li>Company: ${company.name}</li>
            <li>Location: ${job.location?.city}, ${job.location?.state}</li>
          </ul>
        `,
        `/applications`,
        'View Application'
      );

      await this.sendEmail(
        jobSeeker.email,
        `${statusInfo.emoji} ${statusInfo.title} - ${job.title}`,
        htmlContent
      );
      console.log(`✅ Application status email sent to ${jobSeeker.email}`);
    } catch (error) {
      console.error('❌ Error sending application status email:', error);
    }
  }

  // Test Email
  static async sendTestEmail(toEmail) {
    try {
      const htmlContent = getEmailTemplate(
        '📧 Test Email from Naukri Platform',
        'This is a test email to verify your email configuration is working correctly.',
        '<p style="margin: 10px 0; color: #059669;"><strong>✅ If you received this, your email service is working!</strong></p>',
        null
      );

      await this.sendEmail(
        toEmail,
        '📧 Test Email - Naukri Platform',
        htmlContent
      );
      console.log(`✅ Test email sent to ${toEmail}`);
      return { success: true, message: 'Test email sent successfully' };
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      return { success: false, message: error.message };
    }
  }
}

module.exports = EmailService;
