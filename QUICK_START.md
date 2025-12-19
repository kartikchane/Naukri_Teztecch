# 🚀 Quick Start Guide - Teztechh Naukri Platform

## Prerequisites Check

Make sure you have:
- ✅ Node.js v22.19.0 (installed)
- ✅ MongoDB running locally
- ✅ Dependencies installed (backend: 29 packages, frontend: 1311 packages)

---

## Step-by-Step Running Instructions

### 1️⃣ Start MongoDB (if not running)

```powershell
# Check if MongoDB is running
Get-Process -Name mongod -ErrorAction SilentlyContinue

# If not running, start MongoDB service
# (Adjust path based on your MongoDB installation)
Start-Service MongoDB
```

---

### 2️⃣ Start Backend Server

Open PowerShell Terminal #1:

```powershell
cd d:\demo_project\naukri_Platform
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node backend/server.js`
Server is running on port 5000
Environment: development
MongoDB Connected: localhost
```

✅ **Backend is ready at:** `http://localhost:5000`

---

### 3️⃣ Start Frontend Server

Open PowerShell Terminal #2 (new terminal):

```powershell
cd d:\demo_project\naukri_Platform\frontend
npm start
```

**Note:** React might take 30-60 seconds to compile initially.

**Expected Output:**
```
Compiled successfully!

You can now view naukri-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://10.x.x.x:3000

webpack compiled successfully
```

✅ **Frontend is ready at:** `http://localhost:3000`

**The browser will automatically open to `http://localhost:3000`**

---

## 🌐 Access the Application

Once both servers are running:

1. **Home Page**: http://localhost:3000
2. **Jobs Page**: http://localhost:3000/jobs
3. **Login**: http://localhost:3000/login
4. **Register**: http://localhost:3000/register

---

## 🎯 Testing the New Features

### Test #1: Category Filtering

