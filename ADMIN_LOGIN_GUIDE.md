# Admin Login Guide - Naukri Platform

## 🔐 Admin Access URLs

### Frontend URLs:
- **Admin Login Page**: `http://localhost:3000/admin/login`
- **Admin Dashboard**: `http://localhost:3000/admin/dashboard`
- **Admin Jobs Management**: `http://localhost:3000/admin/jobs`
- **Admin Users Management**: `http://localhost:3000/admin/users`
- **Admin Applications**: `http://localhost:3000/admin/applications`

### ✨ Admin Interface Features:
- 🚫 **No Main Website Components**: Admin interface में main website का Navbar/Footer नहीं दिखता
- 📊 **Dedicated Admin Sidebar**: Left-side navigation with all admin features
- 👤 **Admin User Profile**: Sidebar में admin की info display होती है
- 🔒 **Separate Layout**: Admin pages completely isolated from main website
- 🏠 **Quick Access**: "View Website" button से main site पर जा सकते हैं
- 🚪 **Easy Logout**: Sidebar में logout button available है

### Backend API Endpoints:
- **Admin Login**: `POST /api/auth/admin-login`
- **Admin Stats**: `GET /api/admin/stats`
- **Admin Jobs**: `GET /api/admin/jobs`
- **Admin Users**: `GET /api/admin/users`
- **Admin Applications**: `GET /api/admin/applications`

---

## 👤 Admin Login Process

### Using Admin Login Page:

1. **Navigate to Admin Login**:
   ```
   http://localhost:3000/admin/login
   ```

2. **Enter Admin Credentials**:
   - Email: Your admin email
   - Password: Your admin password

3. **After Successful Login**:
   - आप automatically `/admin/dashboard` पर redirect हो जाएंगे
   - Admin panel में access मिल जाएगा

### Security Features:
- ✅ Admin role verification करता है
- ✅ Non-admin users को access नहीं देता
- ✅ Unauthorized access attempts को log करता है
- ✅ Separate admin login endpoint (`/api/auth/admin-login`)

---

## 🛠️ Creating an Admin User

यदि आपके पास admin user नहीं है, तो आप निम्न तरीकों से बना सकते हैं:

### Method 1: Using makeAdmin Script

1. पहले एक regular user register करें:
   ```
   http://localhost:3000/register
   ```

2. Backend directory में जाएं:
   ```powershell
   cd backend
   ```

3. makeAdmin script run करें:
   ```powershell
   node scripts/makeAdmin.js user@example.com
   ```

### Method 2: Direct Database Update (MongoDB)

MongoDB में connect करके:
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 3: Manual Script (New File)

Backend में एक script बनाएं `backend/create-admin.js`:

```javascript
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminData = {
      name: 'Admin User',
      email: 'admin@naukri.com',
      password: 'admin123456', // Change this!
      role: 'admin'
    };

    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('❌ Admin already exists');
      process.exit(1);
    }

    const admin = await User.create(adminData);
    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run करें:
```powershell
node backend/create-admin.js
```

---

## 🔒 Admin Features

Admin panel में निम्नलिखित features हैं:

### Dashboard (`/admin/dashboard`)
- Total users count
- Total jobs count
- Total applications count
- System statistics

### Jobs Management (`/admin/jobs`)
- View all jobs
- Delete jobs
- Create new jobs
- Applications count per job

### Users Management (`/admin/users`)
- View all users
- User details (name, email, role)
- Registration dates

### Applications Management (`/admin/applications`)
- View all job applications
- Applicant details
- Application status

---

## 🚀 Testing Admin Login

### Step 1: Start Backend
```powershell
cd backend
npm start
```

### Step 2: Start Frontend
```powershell
cd frontend
npm run dev
```

### Step 3: Access Admin Login
```
http://localhost:3000/admin/login
```

### Step 4: Test Credentials
- Email: `admin@naukri.com` (या जो भी admin email हो)
- Password: आपका admin password

---

## 🔐 Security Best Practices

1. **Strong Passwords**: हमेशा strong passwords use करें
2. **Environment Variables**: Admin credentials को `.env` में store करें
3. **HTTPS**: Production में HTTPS use करें
4. **Rate Limiting**: Login attempts को limit करें
5. **Session Management**: Regular token expiration implement करें
6. **Audit Logs**: Admin actions को log करें

---

## 📝 API Testing (Postman)

### Admin Login Request:

**Endpoint**: `POST http://localhost:5000/api/auth/admin-login`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Body** (JSON):
```json
{
  "email": "admin@naukri.com",
  "password": "your_password"
}
```

**Response** (Success):
```json
{
  "_id": "user_id",
  "name": "Admin User",
  "email": "admin@naukri.com",
  "role": "admin",
  "token": "jwt_token_here"
}
```

**Response** (Non-Admin):
```json
{
  "message": "Access denied. Admin credentials required."
}
```

---

## 🐛 Troubleshooting

### Problem: "Access denied. Admin credentials required."
**Solution**: Check if user's role is 'admin' in database

### Problem: Cannot access `/admin/dashboard`
**Solution**: 
1. First login through `/admin/login`
2. Check if token is stored in localStorage
3. Verify user role is 'admin'

### Problem: Admin routes not working
**Solution**: 
1. Check if backend is running
2. Verify JWT_SECRET in `.env`
3. Check console for errors

---

## 📧 Support

यदि कोई problem आए तो:
1. Backend console logs check करें
2. Browser console check करें
3. Network tab में API responses देखें

---

## 🎯 Quick Links

- **Regular Login**: http://localhost:3000/login
- **Admin Login**: http://localhost:3000/admin/login
- **Register**: http://localhost:3000/register
- **Home**: http://localhost:3000/

---

**Created**: January 3, 2026
**Platform**: Naukri Job Portal
**Admin Panel**: Fully Functional ✅
