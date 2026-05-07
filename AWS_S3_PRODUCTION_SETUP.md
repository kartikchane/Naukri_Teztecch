# AWS S3 Production Setup Guide

## ⚠️ Current Status
- **Development**: ✅ Local disk storage (working)
- **Production**: ⚠️ Needs S3 SDK v3 migration

---

## Problem: AWS SDK Version Conflict

| Component | Version | Issue |
|-----------|---------|-------|
| aws-sdk | v2 (old) | End of support - not compatible with multer-s3 |
| multer-s3 | Latest | Expects AWS SDK v3 |
| Result | ❌ Conflict | Upload fails with "client.send is not a function" |

---

## ✅ PRODUCTION SOLUTION (3 Steps)

### Step 1: Upgrade AWS SDK to v3
```bash
cd backend
npm uninstall aws-sdk
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

### Step 2: Update upload.js for AWS SDK v3
```javascript
const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const multer = require("multer");
const path = require("path");

// Configure S3Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

// Custom handler to upload to S3
const uploadToS3 = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const folder = getFolderName(req.file.fieldname, req);
    const key = `${folder}/${Date.now()}${path.extname(req.file.originalname)}`;

    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
      },
    });

    await uploader.done();
    req.file.location = `${process.env.AWS_S3_URL}/${key}`;
    console.log(`✅ File uploaded to S3: ${req.file.location}`);
    next();
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
};

module.exports = { upload, uploadToS3 };
```

### Step 3: Update routes to use S3 uploader
```javascript
const { upload, uploadToS3 } = require('../middleware/upload');

router.post('/upload-document', 
  protect,
  upload.single('document'),
  uploadToS3,  // <-- Add this middleware
  async (req, res) => {
    // Use req.file.location for S3 URL
    const fileUrl = req.file.location;
    // ... rest of code
  }
);
```

---

## 🚀 For Immediate Production Deploy

**Option A: Use Local Storage (Not Recommended)**
- Keep current setup
- Files will be lost on Render/Vercel restart
- Only for testing

**Option B: Use AWS S3 with SDK v3 (Recommended)**
- Follow steps above
- Files persist indefinitely
- Scales easily
- Professional solution

**Option C: Use Alternative Storage**
- Cloudinary (easy, free tier available)
- Firebase Storage
- DigitalOcean Spaces

---

## .env Variables for Production
```env
# AWS S3 (if using S3)
AWS_ACCESS_KEY_ID=AKIAWW4FCEPDI4OUPITEU
AWS_SECRET_ACCESS_KEY=t2zABXxc3I+P+nr/0ypgM2V3GTnfaFGGMEG/kSol
AWS_S3_BUCKET=naukri-platform-uploads
AWS_S3_REGION=ap-south-1
AWS_S3_URL=https://naukri-platform-uploads.s3.ap-south-1.amazonaws.com
```

---

## ✅ Current Working Setup

For now, **local storage works fine for development**:
- Documents upload: ✅ Working
- Files stored: `/backend/uploads/`
- For production: Upgrade to SDK v3 or use alternative

---

## Quick Migration Checklist

- [ ] Install AWS SDK v3 packages
- [ ] Update `middleware/upload.js` with v3 code
- [ ] Test file uploads locally
- [ ] Deploy to production
- [ ] Verify files in S3 console
- [ ] Remove old aws-sdk references

---

**Ready to upgrade for production?** Let me know!
