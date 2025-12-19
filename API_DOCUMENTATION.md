# 📚 API Documentation - Naukri Platform

Complete REST API documentation for the Naukri Platform backend.

**Base URL:** `http://localhost:5000/api` (Development)  
**Production:** `https://your-domain.com/api`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Jobs](#jobs)
3. [Applications](#applications)
4. [Users](#users)
5. [Companies](#companies)
6. [Error Handling](#error-handling)
7. [Status Codes](#status-codes)

---

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "jobseeker",
  "phone": "+91 9876543210"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "jobseeker",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and get token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "jobseeker",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "jobseeker",
  "phone": "+91 9876543210",
  "skills": ["JavaScript", "React"],
  "savedJobs": [],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Jobs

### Get All Jobs
**GET** `/jobs`

Get list of jobs with optional filters.

**Query Parameters:**
- `search` (string) - Search in title, description, skills
- `category` (string) - Filter by category
- `location` (string) - Filter by city
- `workMode` (string) - Filter by work mode (Remote, On-site, Hybrid)
- `employmentType` (string) - Filter by type (Full-time, Part-time, etc.)
- `minSalary` (number) - Minimum salary filter
- `maxSalary` (number) - Maximum salary filter
- `experience` (number) - Experience level
- `featured` (boolean) - Get only featured jobs
- `page` (number) - Page number (default: 1)
- `limit` (number) - Results per page (default: 10)

**Example Request:**
```
GET /jobs?category=Software Development&workMode=Remote&page=1&limit=10
```

**Response (200):**
```json
{
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "description": "We are looking for...",
      "company": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Tech Corp",
        "logo": "uploads/logo.png"
      },
      "category": "Software Development",
      "employmentType": "Full-time",
      "workMode": "Remote",
      "location": {
        "city": "Bangalore",
        "state": "Karnataka",
        "country": "India"
      },
      "salary": {
        "min": 1600000,
        "max": 2400000,
        "currency": "INR",
        "period": "Yearly"
      },
      "experience": {
        "min": 4,
        "max": 8
      },
      "skills": ["React", "TypeScript", "Redux"],
      "featured": true,
      "status": "Open",
      "views": 150,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalJobs": 48
}
```

---

### Get Single Job
**GET** `/jobs/:id`

Get detailed information about a specific job.

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior React Developer",
  "description": "Full job description...",
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Tech Corp",
    "description": "Company description...",
    "website": "https://techcorp.com",
    "logo": "uploads/logo.png"
  },
  "postedBy": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Jane Smith",
    "email": "jane@techcorp.com"
  },
  "category": "Software Development",
  "employmentType": "Full-time",
  "workMode": "Remote",
  "location": {
    "city": "Bangalore",
    "state": "Karnataka"
  },
  "salary": {
    "min": 1600000,
    "max": 2400000
  },
  "experience": {
    "min": 4,
    "max": 8
  },
  "skills": ["React", "TypeScript", "Redux"],
  "requirements": [
    "4+ years of React experience",
    "Strong TypeScript knowledge"
  ],
  "responsibilities": [
    "Develop user-facing features",
    "Build reusable components"
  ],
  "benefits": ["Health Insurance", "Work from Home"],
  "openings": 2,
  "views": 151,
  "applications": [],
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Create Job (Employer Only)
**POST** `/jobs`

Create a new job posting.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Senior React Developer",
  "description": "We are looking for an experienced React developer...",
  "category": "Software Development",
  "employmentType": "Full-time",
  "workMode": "Remote",
  "location": {
    "city": "Bangalore",
    "state": "Karnataka"
  },
  "salary": {
    "min": 1600000,
    "max": 2400000
  },
  "experience": {
    "min": 4,
    "max": 8
  },
  "skills": ["React", "TypeScript", "Redux"],
  "requirements": ["4+ years experience"],
  "responsibilities": ["Develop features"],
  "benefits": ["Health Insurance"],
  "openings": 2
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior React Developer",
  // ... complete job object
}
```

---

### Update Job (Employer Only)
**PUT** `/jobs/:id`

Update an existing job posting.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (partial update allowed)
```json
{
  "status": "Closed",
  "openings": 0
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  // ... updated job object
}
```

---

### Delete Job (Employer Only)
**DELETE** `/jobs/:id`

Delete a job posting.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Job removed"
}
```

---

### Get My Jobs (Employer Only)
**GET** `/jobs/employer/my-jobs`

Get all jobs posted by the logged-in employer.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    // ... job details
  }
]
```

---

## Applications

### Apply for Job
**POST** `/applications`

Submit a job application.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `jobId` (string, required) - Job ID
- `coverLetter` (string, optional) - Cover letter text
- `resume` (file, optional if user has resume) - Resume file (PDF, DOC, DOCX)

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "job": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer"
  },
  "applicant": {
    "_id": "507f1f77bcf86cd799439015",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "resume": "uploads/resume-1234567890.pdf",
  "coverLetter": "I am interested in this position...",
  "status": "Applied",
  "appliedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Get User Applications
**GET** `/applications/user`

Get all applications submitted by logged-in user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "job": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Senior React Developer",
      "company": {
        "name": "Tech Corp",
        "logo": "uploads/logo.png"
      }
    },
    "status": "Applied",
    "appliedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Get Job Applications (Employer Only)
**GET** `/applications/job/:jobId`

Get all applications for a specific job.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "applicant": {
      "_id": "507f1f77bcf86cd799439015",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "skills": ["React", "Node.js"],
      "experience": [...]
    },
    "resume": "uploads/resume-1234567890.pdf",
    "coverLetter": "I am interested...",
    "status": "Applied",
    "appliedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### Update Application Status (Employer Only)
**PUT** `/applications/:id/status`

Update the status of an application.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "Shortlisted",
  "notes": "Good candidate, schedule interview"
}
```

**Allowed Status Values:**
- `Applied`
- `Under Review`
- `Shortlisted`
- `Rejected`
- `Accepted`

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "status": "Shortlisted",
  "notes": "Good candidate, schedule interview",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

### Withdraw Application
**DELETE** `/applications/:id`

Withdraw a job application.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Application withdrawn"
}
```

---

## Users

### Get User Profile
**GET** `/users/profile`

Get logged-in user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "jobseeker",
  "phone": "+91 9876543210",
  "avatar": "uploads/avatar.jpg",
  "resume": "uploads/resume.pdf",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "company": "Previous Corp",
      "position": "Developer",
      "from": "2020-01-01",
      "to": "2023-01-01",
      "current": false,
      "description": "Worked on..."
    }
  ],
  "education": [
    {
      "school": "University Name",
      "degree": "Bachelor's",
      "field": "Computer Science",
      "from": "2016-08-01",
      "to": "2020-05-01"
    }
  ],
  "location": {
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India"
  },
  "bio": "Passionate developer...",
  "savedJobs": [],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update User Profile
**PUT** `/users/profile`

Update user profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "name": "John Doe Updated",
  "phone": "+91 9876543210",
  "bio": "Updated bio...",
  "skills": ["JavaScript", "React", "TypeScript"],
  "experience": [...],
  "education": [...],
  "location": {
    "city": "Mumbai",
    "state": "Maharashtra"
  }
}
```

