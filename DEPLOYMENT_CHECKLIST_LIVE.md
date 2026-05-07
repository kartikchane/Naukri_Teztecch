# 🚀 LIVE DEPLOYMENT CHECKLIST - Naukri Platform

---

## ✅ REQUIRED ENVIRONMENT VARIABLES

Create these on your deployment platform (Vercel/Render/Heroku):

### 1. **Database**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/naukri_platform
```

### 2. **JWT & Security**
```
JWT_SECRET=use_a_strong_random_string_not_your_local_one
NODE_ENV=production
```

### 3. **Razorpay** (Payment)
```
RAZORPAY_KEY_ID=rzp_live_SkVVZstOOTgqYO
RAZORPAY_KEY_SECRET=MtP3vflMyhEIIcZBmTm5AvCY
```
✅ **Status**: Live keys already set!

### 4. **AWS S3** (File Uploads - Videos, Resumes, Documents)
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=naukri-platform-uploads
AWS_S3_REGION=ap-south-1
AWS_S3_URL=https://naukri-platform-uploads.s3.ap-south-1.amazonaws.com
```
⚠️ **Action Needed**: Create AWS S3 bucket and IAM user (see AWS_S3_IMPLEMENTATION.md)

### 5. **Google OAuth** (Social Login)
```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_secret
```
⚠️ **Action Needed**: Get production Client ID from Google Cloud Console

### 6. **Email Notifications** (Reminders, Updates)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password (from Gmail)
EMAIL_FROM=noreply@yourcompany.com
FRONTEND_URL=https://your-production-url.com
CLIENT_URL=https://your-production-url.com
```
⚠️ **Action Needed**: Generate Gmail app password

### 7. **CORS & URLs**
```
# Update with your production URLs
FRONTEND_URL=https://your-frontend-domain.com
CLIENT_URL=https://your-frontend-domain.com
API_URL=https://your-backend-domain.com
```

### 8. **Admin Settings** (Optional)
```
ADMIN_EMAIL=admin@yourcompany.com
MAX_FILE_SIZE=5242880
```

---

## 📋 PRE-DEPLOYMENT VERIFICATION

### ✅ Backend Checks
- [ ] All environment variables set on deployment platform
- [ ] .gitignore is configured (no .env, node_modules in git)
- [ ] vercel.json or Procfile exists in backend
- [ ] Database connection tested
- [ ] API endpoints tested locally

### ✅ Frontend Checks  
- [ ] Update API URLs to production backend
- [ ] Google Client ID updated for production domain
- [ ] Build process tested: `npm run build`
- [ ] No hardcoded localhost URLs
- [ ] REACT_APP_API_URL set correctly

### ✅ Database
- [ ] MongoDB Atlas cluster created
- [ ] Network access configured (allow production IP)
- [ ] Backup enabled
- [ ] Admin account created

### ✅ Third-Party Services
- [ ] **Razorpay**: Live keys configured ✅ (Already done!)
- [ ] **AWS S3**: Bucket created, IAM user created
- [ ] **Google OAuth**: Production Client ID obtained
- [ ] **Gmail**: App password generated

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### STEP 1: Set Up AWS S3
```bash
1. Go to https://console.aws.amazon.com/s3/
2. Create bucket: naukri-platform-uploads
3. Go to IAM → Create user: naukri-platform-backend
4. Attach: AmazonS3FullAccess policy
5. Create Access Key → Save AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
6. Add to environment variables ✅
```

### STEP 2: Set Up Google OAuth for Production
```bash
1. Go to https://console.cloud.google.com/
2. Select your project
3. APIs & Services → Credentials
4. Update OAuth Client settings:
   - Add production frontend URL to "Authorized JavaScript origins"
   - Add production URLs to "Authorized redirect URIs"
5. Copy Client ID
6. Add GOOGLE_CLIENT_ID to environment variables ✅
```

### STEP 3: Generate Gmail App Password
```bash
1. Go to https://myaccount.google.com/
2. Security → App passwords
3. Generate password for "Mail" and "Windows Computer"
4. Copy & use as EMAIL_PASSWORD ✅
```

### STEP 4: Deploy Backend
**Option A: Vercel** (Recommended)
```bash
1. Push code to GitHub
2. Connect to Vercel: https://vercel.com
3. Select naukri_Platform repository
4. Set Environment Variables (from above)
5. Deploy! ✅
```

**Option B: Render.com**
```bash
1. Connect GitHub to Render.com
2. Create new Web Service
3. Command: npm start
4. Set all environment variables
5. Deploy! ✅
```

### STEP 5: Deploy Frontend
**Vercel** (Recommended for React)
```bash
1. In frontend directory
2. Vercel CLI: npm install -g vercel
3. Run: vercel --prod
4. Set REACT_APP_API_URL to production backend
5. Deploy! ✅
```

### STEP 6: Test Everything
```bash
1. Open production URL
2. Test Google login
3. Test plan subscription (Razorpay)
4. Test file upload (should go to S3)
5. Test email notifications
6. Check Razorpay dashboard for payments ✅
```

---

## 🔐 SECURITY CHECKLIST

- [ ] JWT_SECRET changed from default
- [ ] Database credentials secure (use Atlas IP whitelist)
- [ ] AWS keys not exposed in code
- [ ] Google secrets not in repository
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled on APIs
- [ ] HTTPS enforced
- [ ] Database backups enabled

---

## 📊 MONITORING & MAINTENANCE

After deployment:
- [ ] Monitor API errors in logs
- [ ] Check Razorpay dashboard for payment issues
- [ ] Monitor S3 storage usage
- [ ] Set up alerts for errors
- [ ] Regular database backups
- [ ] Monitor server performance

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: Payment fails with "razorpay invalid"
**Fix**: Verify RAZORPAY_KEY_ID and KEY_SECRET are set correctly

### Issue: File uploads fail
**Fix**: Check AWS S3 bucket permissions and credentials

### Issue: Google login doesn't work
**Fix**: Verify GOOGLE_CLIENT_ID matches production domain

### Issue: Email not sending
**Fix**: Check EMAIL_PASSWORD (Gmail app password, not regular password)

### Issue: Database connection timeout
**Fix**: Whitelist production IP in MongoDB Atlas

---

## 📝 POST-DEPLOYMENT

1. ✅ Verify all features working
2. ✅ Test payment flow end-to-end
3. ✅ Monitor error logs
4. ✅ Set up automated backups
5. ✅ Document any issues
6. ✅ Plan maintenance window

---

**Ready to deploy? Let's go! 🚀**
