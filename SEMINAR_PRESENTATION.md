# NAUKRI PLATFORM - Project Overview for Seminar

## 📌 PROJECT INTRODUCTION

**Naukri Platform** is a comprehensive **full-stack job portal application** - similar to platforms like LinkedIn, Indeed, or Naukri.com. It's a complete recruitment ecosystem where job seekers can browse and apply for jobs, while employers can post job openings and manage applications.

---

## 🏗️ ARCHITECTURE OVERVIEW

The project is built using a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (React.js)                         │
│  - User Interfaces (Job Seekers & Employers)            │
│  - Admin Dashboard                                       │
└─────────────────────────────────────────────────────────┘
                         ↕
         (REST API via Axios - JSON)
                         ↕
┌─────────────────────────────────────────────────────────┐
│          BACKEND (Node.js + Express.js)                 │
│  - API Endpoints & Business Logic                       │
│  - Authentication & Authorization                       │
│  - Database Operations                                  │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│        DATABASE (MongoDB + Cloudinary + AWS S3)         │
│  - User Data, Jobs, Applications                        │
│  - Image Storage (Cloud)                                │
│  - Document Storage (Resumes, PDFs)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ TECHNOLOGY STACK

### **FRONTEND** (Located in `/frontend`)
| Technology | Purpose |
|-----------|---------|
| **React.js 18.2** | UI Framework - Building interactive user interfaces |
| **React Router DOM 6.20** | Client-side navigation and routing |
| **Tailwind CSS 3.3** | Utility-first CSS framework for styling |
| **Axios 1.6** | HTTP client for API calls |
| **React Icons 4.12** | Icon library for UI components |
| **React Toastify 9.1** | Toast notifications for user feedback |
| **Google OAuth (@react-oauth/google)** | Social login integration |

### **BACKEND** (Located in `/backend`)
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime for server-side development |
| **Express.js 4.18** | Web framework for REST API development |
| **MongoDB 7.5** (with Mongoose) | NoSQL database for data storage |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **Bcryptjs** | Password hashing & encryption |
| **Multer** | File upload handling |
| **Nodemailer** | Email sending service |
| **Express Validator** | Input validation & sanitization |
| **Razorpay 2.9** | Payment gateway integration |
| **Google Auth Library** | OAuth token verification |
| **Cloudinary** | Cloud-based image storage |
| **Node-Cron** | Job scheduling (auto-expire old jobs) |

### **DEPLOYMENT**
- **Frontend**: Vercel (Serverless deployment)
- **Backend**: Render or Vercel (Serverless APIs)
- **Database**: MongoDB Atlas (Cloud MongoDB)

---

## 📊 DATABASE SCHEMA (MongoDB Models)

### **1. User Model** (`/backend/models/User.js`)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (Unique),
  password: String (Hashed with bcrypt),
  phone: String,
  role: "job_seeker" | "employer" | "admin",
  profile: {
    headline: String,
    bio: String,
    location: String,
    skills: [String]
  },
  resume: { url, fileName },
  profilePicture: String (Cloudinary URL),
  googleId: String (Optional - for OAuth),
  provider: "local" | "google",
  subscription: { planId, expiryDate },
  createdAt: Date,
  updatedAt: Date
}
```

### **2. Job Model** (`/backend/models/Job.js`)
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  company: ObjectId (Reference to Company),
  postedBy: ObjectId (Reference to User),
  salary: { min, max, currency },
  location: String,
  category: String (e.g., "IT", "Sales"),
  jobType: "Full-time" | "Part-time" | "Freelance",
  experience: String,
  skills: [String],
  applicants: [ObjectId] (References to Users),
  createdAt: Date,
  expiresAt: Date (Auto-delete after 30 days),
  featured: Boolean,
  featuredExpiry: Date
}
```