**Response (200):**
```json
{
  // Updated user object
}
```

---

### Upload Resume
**POST** `/users/resume`

Upload or update resume file.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `resume` (file, required) - Resume file (PDF, DOC, DOCX, max 5MB)

**Response (200):**
```json
{
  "message": "Resume uploaded successfully",
  "resume": "uploads/resume-1234567890.pdf"
}
```

---

### Upload Avatar
**POST** `/users/avatar`

Upload or update profile picture.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `avatar` (file, required) - Image file (JPG, PNG, max 5MB)

**Response (200):**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar": "uploads/avatar-1234567890.jpg"
}
```

---

### Save/Unsave Job
**POST** `/users/save-job/:jobId`

Toggle save status for a job.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Job saved successfully",
  "saved": true
}
```
or
```json
{
  "message": "Job removed from saved jobs",
  "saved": false
}
```

---

### Get Saved Jobs
**GET** `/users/saved-jobs`

Get all jobs saved by the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior React Developer",
    "company": {
      "name": "Tech Corp",
      "logo": "uploads/logo.png"
    },
    // ... job details
  }
]
```

---

## Companies

### Create Company
**POST** `/companies`

Create a company profile (Employer only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Tech Corp",
  "description": "Leading technology company...",
  "website": "https://techcorp.com",
  "industry": "Technology",
  "companySize": "51-200",
  "location": {
    "address": "123 Main St",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India",
    "zipCode": "560001"
  },
  "founded": 2010,
  "socialLinks": {
    "linkedin": "https://linkedin.com/company/techcorp",
    "twitter": "https://twitter.com/techcorp"
  }
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Tech Corp",
  // ... complete company object
}
```

---

### Get Company
**GET** `/companies/:id`

Get company details.

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Tech Corp",
  "description": "Leading technology company...",
  "website": "https://techcorp.com",
  "logo": "uploads/company-logo.png",
  "industry": "Technology",
  "companySize": "51-200",
  "location": {...},
  "verified": true,
  "owner": {...},
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All Companies
**GET** `/companies`

Get list of all companies.

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Tech Corp",
    "logo": "uploads/logo.png",
    "industry": "Technology"
  }
]
```

---

### Update Company (Owner Only)
**PUT** `/companies/:id`

Update company information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (partial update allowed)
```json
{
  "description": "Updated description...",
  "website": "https://newtechcorp.com"
}
```

**Response (200):**
```json
{
  // Updated company object
}
```

---

### Upload Company Logo (Owner Only)
**POST** `/companies/:id/logo`

Upload company logo.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `logo` (file, required) - Image file (JPG, PNG, max 5MB)

**Response (200):**
```json
{
  "message": "Logo uploaded successfully",
  "logo": "uploads/company-logo-1234567890.png"
}
```

---

## Error Handling

All errors follow this format:

**Error Response:**
```json
{
  "message": "Error description"
}
```

or with validation errors:

```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

**Current Limits:** Not implemented  
**Recommended:** 100 requests per 15 minutes

---

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Naukri Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## Notes

- All dates are in ISO 8601 format
- File uploads are limited to 5MB by default
- Supported file types: PDF, DOC, DOCX, JPG, PNG
- Passwords are hashed using bcrypt
- JWT tokens expire after 30 days
- All list endpoints support pagination

---

**For support, contact: info@teztecch.com**
