# Quick Start Guide for Naukri Platform

## Prerequisites Installation

### 1. Install Node.js
Download and install Node.js (v14 or higher) from: https://nodejs.org/

Verify installation:
```powershell
node --version
npm --version
```

### 2. Install MongoDB
Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community

Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

If using local MongoDB, start the service:
```powershell
# Windows - MongoDB should start automatically as a service
# Or manually:
mongod
```

## Project Setup

### Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment Variables

The `.env` file is already created. Update if needed:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Change to a secure random string in production

### Step 3: Create Upload Directory

```powershell
mkdir uploads
```

### Step 4: Start the Application

Open TWO PowerShell terminals:

**Terminal 1 - Backend Server:**
```powershell
npm run dev
```
Server will run on: http://localhost:5000

**Terminal 2 - Frontend React App:**
```powershell
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

**Or run both together (after installing):**
```powershell
npm run dev:all
```

## Testing the Application

### 1. Register a New User
- Go to http://localhost:3000/register
- Create an account as either "Job Seeker" or "Employer"

### 2. For Job Seekers:
- Browse jobs at http://localhost:3000/jobs
- Search and filter jobs
- View job details
- Apply to jobs

### 3. For Employers:
- Create a company profile first
- Post job openings
- View applications
- Manage listings

## API Endpoints Testing

Use Postman or Thunder Client to test API endpoints:

**Base URL:** http://localhost:5000/api

### Authentication
- POST `/auth/register` - Register user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user (requires token)

### Jobs
- GET `/jobs` - Get all jobs (with filters)
- GET `/jobs/:id` - Get single job
- POST `/jobs` - Create job (employer only)
- PUT `/jobs/:id` - Update job
- DELETE `/jobs/:id` - Delete job

### Applications
- POST `/applications` - Apply to job
- GET `/applications/user` - Get user's applications
- GET `/applications/job/:jobId` - Get job applications (employer)

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** 
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas, ensure IP is whitelisted

### Issue: Port Already in Use
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Issue: Module Not Found
**Solution:**
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

## Project Structure Overview

```
naukri_Platform/
├── backend/
│   ├── config/         # Database configuration
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth & upload middleware
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Auth context
│   │   ├── utils/      # API utilities
│   │   └── App.js      # Main app
│   └── public/         # Static files
├── uploads/            # File uploads directory
├── .env               # Environment variables
└── package.json       # Dependencies
```

## Next Steps

1. **Add More Features:**
   - Email notifications
   - Advanced search with filters
   - Chat system between recruiters and candidates
   - Resume builder
   - Interview scheduling

2. **Deployment:**
   - Backend: Deploy to Heroku, Railway, or AWS
   - Frontend: Deploy to Vercel, Netlify, or AWS S3
   - Database: Use MongoDB Atlas for production

3. **Security Enhancements:**
   - Add rate limiting
   - Implement email verification
   - Add password reset functionality
   - Enable HTTPS in production

## Support

For issues or questions:
- Email: info@teztecch.com
- Check the main README.md for detailed documentation

## Tech Stack Summary

- **Frontend:** React.js, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer
- **Validation:** Express Validator

Happy Coding! 🚀
