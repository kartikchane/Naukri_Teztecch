# Admin Panel Complete Plan

## Current Status
✅ Dashboard (basic stats)
✅ Login page
✅ Layout with Sidebar
✅ Backend Admin API routes

## Required Pages & Features

### 1. Dashboard (Update Existing)
- **Stats Cards**: Total Jobs, Users, Applications, Companies
- **Recent Activities**: Latest applications, new users, new jobs
- **Charts**: Monthly trends, user types distribution
- **Quick Actions**: Add Job, Add User, View Reports

### 2. Users Management (NEW)
**Route**: `/users`
**Features**:
- List all users (Job Seekers + Employers)
- Filter by role (All, Job Seeker, Employer, Admin)
- Search by name/email
- View user details (profile, applications, posted jobs)
- Edit user (name, email, role, status)
- Delete user (with confirmation)
- Ban/Unban user
- User stats (applications count, jobs posted)

### 3. Jobs Management (NEW)
**Route**: `/jobs`
**Features**:
- List all jobs (Active, Expired, Featured)
- Filter by status, category, company
- Search by title, company
- View job details (applications count, views)
- Edit job (title, description, salary, location, featured status)
- Delete job (with confirmation)
- Mark/Unmark as Featured
- Toggle Active/Inactive status
- Bulk actions (delete multiple, feature multiple)

### 4. Applications Management (NEW)
**Route**: `/applications`
**Features**:
- List all applications
- Filter by status (Applied, Under Review, Shortlisted, Rejected, Accepted)
- Filter by job, applicant
- Search by applicant name, job title
- View application details:
  - Applicant info (name, email, phone)
  - Job details
  - Application date
  - Resume (download link)
  - Cover letter
  - Current status
- Change application status
- Delete application
- Export applications (CSV)

### 5. Companies Management (NEW)
**Route**: `/companies`
**Features**:
- List all companies
- Search by company name
- View company details:
  - Basic info (name, email, website, location)
  - Logo
  - Description
  - Posted jobs count
  - Total applications received
- Edit company details
- Delete company (with confirmation)
- Verify/Unverify company

### 6. Featured Jobs Management (NEW)
**Route**: `/featured-jobs`
**Features**:
- List currently featured jobs
- Add jobs to featured list
- Remove from featured
- Set featured duration/expiry
- Reorder featured jobs (priority)

### 7. Reports & Analytics (NEW)
**Route**: `/reports`
**Features**:
- User registration trends (daily, weekly, monthly)
- Job posting trends
- Application trends
- Most active employers
- Most applied jobs
- User activity logs
- Export reports (PDF, CSV)

### 8. Settings (NEW)
**Route**: `/settings`
**Features**:
- Site settings (name, logo, description)
- Email settings
- Featured job pricing
- User roles management
- System configuration
- Backup & restore

## Navigation Structure

### Sidebar Menu
```
🏠 Dashboard
👥 Users
💼 Jobs
📝 Applications
🏢 Companies
⭐ Featured Jobs
📊 Reports
⚙️ Settings
🚪 Logout
```

### Top Navbar
- Admin Panel Logo
- Search bar (global search)
- Notifications icon
- Profile dropdown (Admin name, Settings, Logout)

## Backend APIs Required (Check & Create)

### Existing APIs (admin.js):
✅ GET /api/admin/stats
✅ GET /api/admin/jobs
✅ DELETE /api/admin/jobs/:id
✅ GET /api/admin/users
✅ DELETE /api/admin/users/:id
✅ GET /api/admin/applications
✅ DELETE /api/admin/applications/:id

### APIs to Add:
- PUT /api/admin/jobs/:id (edit job)
- PUT /api/admin/jobs/:id/feature (toggle featured)
- PUT /api/admin/users/:id (edit user)
- PUT /api/admin/users/:id/ban (ban/unban user)
- PUT /api/admin/applications/:id/status (change status)
- GET /api/admin/companies (list companies)
- PUT /api/admin/companies/:id (edit company)
- DELETE /api/admin/companies/:id
- GET /api/admin/reports/stats (analytics data)
- GET /api/admin/activities (recent activities)

## Implementation Plan

### Phase 1: Core Management Pages (Priority)
1. ✅ Update Dashboard with better stats
2. Create Users Management page
3. Create Jobs Management page
4. Create Applications Management page

### Phase 2: Additional Features
5. Create Companies Management page
6. Create Featured Jobs Management page
7. Add search & filters to all pages

### Phase 3: Advanced Features
8. Add Reports & Analytics
9. Add Settings page
10. Add export functionality
11. Add bulk actions

### Phase 4: UI/UX Enhancement
12. Better charts & visualizations
13. Mobile responsive
14. Loading states & animations
15. Error handling & toasts

## Design Guidelines
- **Color Scheme**: Blue & Purple gradient (consistent with main site)
- **Icons**: React Icons (FaUser, FaBriefcase, FaFileAlt, etc.)
- **Tables**: Responsive tables with sorting, pagination
- **Modals**: For edit/delete confirmations
- **Forms**: Tailwind CSS styled forms
- **Buttons**: Primary (blue), Secondary (gray), Danger (red)

## Security Considerations
- All routes protected with `isAdmin` middleware
- Confirmation dialogs for delete actions
- Input validation on all forms
- XSS protection
- Rate limiting on sensitive operations
