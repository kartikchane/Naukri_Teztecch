const multer = require('multer');
const path = require('path');
const fs = require('fs');

// LOCAL STORAGE - No AWS S3
console.log('✅ Local Storage Configured');
console.log('📁 Uploads directory: ./uploads');

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

// Local disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = getFolderName(file.fieldname, req);
    const uploadPath = path.join(__dirname, '../uploads', folder);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, filename);
  }
});

// Upload with local storage
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

// Upload to local storage
const uploadToS3 = async (req, res, next) => {
  try {
    // Single file
    if (req.file) {
      const folder = getFolderName(req.file.fieldname, req);
      const fileUrl = `/uploads/${folder}/${req.file.filename}`;
      
      console.log(`📁 File saved locally: ${fileUrl}`);
      
      req.file.location = fileUrl;
      req.file.url = fileUrl;
    }
    
    // Multiple files
    if (req.files && typeof req.files === 'object') {
      for (const fieldName of Object.keys(req.files)) {
        const filesArray = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];
        
        filesArray.forEach((file) => {
          const folder = getFolderName(fieldName, req);
          const fileUrl = `/uploads/${folder}/${file.filename}`;
          
          file.location = fileUrl;
          file.url = fileUrl;
          
          console.log(`✅ File [${fieldName}] saved locally: ${fileUrl}`);
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Local Upload Error:', error.message);
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
