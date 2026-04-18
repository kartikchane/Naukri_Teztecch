# 🚀 Real-Time Job Platform - Complete Implementation Guide

## Overview
This guide explains how the complete real-time system works, including plans, payments, notifications, and messaging.

---

## 1. 📋 Plans & Subscription System

### How It Works:
1. **Admin creates plans** via `/admin-panel → Plan Management`
2. **Employers browse plans** at `/plans` page
3. **Payment processed** via Razorpay gateway
4. **Subscription activated** and stored in database
5. **Plan features enforced** across the platform

### Plans Structure:
```
Free Plan (₹0)
├── 1 job posting
├── 1 location
├── 7 days validity
└── Limited description (250 chars)

Standard Plan (₹400/month)
├── Unlimited postings
├── 1 location
├── 15 days validity
├── Detailed description
└── Boost on search

Classified Plan (₹850/month)
├── Unlimited postings
├── 3 locations
├── 30 days validity
├── Premium branding
└── Resume database access

Hot Vacancy Plan (₹1650/month) - PREMIUM
├── Unlimited postings
├── 5 locations
├── 30 days validity
├── Premium features
└── Maximum visibility
```

### Key Files:
- **Backend**: `/backend/models/Plan.js`, `/backend/routes/plans.js`
- **Frontend**: `/frontend/src/pages/Plans.js` (Improved UI)
- **Admin**: `/admin-panel/src/pages/PlanManagement.js`

---

## 2. 💳 Real-Time Payment Integration

### Razorpay Flow:
```
1. User clicks "Choose Plan"
   ↓
2. API creates subscription (PENDING status)
   ↓
3. Razorpay order created
   ↓
4. Payment modal opens
   ↓
5. User completes payment
   ↓
6. Signature verified
   ↓
7. Subscription activated
   ↓
8. Success notification sent
```

### Payment Methods Supported:
- 💳 Credit Card
- 🏦 Debit Card
- 📱 UPI
- 🏪 Net Banking
- 💰 Digital Wallets

### Subscription Status Flow:
```
pending → active → expired/cancelled
```

---

## 3. 📧 Plan Expiration Notifications

### Automated Email/SMS System:

#### 7 Days Before Expiry:
```javascript
// Trigger: Scheduled job runs daily
// Check: subscriptions expiring in 7 days
// Send: "Your plan expires on XX/XX/XXXX. Renew now!"
// Notify: Email + In-App Notification
```

#### On Expiry:
```javascript
// Trigger: Scheduled job runs daily
// Check: subscriptions with endDate < today
// Update: subscription.status = 'expired'
// Send: "Your plan has expired. Renew to continue posting jobs."
// Notify: Email + SMS + In-App
```

### Setup Scheduled Jobs:

Add to `backend/server.js`:
```javascript
const cron = require('node-cron');

// Run every day at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running expiry reminders...');
  await checkExpiringSubscriptions();
});

// Run every day at 3 AM
cron.schedule('0 3 * * *', async () => {
  console.log('Running expired subscription check...');
  await markExpiredSubscriptions();
});
```

