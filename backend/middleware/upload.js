const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary Configured');
console.log(`☁️ Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images, PDFs, and Word documents only!');
  }
}

// Get folder path
function getFolderName(fieldname, req) {
  if (fieldname === 'document' && req.body && req.body.documentType) {
    const docType = req.body.documentType;
    if (docType === 'aadharCard') return 'documents/aadhar';
    if (docType === 'panCard') return 'documents/pan';
    if (docType === 'gstCertificate') return 'documents/gst';
    if (docType === 'udyamAadhar') return 'documents/udyam';
  }
  
  if (fieldname === 'aadharCard') return 'documents/aadhar';
  if (fieldname === 'panCard') return 'documents/pan';
  if (fieldname === 'gstCertificate') return 'documents/gst';
  if (fieldname === 'udyamAadhar') return 'documents/udyam';
  if (fieldname === 'logo') return 'logos';
  if (fieldname === 'resume' || fieldname === 'cv') return 'resumes';
  if (fieldname === 'avatar') return 'avatars';
  if (fieldname === 'coverImage') return 'cover-images';
  if (fieldname === 'image' || fieldname === 'galleryImages') return 'gallery';
  
  return 'misc';
}

// Memory storage for Cloudinary upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

// Upload to Cloudinary
const uploadToS3 = async (req, res, next) => {
  try {
    // Single file
    if (req.file) {
      const folder = getFolderName(req.file.fieldname, req);
      
      console.log(`☁️ Uploading to Cloudinary [${folder}]: ${req.file.originalname}`);
      
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `naukri/${folder}`,
            resource_type: 'auto',
            public_id: `${Date.now()}_${Math.random().toString(36).substring(7)}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      
      req.file.location = result.secure_url;
      req.file.url = result.secure_url;
      req.file.cloudinaryId = result.public_id;
      
      console.log(`✅ File uploaded to Cloudinary: ${result.secure_url}`);
    }
    
    // Multiple files
    if (req.files && typeof req.files === 'object') {
      for (const fieldName of Object.keys(req.files)) {
        const filesArray = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];
        
        for (const file of filesArray) {
          if (file.buffer) {
            const folder = getFolderName(fieldName, req);
            
            console.log(`☁️ Uploading [${fieldName}] to Cloudinary: ${file.originalname}`);
            
            const result = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: `naukri/${folder}`,
                  resource_type: 'auto',
                  public_id: `${Date.now()}_${Math.random().toString(36).substring(7)}`
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              );
              uploadStream.end(file.buffer);
            });
            
            file.location = result.secure_url;
            file.url = result.secure_url;
            file.cloudinaryId = result.public_id;
            
            console.log(`✅ File [${fieldName}] uploaded to Cloudinary: ${result.secure_url}`);
          }
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error.message);
    return res.status(500).json({ 
      message: 'File upload failed', 
      error: error.message 
    });
  }
};

// Normalize file location
const normalizeFileLocation = (req, res, next) => {
  try {
    if (req.file && req.file.location) {
      console.log(`✅ File location: ${req.file.location}`);
    }
    
    if (req.files && typeof req.files === 'object') {
      Object.keys(req.files).forEach(fieldName => {
        const filesArray = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];
        filesArray.forEach((file) => {
          if (file.location) {
            console.log(`✅ File [${fieldName}] location: ${file.location}`);
          }
        });
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Error in normalizeFileLocation:', error.message);
    next();
  }
};

module.exports = upload;
module.exports.normalizeFileLocation = normalizeFileLocation;
module.exports.uploadToS3 = uploadToS3;
