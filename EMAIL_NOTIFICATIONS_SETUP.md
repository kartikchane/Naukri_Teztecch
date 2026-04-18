# Email Notifications - Complete Setup

## Overview
Email notifications are now fully configured and sent to employers and job seekers for all key platform events.

## Email Notifications Configured

### 1. ✅ Job Posted Notification

**When:** Right after job is posted by employer
**Who Receives:**
- **Employer** - Confirmation email that job was posted successfully
- **All Job Seekers** - Notification about new job opening

**Email Details:**
```
From: hr@teztecch.com
Subject: "[Job Title] Job Posted Successfully" (Employer)
         "New [Job Title] Job Posted" (Job Seekers)
Content: 
  - Job title and company name
  - Location details
  - Salary range
  - Employment type
  - Action button to view job details
```

**Flow:**
```
Employer posts job
    ↓
Job created in database
    ↓
Email 1: notifyJobPosted() → Employer gets confirmation
    ↓
Email 2: sendEmailNotification() → All job seekers get notification
```

---

### 2. ✅ Company Created Notification

**When:** Right after company profile is created
**Who Receives:**
- **Employer** - Welcome email

**Email Details:**
```
From: hr@teztecch.com
Subject: "Company Profile Created"
Content:
  - Welcome message
  - Company name confirmation
  - Next step: Upload documents for verification
  - Action button to company profile
```

**Flow:**
```
Employer creates company
    ↓
Company saved to database
    ↓
Email: sendEmailNotification() → Employer gets confirmation
    ↓
Message: Upload documents for verification
```

---

### 3. ✅ Application Received Notification

**When:** Right after job seeker applies for a job
**Who Receives:**
- **Employer** - Alert about new application

**Email Details:**
```
From: hr@teztecch.com
Subject: "New Application Received"
Content:
  - Applicant name and email
  - Job title they applied for
  - Coverage letter (if provided)
  - Applicant phone number
  - Action button to view applicants
```

**Flow:**
```
Job seeker applies for job
    ↓
Application created
    ↓
Email: notifyNewApplication() → Employer gets alert
    ↓
In-app message: Auto-created conversation with applicant
```

---

### 4. ✅ Application Status Change Notification

**When:** Employer updates application status (accepted, rejected, shortlisted, interview)
**Who Receives:**
- **Job Seeker** - Status update email

**Email Details:**
```
From: hr@teztecch.com
Subject: "Application Status Updated"
Content (depends on status):
  
  ACCEPTED:
    🎉 Congratulations! Your application has been accepted!
    
  REJECTED:
    Thank you for applying. We regret to inform you that your 
    application has not been selected.
    
  SHORTLISTED:
    Great! Your application has been shortlisted. 
    We will be in touch soon.
    
  INTERVIEW:
    You have been invited for an interview!

Additional Info:
  - Job title
  - Company name
  - Application status
  - Action button to view status
```

**Flow:**
```
Employer updates application status
    ↓
Application status saved
    ↓
Email: notifyApplicationStatusChange() → Job seeker gets update
    ↓
In-app notification: Created for job seeker
```

---

## Email Configuration

### Environment Variables Required (.env)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=hr@teztecch.com
```

### Gmail Setup (Recommended)
1. Enable 2-Factor Authentication in Gmail
2. Generate App Password from Google Account
3. Use App Password in EMAIL_PASSWORD

### Using Other Email Services
- **Gmail:** SMTP: smtp.gmail.com, Port: 587
- **Outlook:** SMTP: smtp.outlook.com, Port: 587
- **Custom:** Update SMTP_HOST and SMTP_PORT

---

## Email Template

All emails use the following HTML template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px;">
    <h2>${notification.title}</h2>
  </div>
  <div style="padding: 20px;">
    <p>${notification.message}</p>
    ${notification.description ? `<p style="color: #666; font-size: 14px;">${notification.description}</p>` : ''}
    ${notification.actionUrl ? `<a href="${FRONTEND_URL}${notification.actionUrl}">View Details</a>` : ''}
  </div>
  <div style="background: #f8f9fa; padding: 15px 20px; border-top: 1px solid #ddd; font-size: 12px;">
    © Teztech Naukri Platform. Automated notification.
  </div>
</div>
```

---

## How It Works

### Email Service Architecture

