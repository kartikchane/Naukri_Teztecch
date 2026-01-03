# Backend + Admin Panel - Single Deployment Guide

## 🎯 Overview

Backend और Admin Panel को एक साथ deploy करें। जब आप backend URL खोलेंगे तो Admin Dashboard दिखेगा।

## 📦 Structure

```
Backend URL: https://your-backend.onrender.com
├── /                        → Admin Panel (Dashboard)
├── /login                   → Admin Login Page
├── /dashboard               → Admin Dashboard
├── /api/auth                → Authentication API
├── /api/jobs                → Jobs API
├── /api/admin               → Admin API
└── /api/*                   → All other APIs
```

## 🚀 Deployment Steps

### 1. Build Admin Panel

```bash
cd admin-panel
npm install
npm run build
```

यह `admin-panel/build` folder create करेगा।

### 2. Push to GitHub

```bash
git add .
git commit -m "Integrated admin panel with backend"
git push origin main
```

### 3. Deploy to Render

#### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service
3. Settings → Build & Deploy
4. Build Command: `cd backend && npm install`
5. Start Command: `node backend/server.js`
6. Environment Variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
7. Click "Manual Deploy"

#### Option B: Using render.yaml

Create `render.yaml` in root:

```yaml
services:
  - type: web
    name: naukri-backend-admin
    env: node
    plan: free
    buildCommand: cd admin-panel && npm install && npm run build && cd ../backend && npm install
    startCommand: cd backend && NODE_ENV=production node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
```

### 4. Access URLs

After deployment:

- **Admin Dashboard**: `https://your-backend.onrender.com/`
- **Admin Login**: `https://your-backend.onrender.com/login`
- **API Endpoints**: `https://your-backend.onrender.com/api/*`

## ⚙️ How It Works

### Development Mode (Local)
- Backend: http://localhost:5000 (API only)
- Admin Panel: http://localhost:3001 (Separate app)

### Production Mode (Render)
- Backend serves both API and Admin Panel
- Root URL (/) → Admin Panel
- /api/* → Backend APIs

## 🔧 Configuration

### Backend (server.js)

Production में:
```javascript
// Serve Admin Panel static files
app.use(express.static(path.join(__dirname, '../admin-panel/build')));

// All non-API routes → Admin Panel
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../admin-panel/build/index.html'));
  } else {
    next();
  }
});
```

### Admin Panel (.env)

```env
REACT_APP_API_URL=/api
```

यह relative path use करता है, so same domain पर API calls होंगी।

## 🎨 Benefits

✅ **Single URL** - One deployment, one domain
✅ **Cost Effective** - Free tier पर easily run होगा
✅ **Easy CORS** - Same domain, no CORS issues
✅ **Simple Management** - Ek hi service manage करनी है
✅ **Fast Loading** - Static files serve होती हैं

## 🐛 Troubleshooting

### Issue: Admin Panel not loading

**Solution**: Ensure build folder exists
```bash
cd admin-panel
npm run build
```

### Issue: API routes not working

**Solution**: Check if routes start with `/api/`

### Issue: 404 on refresh

**Solution**: Backend में catch-all route है:
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../admin-panel/build/index.html'));
});
```

## 📝 Deployment Checklist

- [ ] Admin panel build created (`admin-panel/build/`)
- [ ] Backend environment variables set
- [ ] CORS configured for production
- [ ] MongoDB connection string updated
- [ ] JWT_SECRET set
- [ ] Code pushed to GitHub
- [ ] Render service deployed
- [ ] Admin login working
- [ ] API endpoints working

## 🔐 Security Notes

1. **Admin Only**: No signup on admin panel
2. **JWT Token**: Separate storage (`adminToken`)
3. **Role Check**: Backend verifies admin role
4. **HTTPS**: Always use HTTPS in production

## 🌐 Live Example

```
Your Render URL: https://naukri-backend-xyz.onrender.com

Admin Panel: https://naukri-backend-xyz.onrender.com/
API Health: https://naukri-backend-xyz.onrender.com/api/health
Admin Login API: https://naukri-backend-xyz.onrender.com/api/auth/admin-login
```

---

**🎉 Ready to Deploy!**

Just build, push, and deploy - Your admin panel will be live on backend URL!
