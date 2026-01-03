# Render Deployment Guide - Backend with Admin Panel

## Overview
This guide explains how to deploy the backend with the integrated admin panel to Render.

## What's Deployed
- **Backend API**: Node.js/Express server (Port 5000)
- **Admin Panel**: React app served as static files from backend in production
- **Access Point**: Opening the backend URL will show the admin panel

## Prerequisites
✅ Backend code pushed to GitHub
✅ Admin panel built (`npm run build` completed)
✅ Admin build files committed to repository
✅ MongoDB connection string ready

## Render Configuration

### Build Command
```bash
cd admin-panel && npm install && npm run build && cd ../backend && npm install
```

### Start Command
```bash
cd backend && NODE_ENV=production node server.js
```

### Environment Variables
Add these in Render Dashboard → Environment:

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Deployment Steps

### 1. Create New Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `naukri_Platform` repository

### 2. Configure Service
- **Name**: `naukri-backend`
- **Region**: Select closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty (uses repository root)
- **Runtime**: `Node`
- **Build Command**: (See above)
- **Start Command**: (See above)

### 3. Add Environment Variables
Add all variables listed above in the Environment section

### 4. Deploy
1. Click "Create Web Service"
2. Wait for build to complete (5-10 minutes)
3. Note your backend URL: `https://naukri-backend-xxxx.onrender.com`

## Post-Deployment

### Testing
1. **API Health Check**: Visit `https://your-backend-url.onrender.com/api/health`
2. **Admin Panel**: Visit `https://your-backend-url.onrender.com`
3. **Admin Login**: Click login and use:
   - Email: `teztecchadmin@gmail.com`
   - Password: `Admin@123`

### Updating Admin Panel
Whenever you make changes to the admin panel:
```bash
cd admin-panel
npm run build
git add build/
git commit -m "Updated admin panel"
git push origin main
```

Render will automatically redeploy.

## Architecture

```
Render Backend URL
├── / → Admin Panel (React App)
│   ├── /login → Admin Login
│   ├── /dashboard → Admin Dashboard
│   ├── /jobs → Job Management
│   ├── /applications → Application Management
│   └── /users → User Management
└── /api/* → Backend API Endpoints
    ├── /api/auth → Authentication
    ├── /api/jobs → Jobs API
    ├── /api/applications → Applications API
    ├── /api/users → Users API
    ├── /api/companies → Companies API
    └── /api/stats → Statistics API
```

## Troubleshooting

### Admin Panel Not Loading
- Check if `NODE_ENV=production` is set
- Verify build files exist: `git ls-files admin-panel/build/`
- Check Render logs for errors

### API Not Working
- Verify MONGODB_URI is correct
- Check JWT_SECRET is set
- Review Render logs: `Dashboard → Logs`

### Build Fails
- Check if build command completes successfully
- Ensure all dependencies are in package.json
- Verify Node version compatibility

## Production URLs
- **Backend + Admin Panel**: `https://your-backend.onrender.com`
- **Frontend (Vercel)**: `https://your-frontend.vercel.app`
- **MongoDB**: MongoDB Atlas

## Security Notes
- Admin panel is served over HTTPS by Render
- JWT tokens are stored in localStorage (adminToken)
- CORS configured for frontend domain
- API routes require authentication

## Maintenance
- Render free tier: Service may sleep after 15 min inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid plan for 24/7 availability