### **3. Company Model** (`/backend/models/Company.js`)
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  owner: ObjectId (Reference to User),
  location: String,
  industry: String,
  website: String,
  logo: String (Cloudinary URL),
  description: String,
  employees: Number
}
```

### **4. Application Model** (`/backend/models/Application.js`)
```javascript
{
  _id: ObjectId,
  job: ObjectId (Reference to Job),
  applicant: ObjectId (Reference to User),
  resume: { url, fileName },
  coverLetter: String,
  status: "pending" | "shortlisted" | "rejected" | "accepted",
  appliedAt: Date
}
```

### **Other Models**
- **Plan** - Subscription plans (Basic, Premium, Enterprise)
- **Subscription** - User subscriptions & payment records
- **Message** - Direct messaging between users
- **Notification** - In-app notifications
- **Review** - Company & job reviews
- **Gallery** - Company gallery images
- **Settings** - System settings

---

## 🔌 API ENDPOINTS

### **Authentication Routes** (`/api/auth`)
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login with email/password
POST   /api/auth/google          - Login/Register with Google OAuth
GET    /api/auth/user            - Get current user profile
POST   /api/auth/logout          - Logout
PUT    /api/auth/profile         - Update profile
```

### **Job Routes** (`/api/jobs`)
```
GET    /api/jobs                 - Get all jobs (with filters)
GET    /api/jobs/:id             - Get job details
POST   /api/jobs                 - Post new job (employer only)
PUT    /api/jobs/:id             - Update job
DELETE /api/jobs/:id             - Delete job
POST   /api/jobs/:id/apply       - Apply to job
GET    /api/jobs/:id/applicants  - View job applicants
POST   /api/jobs/:id/mark-featured - Mark job as featured
```

### **Company Routes** (`/api/companies`)
```
GET    /api/companies            - Get all companies
POST   /api/companies            - Create company profile
PUT    /api/companies/:id        - Update company
GET    /api/companies/:id/jobs   - Get company's job listings
```

### **Applications Routes** (`/api/applications`)
```
GET    /api/applications         - Get user's applications
GET    /api/applications/:id     - Get application details
PUT    /api/applications/:id     - Update application status
DELETE /api/applications/:id     - Withdraw application
```

### **Subscription/Payment Routes** (`/api/subscriptions`)
```
GET    /api/plans                - Get subscription plans
POST   /api/subscriptions/create - Create Razorpay order
POST   /api/subscriptions/verify-payment - Verify payment
GET    /api/subscriptions/status - Check subscription status
```

### **Admin Routes** (`/api/admin`)
```
GET    /api/admin/stats          - Get platform statistics
GET    /api/admin/users          - Manage users
GET    /api/admin/jobs           - Moderate jobs
POST   /api/admin/make-featured  - Make job featured
```

---

## 🎯 KEY FEATURES IMPLEMENTED

### **For Job Seekers**
✅ Browse & search job listings  
✅ Filter jobs by category, location, salary, experience  
✅ Apply to jobs  
✅ Save favorite jobs  
✅ Upload & manage resume  
✅ View application status  
✅ Receive notifications  
✅ View company profiles & reviews  
✅ Direct messaging with employers  

### **For Employers**
✅ Create & publish job openings  
✅ Manage job listings  
✅ View & shortlist applicants  
✅ Send acceptance/rejection emails  
✅ Company profile management  
✅ Featured job listings  
✅ Track application analytics  
✅ Gallery management (company images)  

### **Admin Features**
✅ User & job moderation  
✅ Platform analytics & statistics  
✅ User management  
✅ Premium job feature management  
✅ System settings configuration  

---

## 🔐 SECURITY FEATURES

### **1. Authentication & Authorization**
- **JWT Tokens**: User authentication using JSON Web Tokens
- **Role-Based Access Control (RBAC)**: Different permissions for job_seeker, employer, admin
- **Password Hashing**: Bcryptjs with salt rounds for secure password storage
- **Protected Routes**: Middleware to verify JWT tokens on sensitive endpoints

### **2. Input Validation**
- **Express Validator**: Server-side validation of all inputs
- **Sanitization**: Prevents SQL injection and XSS attacks
- **File Upload Security**: Multer configured with file type and size limits

### **3. CORS & Security Headers**
- **CORS Configuration**: Whitelisted origins for authorized requests
- **Credentials**: Secure cookie transmission with credentials flag

---

## 💳 ADVANCED INTEGRATIONS

### **1. RAZORPAY PAYMENT INTEGRATION** 🏦
**Purpose**: Handle subscription & premium feature payments

