# AWS S3 Implementation Guide for Naukri Platform

This guide helps you migrate from local file storage to AWS S3, solving the Render ephemeral filesystem problem.

## Why AWS S3?
- **Persistent Storage**: Files survive Render dyno restarts
- **Scalable**: Can handle unlimited file uploads
- **Fast**: CDN integration available
- **Cost-Effective**: Pay only for storage/bandwidth used (~$1-5/month for typical usage)
- **Easy Migration**: One-time setup, works with existing code

## Setup Instructions

### Step 1: Create AWS S3 Bucket
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Create bucket: `naukri-platform-uploads` (or any name)
3. Select region: Use same region for lower latency
4. Under "Block Public Access Settings": 
   - Uncheck "Block all public access" (so files can be viewed)
   - Or better: Keep blocked, use CloudFront for CDN
5. Create bucket

### Step 2: Create IAM User for S3 Access
1. Go to [IAM Console](https://console.aws.amazon.com/iam/home)
2. Create new User: `naukri-platform-backend`
3. Attach policy: `AmazonS3FullAccess` (or create custom policy for specific bucket)
4. Create Access Key:
   - Go to "Security credentials" tab
   - Create Access Key
   - Save: **Access Key ID** and **Secret Access Key**

### Step 3: Add Environment Variables
Update `.env` file:

```env
# =====================
# AWS S3 CONFIGURATION
# =====================
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_S3_BUCKET=naukri-platform-uploads
AWS_S3_REGION=ap-south-1
AWS_S3_URL=https://naukri-platform-uploads.s3.ap-south-1.amazonaws.com
```

### Step 4: Install Dependencies
```bash
cd backend
npm install aws-sdk multer-s3
```

### Step 5: Update Upload Middleware
Replace `/backend/middleware/upload.js`:

```javascript
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Configure AWS
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
});

const s3 = new aws.S3();

// Upload to S3
const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_S3_BUCKET,
  acl: 'public-read',
  key: function(req, file, cb) {
    // Organize files by type and date
    const folder = file.fieldname === 'document' ? 'documents' : 'uploads';
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}${require('path').extname(file.originalname)}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = filetypes.test(require('path').extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images, PDFs, and Word documents only!');
    }
  }
});

module.exports = upload;
```

### Step 6: Update Application Route
In `/backend/routes/applications.js`, modify line 72-76:

```javascript
// Get resume path - now S3 URL
let resumePath = null;
if (req.file) {
  // S3 file URL: https://bucket.s3.region.amazonaws.com/documents/timestamp.pdf
  resumePath = req.file.location;
} else if (req.user.resume) {
  resumePath = req.user.resume;
}
```

### Step 7: Update Companies Route
In `/backend/routes/companies.js`, modify document upload (line 456-457):

```javascript
// For S3, file path is the URL directly
const documentPath = req.file.location; // Use S3 URL instead of local path
```

Also update the document viewing endpoint to handle both S3 URLs and local paths:

```javascript
router.get('/:id/documents/:docType', async (req, res) => {
  try {
    const { id, docType } = req.params;
    const validDocTypes = ['aadharCard', 'panCard', 'gstCertificate', 'udyamAadhar'];

    if (!validDocTypes.includes(docType)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const documentPath = company.documents?.[docType];
    if (!documentPath) {
      return res.status(404).json({ message: 'Document not found in database' });
    }

    // If it's already an S3 URL, redirect directly
    if (documentPath.startsWith('http')) {
      return res.redirect(documentPath);
    }

    // Otherwise, redirect to local uploads (backward compatibility)
    const normalizedPath = documentPath.startsWith('/') ? documentPath : `/${documentPath}`;
    res.redirect(normalizedPath);
  } catch (error) {
    console.error('Document view error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
```

### Step 8: Update Gallery Route
In `/backend/routes/gallery.js`, modify image upload (line 97):

```javascript
// S3 file URL
imageUrl: req.file.location, // Instead of `/uploads/gallery/${req.file.filename}`
```

### Step 9: Test Upload
1. Test file upload through admin panel
2. Check S3 bucket console - files should appear
3. Check database - paths should be S3 URLs
4. Try viewing/downloading - should work via redirect

### Step 10: Deploy to Render
1. Add environment variables to Render dashboard:
   - Project Settings → Environment
   - Add: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`, `AWS_S3_REGION`, `AWS_S3_URL`
2. Git commit changes
3. Push to deploy

## Verification Checklist

- [ ] S3 bucket created and accessible
- [ ] IAM user has correct permissions
- [ ] Environment variables added to `.env` and Render
- [ ] Middleware updated to use multer-s3
- [ ] Routes updated to save S3 URLs
- [ ] Test upload successful
- [ ] File visible in S3 bucket console
- [ ] Database stores S3 URL
- [ ] View/Download works from admin panel
- [ ] Deployed to Render successfully

## Cost Estimation (Monthly)
- Storage: ~$0.023 per GB = ~$2-5 for 100-200GB
- API requests: $0.0004 per 1000 requests = negligible
- Transfer OUT: $0.09 per GB after free tier = ~$5-10 depending on traffic
- **Total**: ~$5-20/month for typical usage

## Troubleshooting

### "NoSuchBucket" error
- Verify bucket name in `.env`
- Check AWS region is correct
- Verify IAM user has AmazonS3FullAccess

### Files not appearing in S3
- Check IAM access key is correct
- Verify bucket is public (or has CORS enabled)
- Check application error logs

### "Access Denied" errors
- Verify AWS credentials are correct
- Check IAM user permissions
- Try creating new access key

## Future: Cloudfront CDN (Optional)
For faster file delivery globally, add CloudFront in front of S3:
1. AWS Console → CloudFront
2. Create distribution for S3 bucket
3. Update S3 URLs to CloudFront domain
4. Cost: Usually $0 for small usage due to free tier

## Reverting to Local Storage
If you need to revert temporarily:
1. Comment out S3 configuration
2. Update routes back to local paths
3. Use `backend/uploads/` directory

---

**Implementation Time**: ~30 minutes  
**Difficulty**: Medium  
**Impact**: Solves all file persistence issues
