# 🚀 Deployment Guide - Naukri Platform

This guide will help you deploy your Naukri Platform to production.

---

## Table of Contents
1. [Deployment Checklist](#deployment-checklist)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment Options](#backend-deployment-options)
4. [Frontend Deployment Options](#frontend-deployment-options)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment](#post-deployment)

---

## Deployment Checklist

Before deploying, ensure:

- [ ] MongoDB Atlas cluster is created
- [ ] Environment variables are configured
- [ ] .gitignore is properly set up
- [ ] Code is pushed to GitHub
- [ ] JWT secret is changed to a secure value
- [ ] File upload limits are appropriate
- [ ] CORS settings are configured for production
- [ ] API endpoints are tested
- [ ] Error handling is in place

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
Visit: https://www.mongodb.com/cloud/atlas

### 2. Create a New Cluster
- Choose free tier (M0)
- Select region closest to your users
- Create cluster

### 3. Configure Database Access
- Database Access → Add New Database User
- Create username and password
- Select "Read and write to any database"

### 4. Configure Network Access
- Network Access → Add IP Address
- Add `0.0.0.0/0` for development (allow all)
- For production, add specific IPs

### 5. Get Connection String
- Cluster → Connect → Connect your application
- Copy connection string
- Replace `<password>` with your database password
- Replace `<dbname>` with `naukri_platform`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/naukri_platform?retryWrites=true&w=majority
```

---

## Backend Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Step 1: Install Heroku CLI
Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Login to Heroku
```bash
heroku login
```

#### Step 3: Create Heroku App
```bash
heroku create naukri-platform-api
```

#### Step 4: Set Environment Variables
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_secure_jwt_secret"
heroku config:set CLIENT_URL="https://your-frontend-url.com"
heroku config:set NODE_ENV="production"
```

#### Step 5: Add Procfile
Create `Procfile` in root:
```
web: node backend/server.js
```

#### Step 6: Deploy
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

#### Step 7: Open App
```bash
heroku open
```

---

### Option 2: Railway.app

#### Step 1: Visit Railway
https://railway.app/

#### Step 2: Connect GitHub
- Sign up with GitHub
- Import your repository

#### Step 3: Configure Variables
Add environment variables in Railway dashboard

#### Step 4: Deploy
Railway auto-deploys on git push

---

### Option 3: Render.com

#### Step 1: Visit Render
https://render.com/

#### Step 2: Create New Web Service
- Connect GitHub repository
- Select Node runtime
- Build command: `npm install`
- Start command: `node backend/server.js`

#### Step 3: Add Environment Variables
Add all .env variables in Render dashboard

#### Step 4: Deploy
Render auto-deploys on git push

---

### Option 4: DigitalOcean App Platform

#### Step 1: Create DigitalOcean Account
https://www.digitalocean.com/

#### Step 2: Create New App
- Connect GitHub repository
- Choose Node.js environment

#### Step 3: Configure
- HTTP Port: 5000
- Run Command: `node backend/server.js`

#### Step 4: Add Environment Variables
Add all variables in app settings

#### Step 5: Deploy
DigitalOcean handles deployment

---

## Frontend Deployment Options

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Navigate to Frontend
```bash
cd frontend
```

#### Step 3: Build Production
```bash
npm run build
```

#### Step 4: Deploy
```bash
vercel
```

#### Step 5: Set Environment Variables
In Vercel dashboard, add:
- `REACT_APP_API_URL`: Your backend URL

#### Alternative: GitHub Integration
- Connect Vercel to GitHub
- Auto-deploy on push

---

### Option 2: Netlify

#### Step 1: Build Frontend
```bash
cd frontend
npm run build
```

#### Step 2: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 3: Deploy
```bash
netlify deploy --prod --dir=build
```

#### Alternative: Drag & Drop
- Visit https://app.netlify.com/drop
- Drag `build` folder

---

### Option 3: AWS S3 + CloudFront

#### Step 1: Create S3 Bucket
- Go to AWS S3
- Create bucket
- Enable static website hosting

#### Step 2: Build and Upload
```bash
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name
```

#### Step 3: Create CloudFront Distribution
- Create distribution
- Origin: S3 bucket
- Enable HTTPS

---

### Option 4: GitHub Pages

#### Step 1: Install gh-pages
```bash
cd frontend
npm install --save-dev gh-pages
```

#### Step 2: Add Scripts to package.json
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

#### Step 3: Add homepage
```json
"homepage": "https://yourusername.github.io/naukri-platform"
```

#### Step 4: Deploy
```bash
npm run deploy
```

---

## Environment Variables

### Backend (.env)

**Development:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/naukri_platform
JWT_SECRET=dev_secret_key
CLIENT_URL=http://localhost:3000
```

**Production:**
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/naukri_platform
JWT_SECRET=super_secure_random_string_change_this
CLIENT_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### Frontend

Create `.env.production` in frontend:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

---

## Update API URL in Frontend

### Option 1: Environment Variable
In `frontend/src/utils/api.js`:
```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  // ...
});
```

### Option 2: Direct URL
```javascript
const API = axios.create({
  baseURL: 'https://your-backend-domain.com/api',
  // ...
});
```

---

## Post-Deployment

### 1. Test API Endpoints
```bash
curl https://your-backend-url.com/api/health
```

### 2. Test Frontend
Visit your frontend URL and:
- Register a new user
- Login
- Browse jobs
- Test job application

### 3. Monitor Logs

**Heroku:**
```bash
heroku logs --tail
```

**Railway/Render:**
Check logs in dashboard

### 4. Set Up Monitoring

**Recommended Services:**
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics
- **Uptime Robot** - Uptime monitoring

### 5. Enable HTTPS
Most platforms enable HTTPS automatically

### 6. Configure Custom Domain

**Backend:**
- Add custom domain in hosting dashboard
- Update DNS records

**Frontend:**
- Add custom domain
- Update CNAME records

---

## Production Best Practices

### Security
- ✅ Use strong JWT secret
- ✅ Enable HTTPS only
- ✅ Implement rate limiting
- ✅ Sanitize user inputs
- ✅ Use helmet.js for security headers
- ✅ Keep dependencies updated

### Performance
- ✅ Enable gzip compression
- ✅ Use CDN for static assets
- ✅ Implement caching
- ✅ Optimize database queries
- ✅ Use connection pooling

### Monitoring
- ✅ Set up error tracking
- ✅ Monitor API performance
- ✅ Track user analytics
- ✅ Set up uptime monitoring
- ✅ Configure alerts

---

## Common Deployment Issues

### Issue: CORS Error
**Solution:** Update CORS configuration in backend:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
```