```
Event (Job Posted / Application Created / Status Updated)
    ↓
Route Handler (POST /jobs, POST /applications, PUT /applications/:id/status)
    ↓
Database Action (Save to DB)
    ↓
Notification Trigger
    ├─ Create In-App Notification (Notification model)
    └─ Send Email (notificationHelper.js → nodemailer)
         ├─ notifyJobPosted()
         ├─ notifyNewApplication()
         ├─ notifyApplicationStatusChange()
         └─ sendEmailNotification() (Generic email sender)
    ↓
User Email Inbox
```

---

## Testing Email Notifications

### 1. Test Job Posted Email
```
1. Login as Employer
2. Create Company (if not exists)
3. Go to /post-job
4. Fill all details and submit
5. Check email inbox for confirmation
6. Job seekers should also receive email
```

### 2. Test Company Created Email
```
1. Login as new Employer
2. Go to /create-company
3. Fill company details and submit
4. Check inbox for confirmation email
```

### 3. Test Application Email
```
1. Login as Job Seeker
2. Find a job and click Apply
3. Submit application
4. Employer should receive email notification
```

### 4. Test Status Change Email
```
1. Login as Employer
2. Go to EmployerApplicants or Applications
3. Find an application
4. Update status to Accepted/Rejected
5. Job seeker should receive status update email
```

---

## Troubleshooting

### Emails Not Sending

**Check 1: Email Credentials**
```
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Test credentials with: 
  node -e "require('nodemailer').createTransport({...}).verify()"
```

**Check 2: Gmail App Password**
- Make sure 2FA is enabled
- Generate new App Password
- Use 16-character password (without spaces)

**Check 3: Server Logs**
```
Backend should show:
- "Email sent to employer for job: [jobId]"
- "Application email sent to employer: [email]"
- "Status change email sent to applicant: [email]"
```

**Check 4: Network**
- Check if port 587 is open (SMTP)
- May be blocked by ISP or firewall

### Email Not Received

1. Check spam/junk folder
2. Verify recipient email is correct in database
3. Check server logs for errors
4. Test with simple mail first:
```javascript
transporter.sendMail({
  from: 'test@example.com',
  to: 'recipient@example.com',
  subject: 'Test',
  text: 'Test email'
});
```

---

## Notifications Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│         EMPLOYER ACTIONS → EMAIL FLOWS                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. Create Company                                       │
│     ↓                                                     │
│     Email: "Company Profile Created"                    │
│     To: Employer                                         │
│                                                           │
│  2. Post Job                                             │
│     ↓                                                     │
│     Email: "Job Posted Successfully"                    │
│     To: Employer + All Job Seekers                      │
│                                                           │
│  3. Receive Application                                  │
│     ↓                                                     │
│     Email: "New Application Received"                   │
│     To: Employer                                         │
│                                                           │
│  4. Update Application Status                            │
│     ↓                                                     │
│     Email: "Application Status Updated"                 │
│     To: Job Seeker                                       │
│                                                           │
│  5. Schedule Interview                                   │
│     ↓                                                     │
│     Email: "Interview Scheduled"                        │
│     To: Job Seeker                                       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Database Models

Notifications are stored in MongoDB with this structure:

```javascript
{
  _id: ObjectId,
  user: ObjectId,           // Recipient
  type: String,             // 'job_posted', 'application_received', etc.
  title: String,            // Email subject
  message: String,          // Email body
  description: String,      // Additional details
  priority: String,         // 'high', 'medium', 'low'
  data: Object,             // Related document IDs
  contactMethods: {
    email: Boolean,         // Send email?
    sms: Boolean,          // SMS (future)
    inApp: Boolean         // In-app notification
  },
  delivery: {
    email: {
      sent: Boolean,
      sentAt: Date,
      failureReason: String
    }
  },
  actionUrl: String,        // Button link in email
  read: Boolean,           // For in-app notifications
  createdAt: Date,
  updatedAt: Date
}
```

---

## Future Enhancements

- [ ] SMS notifications
- [ ] Notification preferences (user can opt-in/out)
- [ ] Scheduled reminders (apply deadline, follow up)
- [ ] Email templates customization by admin
- [ ] Real-time WebSocket notifications
- [ ] Digest emails (daily/weekly summary)
- [ ] Multiple language support
- [ ] Unsubscribe links in emails
