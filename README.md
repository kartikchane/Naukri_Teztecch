# Naukri Platform - Job Portal

A full-stack job portal platform where job seekers can find opportunities and employers can post jobs.

## 🚀 Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)

## 📋 Features

### For Job Seekers
- Browse and search jobs
- Filter by category, location, salary
- Apply to jobs
- Save favorite jobs
- Create and manage profile
- Upload resume

### For Employers
- Post job openings
- Manage job listings
- View applications
- Company profile management

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd naukri_Platform
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**
```bash
cp .env.example .env
```
Edit `.env` file with your configuration.

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**

**Development mode (both frontend and backend):**
```bash
npm run dev:all
```

**Or run separately:**

Backend:
```bash
npm run dev
```

Frontend (in new terminal):
```bash
cd frontend
npm start
```

## 🌐 Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 📁 Project Structure

```
naukri_Platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Company.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── users.js
│   │   └── applications.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── controllers/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── uploads/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Jobs
- GET `/api/jobs` - Get all jobs
- GET `/api/jobs/:id` - Get single job
- POST `/api/jobs` - Create job (Employer only)
- PUT `/api/jobs/:id` - Update job (Employer only)
- DELETE `/api/jobs/:id` - Delete job (Employer only)

### Applications
- POST `/api/applications` - Apply for job
- GET `/api/applications/user` - Get user's applications
- GET `/api/applications/job/:jobId` - Get job applications (Employer only)

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/resume` - Upload resume

## 🎨 Default Admin Credentials

After seeding (optional):
- Email: admin@naukri.com
- Password: admin123

## 📝 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For any queries, reach out to: info@teztecch.com