### Issue: MongoDB Connection Failed
**Solution:**
- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Ensure password doesn't contain special characters

### Issue: Build Failed
**Solution:**
- Check Node.js version compatibility
- Clear node_modules and reinstall
- Check for missing environment variables

### Issue: 404 on Frontend Routes
**Solution:** Add redirect rules

**Netlify** (`_redirects` file):
```
/*    /index.html   200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Scaling Considerations

### Database
- Use MongoDB Atlas M10+ for production
- Enable database indexes
- Implement caching (Redis)

### Backend
- Use load balancer
- Implement horizontal scaling
- Use microservices architecture

### Frontend
- Use CDN (CloudFlare, AWS CloudFront)
- Implement lazy loading
- Optimize images and assets

### File Storage
- Move to AWS S3 or similar
- Use signed URLs for uploads
- Implement CDN for file delivery

---

## Cost Estimation

### Free Tier Options:
- **MongoDB Atlas:** 512MB free
- **Heroku/Railway:** Free tier available
- **Vercel/Netlify:** Free for hobby projects
- **Total:** $0/month for low traffic

### Production Setup:
- **MongoDB Atlas M10:** $50-100/month
- **Backend Hosting:** $20-50/month
- **Frontend Hosting:** $0-20/month
- **Domain:** $10-15/year
- **Total:** ~$70-150/month

---

## Deployment Checklist

Before going live:

- [ ] All environment variables set
- [ ] Database backed up
- [ ] Error tracking configured
- [ ] Analytics set up
- [ ] SEO meta tags added
- [ ] Custom domain configured
- [ ] SSL certificate enabled
- [ ] Performance tested
- [ ] Security audit completed
- [ ] Documentation updated

---

## Support & Resources

### Documentation
- [Heroku Docs](https://devcenter.heroku.com/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Railway Docs](https://docs.railway.app/)

### Community
- Stack Overflow
- GitHub Issues
- Discord/Slack communities

---

**Congratulations on deploying your Naukri Platform! 🎉**

For questions, contact: info@teztecch.com
