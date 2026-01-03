# Render Deployment Troubleshooting

## Current Issue: Admin Panel Not Loading

### Symptoms
- Opening backend URL shows JSON API response
- Admin panel not rendering

### Solutions

## ✅ Step 1: Verify Environment Variable on Render

1. Go to: https://dashboard.render.com/
2. Select your web service
3. Go to **Environment** tab
4. **CRITICAL**: Check if `NODE_ENV=production` is set
   - If NOT set, add it:
     - Key: `NODE_ENV`
     - Value: `production`
   - Click "Save Changes"
   - This will trigger automatic redeploy

## ✅ Step 2: Check Build Command

In Render Dashboard → Settings:

**Build Command should be:**
```bash
cd admin-panel && npm install && npm run build && cd ../backend && npm install
```

**Start Command should be:**
```bash
cd backend && NODE_ENV=production node server.js
```

## ✅ Step 3: Manual Redeploy

If auto-deploy didn't trigger:
1. Go to your service dashboard
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait 5-10 minutes for build to complete

## ✅ Step 4: Check Deployment Logs

1. In Render Dashboard, click **Logs**
2. Look for these messages:
   ```
   Building admin-panel...
   Compiled successfully
   Server is running on port 5000
   Environment: production
   ```

## ✅ Step 5: Verify Build Files Exist

After deployment completes, check logs for:
```
Build folder is ready to be deployed
```

## ✅ Step 6: Test After Deployment

1. Wait for "Live" status in Render
2. Open: `https://naukri-teztecch.onrender.com`
3. Should see admin login page
4. Test API: `https://naukri-teztecch.onrender.com/api/health`

---

## Common Issues

### Issue 1: NODE_ENV not set
**Solution**: Add `NODE_ENV=production` in Environment variables

### Issue 2: Build folder not created
**Solution**: Check build command includes `npm run build`

### Issue 3: Old deployment cached
**Solution**: Manual redeploy from dashboard

### Issue 4: Static files not serving
**Solution**: Verify build command completed successfully in logs

---

## Quick Fix Commands

If you need to rebuild locally and push:
```bash
cd admin-panel
npm run build
cd ..
git add admin-panel/build/
git commit -m "Rebuild admin panel"
git push origin main
```

---

## Expected Behavior

### Development (localhost):
- Backend on port 5000 shows JSON
- Admin panel on port 3001

### Production (Render):
- Backend URL shows admin panel
- API routes work: `/api/health`, `/api/jobs`, etc.

---

## Contact Support

If issue persists after all steps:
1. Check Render status page
2. Review complete deployment logs
3. Verify all environment variables are set
