# Vercel Deployment Guide

## 🚀 Deploy Naukri Job Portal to Vercel

This guide will help you deploy both frontend and backend to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

## Step 1: Push to GitHub

Your code is ready to push! Run these commands:

```bash
# Add remote repository (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/naukri-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/naukri_platform`)
5. Replace `<password>` with your database password
6. Add your database name at the end

## Step 3: Deploy Backend to Vercel

### Create vercel.json for Backend

The backend needs a `vercel.json` configuration file (already included):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/server.js"
    }
  ]
}
```

### Deploy Backend

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Leave empty or `cd backend && npm install`
   - **Output Directory**: Leave empty
   
5. **Environment Variables** (Click "Environment Variables"):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/naukri_platform
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   NODE_ENV=production
   PORT=5000
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

6. Click "Deploy"
7. Copy your backend URL (e.g., `https://naukri-backend.vercel.app`)

## Step 4: Deploy Frontend to Vercel

### Update Frontend API URL

1. Create/update `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

### Deploy Frontend

1. Go to Vercel Dashboard again
2. Click "Add New" → "Project"
3. Import the SAME repository again
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   
5. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   ```

6. Click "Deploy"

## Step 5: Update Backend CORS

After getting your frontend URL, update the backend environment variable:

1. Go to your backend project in Vercel
2. Settings → Environment Variables
3. Update `CLIENT_URL` to your frontend URL
4. Redeploy the backend

## Step 6: Initialize Database

Run these scripts to populate your database:

```bash
# Set your MongoDB Atlas URI in .env
MONGODB_URI=your_atlas_connection_string

# Run seed scripts
node backend/seed.js
node backend/populate-jobs.js
node backend/mark-featured.js
```

## Project Structure for Vercel

```
naukri_Platform/
├── backend/              # Backend API
│   ├── server.js
│   └── ...
├── frontend/             # React Frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── vercel.json          # Backend configuration
└── .gitignore
```

## Environment Variables Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/naukri_platform
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
```

## Troubleshooting

### CORS Issues
- Ensure `CLIENT_URL` in backend matches your frontend URL exactly
- Redeploy backend after updating environment variables

### API Connection Failed
- Check `REACT_APP_API_URL` has `/api` at the end
- Verify backend is running at the URL
- Check browser console for errors

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check IP whitelist in Atlas (use 0.0.0.0/0 for all IPs)
- Ensure database user has read/write permissions

### Build Failures
- Check all dependencies are in package.json
- Ensure Node version compatibility (use Node 18+)
- Review build logs in Vercel dashboard

## Alternative: Deploy Frontend & Backend Separately

You can also deploy to:
- **Backend**: Railway, Render, Heroku
- **Frontend**: Vercel, Netlify, GitHub Pages

Just update the API URLs accordingly!

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and populated
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Test authentication (login/register)
- [ ] Test job search and filters
- [ ] Test job applications
- [ ] Test saved jobs feature
- [ ] Mobile responsiveness checked

## Custom Domain (Optional)

1. Go to your project in Vercel
2. Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed
5. Update `CLIENT_URL` in backend

---

**Need Help?** Check Vercel docs: https://vercel.com/docs