**Payment Flow**:
1. User selects premium plan → Frontend requests order creation
2. Backend creates Razorpay order → Returns order details
3. Razorpay payment gateway opens → User pays
4. Payment webhook → Backend verifies signature
5. Subscription activated → User gets premium features

**API Keys**: (Production keys configured)
```
RAZORPAY_KEY_ID=rzp_live_***
RAZORPAY_KEY_SECRET=MtP3vfl***
```

### **2. GOOGLE OAUTH INTEGRATION** 🔐
**Purpose**: Allow one-click login with Google account

**Implementation**:
- Frontend uses `@react-oauth/google` library
- Backend verifies Google ID tokens using `google-auth-library`
- On first login: Creates new user account
- On subsequent login: Links to existing account
- User can register without password (OAuth only)

**Setup**: User needs Google Cloud Project credentials

### **3. CLOUDINARY IMAGE STORAGE** ☁️
**Purpose**: Store and serve images in the cloud

**What's stored**:
- User profile pictures
- Company logos
- Company gallery images

**Benefits**:
- Images served via CDN (faster delivery)
- Automatic image optimization
- No server storage needed

### **4. AWS S3 FILE STORAGE** 📦
**Purpose**: Store documents (resumes, PDFs) persistently

**Problem Solved**: 
- Render/Vercel have ephemeral filesystems (files deleted on restart)
- AWS S3 provides permanent storage

**What's stored**:
- User resumes
- Application documents
- Any uploaded files

**Benefits**:
- Persistent storage (survives server restarts)
- Scalable (unlimited storage)
- CDN integration available
- Cost-effective (~$1-5/month for typical usage)

### **5. EMAIL SERVICE (Nodemailer)** 📧
**Purpose**: Send automated emails

**When emails are sent**:
- Job application confirmation
- Application status updates (accepted/rejected)
- Subscription confirmation
- Password reset
- New job notifications

**SMTP Configuration**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### **6. JOB AUTO-EXPIRATION (Node-Cron)** ⏰
**Purpose**: Automatically expire old job listings after 30 days

**How it works**:
```javascript
// Scheduled task runs every hour
// Finds jobs where expiresAt < current date
// Marks them as inactive/expired
// Cleans up old data
```

---

## 📁 PROJECT FILE STRUCTURE

```
naukri_Platform/
│
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/                # Database schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   ├── Application.js
│   │   └── ... (8 more models)
│   ├── routes/                # API endpoints
│   │   ├── auth.js            # Authentication
│   │   ├── jobs.js            # Job listings
│   │   ├── companies.js       # Company profiles
│   │   ├── subscriptions.js   # Payments
│   │   └── ... (8 more route files)
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── upload.js          # File upload handling
│   ├── services/
│   │   ├── emailService.js    # Email sending
│   │   └── notificationService.js
│   ├── utils/
│   │   └── jobExpiration.js   # Job auto-expiry
│   ├── uploads/               # Local file storage
│   ├── server.js              # Main server file
│   └── package.json
│
├── frontend/                  # React.js application
│   ├── public/
│   │   └── index.html         # Main HTML file
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Context API (global state)
│   │   ├── utils/             # Helper functions
│   │   ├── App.js             # Main component
│   │   └── index.js           # Entry point
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json
│
├── admin-panel/               # Admin dashboard (React)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── build/                 # Compiled admin panel
│
├── package.json               # Root project config
├── vercel.json                # Vercel deployment config
├── SETUP_STATUS.md            # Setup completion tracker
├── RAZORPAY_INTEGRATION_COMPLETE.md
├── GOOGLE_OAUTH_SETUP.md
└── AWS_S3_IMPLEMENTATION.md
```

---

## 🚀 DEPLOYMENT & HOSTING

### **Frontend Deployment** (Vercel)
- Automatic deployments from GitHub
- URL: `https://teztecch-naukri-frontend.vercel.app`
- Serverless functions for dynamic pages

### **Backend Deployment** (Render/Vercel)
- Node.js API hosted on serverless platform
- MongoDB Atlas for database (cloud MongoDB)
- Environment variables for sensitive data

### **Custom Domain**
- Production URL: `https://teztecchnaukri.com`
- SSL certificate included

---

## 🔄 DATA FLOW EXAMPLE: Job Application

