# Naukri Platform - Complete Setup Guide

## 📁 Project Structure

```
naukri_Platform/
├── backend/              # Node.js/Express API Server
├── frontend/             # Main Website (React) - Users & Employers
├── admin-panel/          # Separate Admin Application (React)
└── create-admin.js       # Admin user creation script
```

## 🚀 Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start backend:
```bash
npm start
```

Backend runs at: **http://localhost:5000**

### 2. Main Website Setup (Users & Employers)

```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

Main website runs at: **http://localhost:3000**

### 3. Admin Panel Setup (Separate Application)

```bash
cd admin-panel
npm install
```

Start admin panel:
```bash
npm start
```

Admin panel runs at: **http://localhost:3001**

## 👥 User Types & Access

### Main Website (Port 3000)
- **Job Seekers**: Can browse jobs, apply, save jobs
- **Employers**: Can post jobs, manage applications
- **URLs**:
  - Login: http://localhost:3000/login
  - Register: http://localhost:3000/register
  - Jobs: http://localhost:3000/jobs

### Admin Panel (Port 3001)
- **Admins Only**: Complete platform management
- **URLs**:
  - Login: http://localhost:3001/login
  - Dashboard: http://localhost:3001/dashboard
  - ⚠️ **No signup** - admins must be created via script

## 🔐 Creating Admin User

From root directory:

```bash
node create-admin.js
```

Default credentials:
- Email: admin@naukri.com
- Password: admin123456

## 🏃 Running All Services

You need **3 terminals**:

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Main Website
```bash
cd frontend
npm run dev
```

### Terminal 3 - Admin Panel
```bash
cd admin-panel
npm start
```

## 🌐 Access URLs

| Service | URL | Users |
|---------|-----|-------|
| Backend API | http://localhost:5000 | All |
| Main Website | http://localhost:3000 | Job Seekers, Employers |
| Admin Panel | http://localhost:3001 | Admins Only |

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│           MongoDB Database                  │
└──────────────┬──────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────┐
│         Backend (Port 5000)                  │
│    - Authentication                          │
│    - API Endpoints                           │
│    - Business Logic                          │
└────┬──────────────────────┬──────────────────┘
     │                      │
     ↓                      ↓
┌─────────────────┐  ┌──────────────────────┐
│ Main Website    │  │  Admin Panel         │
│ (Port 3000)     │  │  (Port 3001)         │
│                 │  │                      │
│ - Job Seekers   │  │ - Platform Admin     │
│ - Employers     │  │ - Dashboard          │
│ - Job Browsing  │  │ - User Management    │
│ - Applications  │  │ - Job Management     │
└─────────────────┘  └──────────────────────┘
```

## 🔒 Security Features

### Main Website
- JWT authentication
- Role-based access (jobseeker/employer)
- Public job browsing
- Protected profile routes

### Admin Panel
- Separate authentication tokens
- Admin-only access verification
- Independent session management
- No connection to main website UI

## 🛠️ Development

### Adding New Admin Features

All admin features go in `admin-panel/` folder:
```bash
cd admin-panel/src/pages
# Create new page components here
```

### Adding New Website Features

All website features go in `frontend/` folder:
```bash
cd frontend/src/pages
# Create new page components here
```

## 📦 Production Deployment

### Backend
```bash
cd backend
npm start
```

### Main Website
```bash
cd frontend
npm run build
# Deploy 'build' folder
```

### Admin Panel
```bash
cd admin-panel
npm run build
# Deploy 'build' folder to separate subdomain
# Example: admin.yoursite.com
```

## 🎯 Key Differences

| Feature | Main Website | Admin Panel |
|---------|-------------|-------------|
| Port | 3000 | 3001 |
| Users | Job Seekers, Employers | Admins Only |
| Signup | ✅ Available | ❌ Not Available |
| Public Access | ✅ Yes | ❌ No |
| Navbar/Footer | ✅ Yes | ❌ No |
| Layout | Website Layout | Admin Dashboard |
| Token Storage | `token`, `user` | `adminToken`, `adminUser` |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# For Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Admin Login Not Working
1. Ensure backend is running
2. Check admin user exists in database
3. Verify `.env` has correct API URL
4. Check browser console for errors

### Cannot Create Admin
1. Ensure MongoDB is running
2. Check backend `.env` has MONGO_URI
3. Run `node create-admin.js` from root directory

---

## 📞 Support

For issues:
1. Check all 3 services are running
2. Verify environment variables
3. Check MongoDB connection
4. Review browser console for errors

**Happy Coding! 🚀**
