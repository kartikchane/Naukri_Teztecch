# Company Profile & Job Posting Guide

## Overview
Employers must create a company profile before they can post jobs. This ensures all job listings have proper company information.

## Flow for Employers

### 1. **Register as Employer**
- Go to `/register`
- Select "Employer" as account type
- Complete registration

### 2. **Create Company Profile** (Required before posting jobs)
- After logging in, navigate to `/create-company`
- Or try to post a job - you'll be automatically redirected to create company first

#### Required Company Information:
- **Company Name*** (e.g., "Tech Innovations Pvt Ltd")
- **Industry*** (Select from dropdown)
- **Description*** (Company overview, mission, values)
- **Location*** (City, State, Country)

#### Optional Company Information:
- Website URL
- Company Size (1-10, 11-50, 51-200, etc.)
- Founded Year
- Logo URL
- Specialties (comma-separated)

### 3. **Post Jobs**
- After company profile is created, go to `/post-job`
- Company name will be auto-filled from your profile
- Fill in job details:
  - Job title, category, description
  - Location, salary range
  - Employment type (Full-time, Part-time, Contract, etc.)
  - Work mode (On-site, Remote, Hybrid)
  - Required skills and experience
  - Application deadline

## Technical Implementation

### Backend Routes

#### Create Company
```
POST /api/companies
Headers: Authorization: Bearer <token>
Body: {
  name: string (required),
  description: string (required),
  industry: string (required),
  location: {
    city: string (required),
    state: string,
    country: string
  },
  website: string,
  size: string,
  foundedYear: number,
  logo: string,
  specialties: [string]
}
```

#### Check User's Company
```
GET /api/companies/my-company
Headers: Authorization: Bearer <token>
Response: Company object or 404 if not found
```

### Frontend Pages

#### `/create-company`
- Protected route (Employer only)
- Checks if user already has a company
- Form to create company profile
- Redirects to `/post-job` on success

#### `/post-job`
- Protected route (Employer only)
- Checks if user has company profile
- Redirects to `/create-company` if no profile found
- Auto-fills company name from profile

## User Experience

### First Time Employer
1. Registers as employer
2. Logs in
3. Tries to access "Post Job" from navbar
4. System checks: No company profile found
5. Shows message: "You need to create a company profile first"
6. Automatically redirects to `/create-company` after 2 seconds
7. Employer fills company profile form
8. Clicks "Create Company Profile"
9. Redirected to `/post-job`
10. Company name pre-filled
11. Employer can now post jobs

### Returning Employer
1. Logs in
2. Clicks "Post Job"
3. System checks: Company profile exists
4. Directly shows job posting form
5. Company name pre-filled from profile
6. Can post job immediately

## Business Rules

1. **One Company Per Employer**: Each employer account can only create one company profile
2. **Company Required for Jobs**: Cannot post jobs without a company profile
3. **Auto-Fill Company Name**: When posting jobs, company name is automatically taken from the employer's company profile
4. **Company Ownership**: Only the employer who created the company can edit it

## Database Schema

### Company Model
```javascript
{
  name: String (required),
  description: String (required),
  industry: String (required),
  location: {
    city: String (required),
    state: String,
    country: String
  },
  website: String,
  size: String,
  foundedYear: Number,
  logo: String,
  specialties: [String],
  owner: ObjectId (ref: User) (required),
  createdAt: Date,
  updatedAt: Date
}
```

## Access URLs

- **Create Company**: https://teztecch-naukri-frontend.vercel.app/create-company
- **Post Job**: https://teztecch-naukri-frontend.vercel.app/post-job
- **Companies List**: https://teztecch-naukri-frontend.vercel.app/companies

## Testing

### Test Account
- **Email**: employer@example.com
- **Password**: password123
- **Role**: Employer

### Steps to Test:
1. Login with employer account
2. Go to `/create-company`
3. Fill in company details
4. Submit form
5. Check if redirected to `/post-job`
6. Verify company name is auto-filled
7. Try posting a job

## Deployment Notes

After making these changes:

1. **Commit Changes**:
```bash
git add .
git commit -m "Add company profile creation feature"
git push
```

2. **Redeploy Frontend** (Vercel will auto-deploy from GitHub push)

3. **Test on Production**:
   - Visit https://teztecch-naukri-frontend.vercel.app
   - Login as employer
   - Test company creation flow

## Future Enhancements

- Edit company profile page
- Company logo upload (file upload instead of URL)
- Multiple company admins
- Company verification badge
- Company analytics dashboard
- Employee reviews and ratings