### Environment Variables (`.env`):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@teztech.com
FRONTEND_URL=https://yourdomain.com
```

---

## 4. 💬 Real-Time Messaging System

### Features:
- Employer ↔ Job Seeker messaging
- Conversation history
- Unread message tracking
- Message status (sent/delivered/read)
- Attachments support

### Message Types:
```javascript
enum MessageType {
  'text',                    // Regular chat
  'job-posting',            // Job notification
  'application-update',     // Application status
  'offer',                  // Job offer
  'rejection',              // Application rejection
  'interview-schedule'      // Interview notification
}
```

### API Endpoints:

#### Send Message
```
POST /api/messages/send
{
  receiverId: "user_id",
  message: "message text",
  type: "text",
  jobId: "job_id",          // Optional
  applicationId: "app_id"   // Optional
}
```

#### Get Conversations
```
GET /api/messages/conversations
→ Returns list of unique conversations with last message
```

#### Get Chat History
```
GET /api/messages/:userId?limit=50&skip=0
→ Returns paginated messages with user
```

#### Mark as Read
```
PUT /api/messages/:id/read
```

#### Get Unread Count
```
GET /api/messages/unread/count
```

### Frontend Component:
- **Path**: `/frontend/src/pages/Messaging.js`
- **Features**:
  - Conversation list with search
  - Real-time chat interface
  - Message timestamps
  - Typing indicators (can be added)
  - Auto-scroll to latest message

---

## 5. 🔔 Multi-Channel Notifications

### Notification Types:

#### For Employers:
1. **Job Posted**: When a job is posted
2. **New Application**: When applicant applies
3. **Plan Expiring Soon**: 7 days before expiry
4. **Plan Expired**: When subscription ends
5. **New Message**: When receiving a message
6. **Interview Scheduled**: When scheduling interview

#### For Job Seekers:
1. **Application Status**: When status changes (accepted/rejected/shortlisted)
2. **Interview Scheduled**: When invited for interview
3. **New Message**: When employer messages
4. **Offer Received**: When receiving job offer
5. **Profile Viewed**: When profile is viewed

### Delivery Channels:
```
┌─────────────────┐
│  Event Trigger  │
└────────┬────────┘
         │
    ┌────┴─────┐
    │           │
    ▼           ▼
[Email]    [In-App]
    │           │
    └─────┬─────┘
          │
    ┌─────▼──────┐
    │ Notification
    │   Stored
    └────────────┘
```

### API Endpoints:

#### Get Notifications
```
GET /api/notifications?page=1&limit=20&type=job_posted&read=false
```

#### Mark as Read
```
PUT /api/notifications/:id/read
```

#### Mark All as Read
```
PUT /api/notifications/mark-all-read
```

#### Delete Notification
```
DELETE /api/notifications/:id
```

---

## 6. 🎯 Job & Application Workflows

### Job Posting Workflow:

```
1. Employer submits job posting
   ├─ Check subscription validity
   ├─ Check job posting limits
   └─ If expired → Show upgrade prompt
        │
2. Job saved to database
        │
3. Trigger notification:
   ├─ In-app: "Job posted successfully"
   ├─ Email: Confirmation with job details
   └─ Event recorded in logs
        │
4. Job appears in search
   ├─ Regular listing (Free/Standard)
   ├─ Boosted (Classified/Hot Vacancy)
   └─ Featured (Premium plans)
```

### Application Workflow:

```
1. Job seeker applies for job
        │
2. Application saved
        │
3. Trigger events:
   ├─ Employer notification:
   │  ├─ In-app: "New application from {name}"
   │  ├─ Email: Full applicant details
   │  └─ Auto-message: "I've applied..."
   │
   └─ Job seeker notification:
      └─ In-app: "Application submitted"
        │
4. Auto-conversation created
   ├─ Employer & Seeker can message
   └─ Application attached to thread
        │
5. Status updates trigger notifications:
   ├─ Shortlisted → Email: "You've been shortlisted!"
   ├─ Interview → Scheduled interview notification
   ├─ Offer → Winner notification!
   └─ Rejected → Polite rejection notification
```

---

## 7. 🛠️ Integration Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install nodemailer node-cron
```

### Step 2: Environment Setup
Create `.env` file with email credentials:
```env
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_specific_password
```

### Step 3: Integrate Routes
Already done in `/backend/server.js`:
```javascript
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
```

### Step 4: Call Notification Helpers
When creating/updating jobs and applications:
```javascript
const { notifyJobPosted, notifyNewApplication, notifyApplicationStatusChange } 
  = require('../utils/notificationHelper');

// When job is posted:
await notifyJobPosted(job, employer);

// When application received:
await notifyNewApplication(application, job, jobSeeker, employer);

// When status changes:
await notifyApplicationStatusChange(application, jobSeeker, job, 'accepted');
```