1. Go to home page (http://localhost:3000)
2. Scroll to "Explore by category" section
3. Click **"Software Development"** card
4. ✅ You should see:
   - URL changes to: `/jobs?category=Software%20Development`
   - Header shows: "Software Development Jobs"
   - Job count displayed
   - All Software Development jobs listed
5. Try other categories too!

---

### Test #2: Apply Button on Job Cards

1. On home page, scroll to "Featured jobs" section
2. Find any job card
3. You'll see TWO buttons:
   - **"View Details"** (outline button)
   - **"Apply Now"** (gradient blue-purple button)
4. Click **"Apply Now"**
5. ✅ Beautiful modal should open with:
   - Job title and company in gradient header
   - Application form fields
   - Resume upload area

---

### Test #3: Complete Application Flow

1. Click "Apply Now" on any job
2. Fill in the form:
   ```
   Email: test@example.com
   Phone: +91 9876543210
   Experience: 3 years
   Notice Period: 30 days
   Current CTC: 6 LPA
   Expected CTC: 8 LPA
   Cover Letter: [Write something]
   Resume: [Upload PDF/DOC (optional)]
   ```
3. Click "Submit Application"
4. ✅ You should see:
   - Success toast notification
   - Modal closes automatically
   - Application saved to database

---

### Test #4: View Job Details

1. Click **"View Details"** on any job card
2. ✅ You should see:
   - Full job description
   - Skills required (as badges)
   - Responsibilities list
   - Requirements list
   - Company information
   - Large "Apply Now" button at top

---

### Test #5: Teztechh Branding

1. Look at the top navigation bar
2. ✅ You should see:
   - "TT" logo in gradient box (blue to purple)
   - "Teztechh" text in gradient
   - "Naukri Platform" subtitle below

---

## 🎨 Visual Elements to Notice

### Hero Section
- Beautiful gradient background (blue → purple)
- Floating decorative circles
- Badge: "🎯 India's Leading Job Portal"
- Large search bar with shadow
- Popular search pills

### Category Cards
- Hover effect: card lifts up slightly
- Border changes to blue on hover
- Icon scales up
- Smooth animations

### Job Cards
- Two prominent buttons side by side
- "Apply Now" in gradient blue-purple
- "View Details" as outline
- All job information clearly displayed

### Apply Modal
- Gradient header matching brand colors
- Professional form layout
- File upload with drag-and-drop zone
- Character counter on cover letter
- Loading spinner during submission

---

## 📱 Test Responsive Design

### On Desktop (Your Current View)
- Open browser DevTools (F12)
- Click "Toggle Device Toolbar" (Ctrl+Shift+M)
- Try different screen sizes:
  - iPhone 12 (390px)
  - iPad (768px)
  - Desktop (1920px)

✅ Everything should adapt perfectly!

---

## 🐛 Troubleshooting

### Problem: Port 3000 already in use

**Solution:**
```powershell
# Find and kill the process
$process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($process) {
    Stop-Process -Id $process -Force
    Write-Host "Killed process on port 3000"
}
# Then run npm start again
cd d:\demo_project\naukri_Platform\frontend
npm start
```

---

### Problem: React server starts then exits immediately

**Solution 1 - Try with explicit PORT:**
```powershell
cd d:\demo_project\naukri_Platform\frontend
$env:PORT=3000
$env:BROWSER='none'
npm start
```

**Solution 2 - Use npx:**
```powershell
cd d:\demo_project\naukri_Platform\frontend
npx react-scripts start
```

**Solution 3 - Delete node_modules and reinstall:**
```powershell
cd d:\demo_project\naukri_Platform\frontend
Remove-Item -Recurse -Force node_modules
npm install
npm start
```

---

### Problem: MongoDB not connected

**Solution:**
```powershell
# Check MongoDB status
mongosh

# If connection fails, start MongoDB
net start MongoDB
# or
Start-Service MongoDB

# Verify it's listening on port 27017
netstat -ano | findstr ":27017"
```

---

### Problem: Backend errors

**Solution:**
```powershell
# Check if .env file exists
cd d:\demo_project\naukri_Platform
Get-Content .env

# Should contain:
# MONGODB_URI=mongodb://localhost:27017/naukri_platform
# JWT_SECRET=your_jwt_secret_key_here
# PORT=5000

# If missing, create it
@"
MONGODB_URI=mongodb://localhost:27017/naukri_platform
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding UTF8
```

---

### Problem: Compilation warnings

The following warnings are normal and don't affect functionality:
- ❌ `DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE` - Just a deprecation warning
- ❌ `DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE` - Just a deprecation warning
- ❌ `DEP0060` - util._extend deprecation - Just a warning
- ❌ ESLint warnings about unused vars - Non-critical

These are from react-scripts and won't prevent the app from running!

---

## 🔄 Complete Restart Procedure

If anything goes wrong, do a complete restart:

### 1. Stop all servers
```powershell
# Close all terminal windows, or press Ctrl+C in each

# Or kill all Node processes
Get-Process -Name node | Stop-Process -Force
```

### 2. Start fresh
```powershell
# Terminal 1 - Backend
cd d:\demo_project\naukri_Platform
npm run dev

# Terminal 2 - Frontend (after backend is running)
cd d:\demo_project\naukri_Platform\frontend
npm start
```

---

## ✅ Success Indicators

You know everything is working when:

1. ✅ Terminal 1 shows:
   ```
   Server is running on port 5000
   MongoDB Connected: localhost
   ```

2. ✅ Terminal 2 shows:
   ```
   Compiled successfully!
   Local: http://localhost:3000
   ```

3. ✅ Browser opens to http://localhost:3000

4. ✅ You see the Teztechh logo in the navbar

5. ✅ Home page loads with gradient hero section

6. ✅ Featured jobs show "View Details" and "Apply Now" buttons

7. ✅ Clicking categories filters jobs correctly

8. ✅ Apply modal opens with beautiful form

---

## 📊 Quick Feature Checklist

Test each feature:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Teztechh logo visible in navbar
- [ ] Home page hero section with gradient
- [ ] Featured jobs section loads
- [ ] Job cards show both buttons (View Details + Apply Now)
- [ ] Category cards are clickable
- [ ] Clicking "Software Development" filters jobs
- [ ] Category header shows job count
- [ ] "Apply Now" opens modal
- [ ] Application form has all fields
- [ ] Resume upload works
- [ ] "View Details" shows full job info
- [ ] Apply button on job details page works
- [ ] All pages responsive on mobile

---

## 🎉 You're All Set!

Your Teztechh Naukri Platform is now ready with:
- ✨ Teztechh branding
- 💼 Featured jobs with action buttons
- 📝 Comprehensive application form
- 🔍 Category-based job filtering
- 📱 Fully responsive design
- 🎨 Modern UI matching the reference website

**Enjoy testing the platform!** 🚀

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify both servers are running
3. Check browser console for errors (F12)
4. Review `FEATURES_ADDED.md` for detailed feature documentation
5. Check backend terminal for API errors
6. Check frontend terminal for compilation errors

---

**Last Updated:** December 17, 2025  
**Version:** 1.0.0  
**Status:** ✅ All Features Implemented and Tested
