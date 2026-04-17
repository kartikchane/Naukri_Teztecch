# 📧 Complete Email Notification System - Real Time

## 🎯 System Overview

Comprehensive email notification system that sends real-time emails to employers and job seekers for every key platform action.

---

## 📬 COMPLETE EMAIL FLOW

### 1️⃣ EMPLOYER JOURNEY - EMAILS RECEIVED

#### A. Company Creation → Email to Employer
```
TIMING: Immediately when company profile is created
TO: Employer's registered email
TEMPLATE: Welcome email
CONTAINS:
  ✓ Company name confirmation
  ✓ Industry & Location
  ✓ Next step: Upload documents
  ✓ Button: "Complete Your Profile"
PURPOSE: Welcome employer + remind about verification
```

#### B. Company Verification Status → Email to Employer
```
TIMING: Immediately when admin verifies/rejects
TO: Employer's email
TEMPLATES (3 variations):

  VERIFIED:
    ✓ Congratulation message
    ✓ Permission to post jobs
    ✓ Button: "Post Your First Job"
    ✓ What's next steps

  REJECTED:
    ✓ Rejection reason
    ✓ Admin feedback
    ✓ Required fixes
    ✓ Button: "Resubmit Documents"

  PENDING:
    ✓ Under review notification
    ✓ Expected timeline (24-48 hrs)
    ✓ Keep checking message
```

#### C. Job Posted Successfully → Email to Employer
```
TIMING: Immediately when job is posted
TO: Employer's email
CONTAINS:
  ✓ Job title & confirmation
  ✓ Company name
  ✓ Location, type, salary
  ✓ Application deadline
  ✓ Button: "View Your Job"
PURPOSE: Confirmation + track job posting
```

#### D. Application Received → Email to Employer
```
TIMING: Immediately when job seeker applies
TO: Employer's email
SENT FOR: Every new application
CONTAINS:
  ✓ Applicant name
  ✓ Applicant email & phone
  ✓ Job title they applied for
  ✓ Application date
  ✓ Button: "Review Application"
PURPOSE: Alert employer about new applicants
```

---

### 2️⃣ JOB SEEKER JOURNEY - EMAILS RECEIVED

#### A. New Job Posted → Emails to ALL Job Seekers
```
TIMING: Immediately when employer posts job
TO: All registered job seekers
FREQUENCY: One email per job posting (to all seekers)
CONTAINS:
  ✓ Job title
  ✓ Company name
  ✓ Location, employment type, work mode
  ✓ Salary range
  ✓ Experience required
  ✓ Button: "View & Apply Now"
PURPOSE: Job opportunity notification
```

#### B. Application Submitted → Email to Job Seeker
```
TIMING: Immediately after job seeker submits application
TO: Job seeker's email
CONTAINS:
  ✓ Confirmation message
  ✓ Job title confirmation
  ✓ Company name
  ✓ Status: APPLIED
  ✓ What to expect next
  ✓ Button: "View My Applications"
PURPOSE: Confirmation + manage expectations
```

#### C. Application Status Changed → Email to Job Seeker

**C1. ACCEPTED**
```
TIMING: Immediately when employer marks as "accepted"
TO: Job seeker's email
EMOJI: 🎉
MESSAGE: Congratulations! Your application has been accepted!
CONTAINS:
  ✓ Congratulations message
  ✓ Employer will contact soon
  ✓ Message from employer (if any)
  ✓ Job details
  ✓ Button: "View Application"
PURPOSE: Success notification
```

**C2. REJECTED**
```
TIMING: Immediately when employer marks as "rejected"
TO: Job seeker's email
EMOJI: 😞
MESSAGE: Thank you for applying
CONTAINS:
  ✓ Rejection message
  ✓ Feedback from employer (if any)
  ✓ Encouragement to keep trying
  ✓ Job details
  ✓ Button: "Browse More Jobs"
PURPOSE: Update + Encourage re-application
```

**C3. SHORTLISTED**
```
TIMING: Immediately when employer marks as "shortlisted"
TO: Job seeker's email
EMOJI: ⭐
MESSAGE: Great! Application Shortlisted
CONTAINS:
  ✓ Shortlist notification
  ✓ Next round details (if any)
  ✓ Employer message
  ✓ Job details
  ✓ Button: "View Application"
PURPOSE: Progress update
```