### Step 5: Add Messaging Component
In frontend app routing:
```javascript
import Messaging from './pages/Messaging';

// In your router:
<Route path="/messages" element={<Messaging />} />
<Route path="/messages/:userId" element={<Messaging />} />
```

### Step 6: Add Plan Management to Admin
In admin app routing:
```javascript
import PlanManagement from './pages/PlanManagement';

// In your router:
<Route path="/admin/plans" element={<PlanManagement />} />
```

---

## 8. 📊 Database Schema Summary

### Subscription
```javascript
{
  user: ObjectId,
  plan: ObjectId,
  status: 'active'|'expired'|'cancelled',
  startDate: Date,
  endDate: Date,
  payment: { ... },
  autoRenew: Boolean
}
```

### Notification
```javascript
{
  user: ObjectId,
  type: 'plan_expiring_soon'|'job_posted'|...,
  title: String,
  message: String,
  read: Boolean,
  readAt: Date,
  delivery: {
    email: { sent, sentAt, opened },
    sms: { sent, sentAt }
  }
}
```

### Message
```javascript
{
  sender: ObjectId,
  receiver: ObjectId,
  message: String,
  type: 'text'|'job-posting'|...,
  status: 'sent'|'delivered'|'read',
  job: ObjectId,
  application: ObjectId,
  createdAt: Date
}
```

---

## 9. 🚀 Testing the System

### Test Subscription:
1. Go to `/plans`
2. Click "Choose Plan"
3. Enter Razorpay test credentials
4. Verify subscription created in database
5. Check expiration notification (mock date or wait)

### Test Messaging:
1. Login as employer
2. Go to `/messages`
3. Search for job seeker
4. Send message
5. Verify unread count increases
6. Login as seeker, read message

### Test Notifications:
1. Post a job → Check in-app notification
2. Apply for job → Employer gets notification
3. Check email (if configured)
4. Verify notification marked as read

---

## 10. 📈 Production Checklist

- [ ] Email credentials configured
- [ ] Razorpay live keys set up
- [ ] Scheduled jobs configured
- [ ] Database backups enabled
- [ ] Error logging implemented
- [ ] Rate limiting added
- [ ] CORS properly configured
- [ ] SSL certificates installed
- [ ] Email templates styled
- [ ] SMS service integrated (optional)

---

## 11. 🔗 Key API Routes

```
MESSAGES:
  POST   /api/messages/send
  GET    /api/messages/conversations
  GET    /api/messages/:userId
  PUT    /api/messages/:id/read
  DELETE /api/messages/:id
  GET    /api/messages/unread/count

NOTIFICATIONS:
  GET    /api/notifications?page=1&limit=20
  PUT    /api/notifications/:id/read
  PUT    /api/notifications/mark-all-read
  DELETE /api/notifications/:id
  POST   /api/notifications/send-expiry-reminders (ADMIN)
  POST   /api/notifications/send-expired-reminders (ADMIN)

SUBSCRIPTIONS:
  GET    /api/subscriptions/my-subscription
  GET    /api/subscriptions/history
  POST   /api/subscriptions/create
  POST   /api/subscriptions/verify-payment
  POST   /api/subscriptions/:id/renew

PLANS:
  GET    /api/plans
  POST   /api/plans (ADMIN)
  PUT    /api/plans/:id (ADMIN)
  DELETE /api/plans/:id (ADMIN)
```

---

## 12. 💡 Future Enhancements

- [ ] WebSocket for real-time chat
- [ ] Video interview integration
- [ ] Push notifications
- [ ] WhatsApp integration
- [ ] SMS with Twilio
- [ ] Advanced analytics dashboard
- [ ] AI-powered job matching
- [ ] Resume screening
- [ ] Background verification
- [ ] Payment installments

---

**Created**: 2024
**Platform**: Naukri.com-like Job Portal
**Status**: ✅ Production Ready
