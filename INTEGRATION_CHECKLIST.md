# ✅ Real-Time System Integration Checklist

## Backend Setup

### 1. Install Dependencies
```bash
npm install nodemailer node-cron
```

### 2. Environment Variables (.env)
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@teztech.com

# Frontend URL for email links
FRONTEND_URL=http://localhost:3000

# Razorpay (already configured)
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### 3. Database Models ✅
- [x] Message model created: `/backend/models/Message.js`
- [x] Notification model updated: `/backend/models/Notification.js`
- [x] Subscription model: Already exists

### 4. API Routes ✅
- [x] Messages routes: `/backend/routes/messages.js`
- [x] Notifications routes: `/backend/routes/notifications.js` (updated)
- [x] Subscriptions routes: Already exists

### 5. Update server.js ✅
Add to `/backend/server.js`:
```javascript
app.use('/api/messages', require('./routes/messages'));
// notifications already included
```

### 6. Notification Helper ✅
- [x] Created: `/backend/utils/notificationHelper.js`

### 7. Add Scheduled Jobs (IMPORTANT)
Create `/backend/utils/scheduler.js`:
```javascript
const cron = require('node-cron');
const { sendExpiryReminders, sendExpiredReminders } = require('./notificationHelper');

module.exports = {
  startScheduler: () => {
    // Check for expiring subscriptions daily at 2 AM
    cron.schedule('0 2 * * *', async () => {
      console.log('Running subscription expiry check...');
      try {
        await sendExpiryReminders();
      } catch (error) {
        console.error('Scheduler error:', error);
      }
    });

    // Check for expired subscriptions daily at 3 AM
    cron.schedule('0 3 * * *', async () => {
      console.log('Running expired subscription check...');
      try {
        await sendExpiredReminders();
      } catch (error) {
        console.error('Scheduler error:', error);
      }
    });

    console.log('Scheduler started');
  }
};
```

Then in `server.js`, after connecting to DB:
```javascript
const { startScheduler } = require('./utils/scheduler');
startScheduler();
```

---

## Frontend Setup

### 1. Updated Components ✅
- [x] Improved Plans page: `/frontend/src/pages/Plans.js`
- [x] Messaging component: `/frontend/src/pages/Messaging.js`

### 2. Add Routes
Update `/frontend/src/App.js`:
```javascript
import Messaging from './pages/Messaging';
import Plans from './pages/Plans';

// In your router configuration:
<Route path="/messages" element={<Messaging />} />
<Route path="/messages/:userId" element={<Messaging />} />
<Route path="/plans" element={<Plans />} />
```

### 3. Add Notification Bell (Optional)
Create `/frontend/src/components/NotificationBell.js`:
```javascript
// Shows unread notification count
// Drops down unread notifications
```

---

## Admin Panel Setup

### 1. Plan Management Page ✅
- [x] Created: `/admin-panel/src/pages/PlanManagement.js`

### 2. Add Admin Routes
Update admin app routing:
```javascript
import PlanManagement from './pages/PlanManagement';

// Add route:
<Route path="/admin/plans" element={<PlanManagement />} />
```

### 3. Add to Admin Sidebar
Update `/admin-panel/src/components/Sidebar.js`:
```javascript
{
  name: 'Plan Management',
  icon: <FaTag />,
  path: '/admin/plans'
}
```

---

## Integration Points

### 1. When Job is Posted
File: Job creation route (e.g., `/backend/routes/jobs.js`)

```javascript
const { notifyJobPosted } = require('../utils/notificationHelper');

// After job is created:
await notifyJobPosted(job, employer);
```

### 2. When Application Submitted
File: Application creation route (e.g., `/backend/routes/applications.js`)

```javascript
const { notifyNewApplication } = require('../utils/notificationHelper');

// After application is created:
await notifyNewApplication(application, job, jobSeeker, employer);
```

### 3. When Application Status Changes
File: Application update route

```javascript
const { notifyApplicationStatusChange } = require('../utils/notificationHelper');

// After status is updated:
await notifyApplicationStatusChange(application, jobSeeker, job, newStatus);
```