```
1. User on Frontend clicks "Apply to Job"
   ↓
2. Frontend sends POST request to /api/applications
   {
     jobId: "job_123",
     resume: "file_object"
   }
   ↓
3. Backend middleware verifies JWT token
   ↓
4. Multer uploads resume to Cloudinary/AWS S3
   ↓
5. Backend creates Application document in MongoDB
   ↓
6. Backend sends confirmation email via Nodemailer
   ↓
7. Backend sends notification to job poster
   ↓
8. Frontend updates UI with success message (React Toastify)
   ↓
9. Application appears in user's "My Applications" page
```

---

## 🔧 KEY TECHNICAL CONCEPTS USED

### **1. REST API Architecture**
- Follows REST principles (GET, POST, PUT, DELETE)
- JSON for request/response
- HTTP status codes for error handling

### **2. Middleware Pattern**
- Auth middleware: Verifies JWT tokens
- Upload middleware: Handles file uploads
- CORS middleware: Allows cross-origin requests

### **3. Database Relationships (MongoDB)**
- References between collections (ObjectId)
- Population/Joins using Mongoose `populate()`
- Indexing for performance

### **4. Async/Await Pattern**
- Non-blocking operations
- Error handling with try-catch
- Promise-based code

### **5. Environment Variables**
- Secure configuration management
- Different settings for dev/production
- API keys & credentials in `.env` file

### **6. File Upload Pipeline**
```
User selects file → Multer receives → Cloudinary/S3 stores → URL returned → Saved in DB
```

---

## 💡 WHY THIS TECH STACK?

| Technology | Why Chosen |
|-----------|-----------|
| **React** | Component-based, large ecosystem, performance |
| **Node.js + Express** | Fast, lightweight, JavaScript on backend |
| **MongoDB** | Flexible schema, JSON-like documents, scalable |
| **JWT** | Stateless authentication, microservices-friendly |
| **Tailwind CSS** | Utility-first, rapid development, responsive design |
| **Razorpay** | India-focused, easy integration, reliable payments |
| **Vercel** | Optimized for Next.js/React, automatic deployments |
| **AWS S3** | Industry standard, reliable, cost-effective storage |

---

## 📊 PROJECT STATISTICS

- **Backend Routes**: 50+ API endpoints
- **Database Models**: 11 MongoDB schemas
- **Frontend Components**: 30+ React components
- **Lines of Code**: 5000+ lines
- **Packages**: 40+ npm dependencies
- **Deployment**: 3 separate applications (Frontend, Backend, Admin)
- **Users Supported**: Job seekers, Employers, Admins

---

## 🎓 KEY LEARNING OUTCOMES FROM THIS PROJECT

1. **Full-Stack Development**: Frontend + Backend + Database integration
2. **Authentication**: JWT tokens, OAuth integration, password security
3. **Payment Processing**: Razorpay integration, payment verification
4. **Cloud Services**: AWS S3, Cloudinary, MongoDB Atlas
5. **API Design**: RESTful API principles, proper status codes
6. **Database Design**: MongoDB schema design, relationships
7. **Security**: Input validation, CORS, secure password storage
8. **DevOps**: Environment configuration, deployment automation
9. **Real-time Features**: Notifications, email services
10. **Scalability**: File storage optimization, database indexing

---

## 🎯 FUTURE ENHANCEMENTS

1. **Real-time Chat**: WebSocket integration for instant messaging
2. **Video Interviews**: Integrated video call capabilities
3. **AI Job Matching**: ML algorithms to match jobs with candidates
4. **Mobile App**: React Native mobile application
5. **Analytics Dashboard**: Advanced analytics for employers
6. **SEO Optimization**: Structured data, sitemap, robots.txt
7. **Multi-language Support**: Support for multiple languages
8. **Advanced Scheduling**: Interview scheduling system

---

## ✅ CONCLUSION

The Naukri Platform is a **production-ready, scalable job portal** that demonstrates:
- Professional full-stack development practices
- Integration of multiple third-party services
- Security best practices
- Cloud-based deployment
- Modern web technologies

This project showcases skills in **end-to-end application development**, from database design to user interface, with real-world integrations for payments, authentication, and storage.

---

**Created for Seminar Presentation**  
**Last Updated: May 2026**