**C4. INTERVIEW INVITATION**
```
TIMING: Immediately when employer marks as "interview"
TO: Job seeker's email
EMOJI: 📞
MESSAGE: Interview Scheduled!
CONTAINS:
  ✓ Interview invitation
  ✓ Interview details from employer
  ✓ Preparation tips
  ✓ Job details
  ✓ Button: "Confirm Interview"
PURPOSE: Interview notification
```

---

## 📊 EMAIL MATRIX

| Event | Employer Email | Job Seeker Email | Timing | Notes |
|-------|---|---|---|---|
| Company Created | ✅ YES | - | Immediate | Welcome email |
| Company Verified | ✅ YES | - | Immediate | Success + can post |
| Company Rejected | ✅ YES | - | Immediate | Reason + resubmit |
| Job Posted | ✅ YES | ✅ ALL | Immediate | Employer: Confirm, Seekers: Notify |
| Application Sent | ✅ YES | ✅ YES | Immediate | Employer: Alert, Seeker: Confirm |
| Applied → Accepted | - | ✅ YES | Immediate | Congratulations |
| Applied → Rejected | - | ✅ YES | Immediate | Thank you + feedback |
| Applied → Shortlisted | - | ✅ YES | Immediate | Progress update |
| Applied → Interview | - | ✅ YES | Immediate | Interview details |

---

## 🔧 TECHNICAL DETAILS

### Email Service Architecture

**File:** `/backend/services/emailService.js`

```javascript
class EmailService {
  // 1. companyCretedEmail(employer, company)
  // 2. verificationStatusEmail(employer, company, status, reason, notes)
  // 3. jobPostedEmail(employer, job)
  // 4. newJobNotificationEmail(jobSeekers[], job)
  // 5. applicationReceivedEmail(employer, applicant, job)
  // 6. applicationSubmittedEmail(jobSeeker, job, company)
  // 7. applicationStatusEmail(jobSeeker, job, company, status, notes)
  // 8. sendTestEmail(email)
}
```

### Email Configuration

**File:** `.env`
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=chanekarkartik2@gmail.com
EMAIL_PASSWORD=vaau rzpx zqhj ozfi
EMAIL_FROM=hr@teztecch.com
FRONTEND_URL=http://localhost:3000
```

### Integration Points

**1. Company Created** → `/backend/routes/companies.js`
```javascript
router.post('/', async (req, res) => {
  // ... create company ...
  await EmailService.companyCretedEmail(req.user, company);
});
```

**2. Company Verification** → `/backend/routes/admin.js`
```javascript
router.post('/companies/:id/verify', async (req, res) => {
  // ... verify company ...
  await EmailService.verificationStatusEmail(employer, company, status, reason, notes);
});
```

**3. Job Posted** → `/backend/routes/jobs.js`
```javascript
router.post('/', async (req, res) => {
  // ... create job ...
  await EmailService.jobPostedEmail(req.user, populatedJob);
  await EmailService.newJobNotificationEmail(jobSeekers, populatedJob);
});
```

**4. Application Received** → `/backend/routes/applications.js`
```javascript
router.post('/', async (req, res) => {
  // ... create application ...
  await EmailService.applicationReceivedEmail(employer, req.user, job);
  await EmailService.applicationSubmittedEmail(req.user, job, company);
});
```

**5. Application Status Changed** → `/backend/routes/applications.js`
```javascript
router.put('/:id/status', async (req, res) => {
  // ... update status ...
  await EmailService.applicationStatusEmail(applicant, job, company, status, notes);
});
```

---

## 🎨 EMAIL TEMPLATES

### Template Features
- ✅ Professional gradient header (Teztech branding)
- ✅ Responsive design (mobile + desktop)
- ✅ Emoji for quick recognition
- ✅ Color-coded status (green/red/blue)
- ✅ Action buttons with direct links
- ✅ Footer with platform info
- ✅ Unsubscribe friendly text

### Template Structure
```html
<header>
  <gradient background>
  <title with emoji>
</header>

<body>
  <main message>
  <details section with color coding>
  <action button>
</body>

<footer>
  © Platform info
  Automated notification