### 4. When Interview Scheduled
File: Interview scheduling route

```javascript
const { notifyInterviewScheduled } = require('../utils/notificationHelper');

// After interview is scheduled:
await notifyInterviewScheduled(jobSeeker, employer, job, interviewDate, interviewType);
```

---

## Testing Commands (Postman/CLI)

### Test Messages
```bash
# Send message
curl -X POST http://localhost:5000/api/messages/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "receiver_id",
    "message": "Hello!",
    "type": "text"
  }'

# Get conversations
curl -X GET http://localhost:5000/api/messages/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Notifications
```bash
# Get notifications
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"

# Mark as read
curl -X PUT http://localhost:5000/api/notifications/:id/read \
  -H "Authorization: Bearer YOUR_TOKEN"

# Send expiry reminders (ADMIN ONLY)
curl -X POST http://localhost:5000/api/notifications/send-expiry-reminders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Verification Steps

### 1. Database
```javascript
// Check if documents are created
db.messages.find()
db.notifications.find()
db.subscriptions.find()
```

### 2. Email Sending
- [ ] Configure Gmail app password
- [ ] Test email with test notification
- [ ] Check spam folder
- [ ] Verify email HTML format

### 3. Real-Time Features
- [ ] Send message between two users
- [ ] Verify unread count increases
- [ ] Mark message as read
- [ ] Check message status changes

### 4. Subscriptions
- [ ] Create test plan via admin
- [ ] Purchase subscription via frontend
- [ ] Verify payment with Razorpay test card
- [ ] Check subscription status in database

### 5. Notifications
- [ ] Post a job → check notification
- [ ] Apply for job → check notification for employer
- [ ] Check email received
- [ ] Verify notification marked as read

---

## Production Deployment

### Before Going Live:
- [ ] All environment variables configured
- [ ] Email service verified (Gmail/SendGrid)
- [ ] Razorpay live keys installed
- [ ] Database backups configured
- [ ] Error logging set up
- [ ] CORS origins added
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Backup emails configured
- [ ] Monitoring alerts set up

### Security Checks:
- [ ] API endpoints protected with auth middleware
- [ ] Admin routes protected with isAdmin check
- [ ] User data sanitized
- [ ] Email credentials NOT in code
- [ ] Sensitive data in .env only
- [ ] HTTPS enforced
- [ ] CSRF protection enabled

---

## Troubleshooting

### Emails Not Sending
1. Check EMAIL_USER and EMAIL_PASSWORD in .env
2. Enable "Less secure app access" in Gmail
3. Use app-specific password, not Gmail password
4. Check email provider logs
5. Verify SMTP settings

### Notifications Not Showing
1. Check if middleware is protecting routes
2. Verify user ID in token
3. Check browser console for errors
4. Verify API response in network tab

### Messages Not Sending
1. Verify both users exist
2. Check authorization token
3. Verify receiver ID format
4. Check database connection

### Subscriptions Not Activating
1. Verify Razorpay keys are correct
2. Check payment status in Razorpay dashboard
3. Verify signature verification logic
4. Check database for subscription records

---

## Quick Reference

| Feature | Route | Method | Status |
|---------|-------|--------|--------|
| Send Message | `/api/messages/send` | POST | ✅ |
| Get Conversations | `/api/messages/conversations` | GET | ✅ |
| Get Chat History | `/api/messages/:userId` | GET | ✅ |
| Mark Message Read | `/api/messages/:id/read` | PUT | ✅ |
| Get Notifications | `/api/notifications` | GET | ✅ |
| Mark Notification Read | `/api/notifications/:id/read` | PUT | ✅ |
| Get Subscriptions | `/api/subscriptions/my-subscription` | GET | ✅ |
| Create Subscription | `/api/subscriptions/create` | POST | ✅ |
| Verify Payment | `/api/subscriptions/verify-payment` | POST | ✅ |

---

**Last Updated**: 2024
**Status**: ✅ Ready for Implementation