</footer>
```

---

## ✅ TESTING EMAIL SYSTEM

### Test 1: Company Creation Email
```
1. Logout all users
2. New employer signup at /auth/register
3. Create company at /create-company
4. CHECK EMAIL: Should receive "Company Profile Created" email
```

### Test 2: Company Verification Email
```
1. Login as admin at /admin
2. Go to Admin Panel → Companies
3. Find unverified company
4. Click "Verify" button
5. Select "Verified & Approved"
6. CHECK EMPLOYER EMAIL: Should receive "Company Verified!" email
```

### Test 3: Job Posted Email
```
1. Login as employer (verified company required)
2. Go to /post-job
3. Fill all details
4. Submit
5. CHECK EMAILS:
   - Employer: Receives "Job Posted Successfully"
   - All job seekers: Receive "New [Job Title] Posted"
```

### Test 4: Application Email Flow
```
1. Login as job seeker
2. Find a job and click Apply
3. Submit application
4. CHECK EMAILS:
   - Employer: "New Application Received"
   - Job Seeker: "Application Submitted"

5. Login as employer
6. Go to Applications
7. Change application status to "Accepted"
8. CHECK EMAIL:
   - Job Seeker: "Congratulations! Application Accepted"
```

### Test 5: Send Test Email
```
curl -X POST http://localhost:5000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

---

## 🐛 TROUBLESHOOTING

### Email Not Sending?

**Check 1: Email Service Running**
```javascript
// Check server logs for:
✅ "Email service ready"  // Good
❌ "Email transporter error"  // Fix credentials
```

**Check 2: Credentials**
```bash
# Verify .env has:
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # 16-char Gmail App Password
EMAIL_FROM=hr@teztecch.com
```

**Check 3: Gmail Setup**
- Enable 2-Factor Authentication
- Generate App Password (get 16-character password)
- Use in EMAIL_PASSWORD (without spaces)

**Check 4: Network**
- Port 587 should be open (SMTP)
- Check if ISP blocks port 587
- Try VPN if blocked

**Check 5: Server Logs**
```
✅ Good logs:
  "📧 Sending email to: email@example.com"
  "✅ Email sent successfully to email@example.com"

❌ Bad logs:
  "❌ Error sending email"
  "❌ Email transporter error"
```

---

## 📈 EMAIL STATISTICS

### Emails Per Day (Example Scenario)
```
Scenario: 100 users + 50 employers + 10 jobs/day

Per Day:
- Company Created: ~5 emails
- Company Verified: ~5 emails
- Jobs Posted: ~10 emails to employer + 500 to job seekers
- Applications: ~200 to employers + 200 to job seekers
- Status Changes: ~150 to job seekers

TOTAL: ~1,070 emails/day
```

---

## 🚀 SCALING CONSIDERATIONS

### Current System
- Synchronous email sending (waits for response)
- Good for: Low volume (<100 emails/day)
- Issue: May slow down API responses

### Future Improvements (Optional)
- [ ] Email queue system (Redis/Queue)
- [ ] Batch email sending
- [ ] Email templates in admin panel
- [ ] User email preferences
- [ ] Digest emails (daily/weekly)
- [ ] SMS notifications
- [ ] Push notifications

---

## 📋 CHECKLIST - EMAIL SYSTEM READY

- ✅ EmailService created (`/backend/services/emailService.js`)
- ✅ Gmail credentials in `.env`
- ✅ Company routes updated
- ✅ Admin routes updated
- ✅ Jobs routes updated
- ✅ Applications routes updated
- ✅ Backend restarted
- ✅ Test emails sent
- ✅ All user email validated

---

## 🎉 YOU'RE ALL SET!

Your complete real-time email notification system is ready!

**All emails are now:**
- ✅ Sent in real-time (immediately)
- ✅ Professional and branded
- ✅ Mobile-responsive
- ✅ Action-oriented (with direct links)
- ✅ Properly logged
- ✅ Error-handled

**Employers receive emails for:**
- Company creation & verification
- Job postings
- Applications received

**Job Seekers receive emails for:**
- New jobs posted
- Application confirmations
- Status updates (accepted/rejected/interview)

---

## 📞 SUPPORT

If emails are not sending:
1. Check server logs for error messages
2. Verify Gmail credentials and 2FA
3. Ensure backend was restarted
4. Check email provider (Gmail/Outlook/etc)
5. Verify port 587 is open

All emails are logged to console for debugging!
