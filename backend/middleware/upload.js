const multer = require('multer');
const path = require('path');
const fs = require('fs');

console.log('✅ Local Storage Configured (Development Mode)');

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

// Local disk storage - Save documents to temp first
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      let folder = 'misc';
      if (file.fieldname === 'document') {
        folder = 'temp';
      } else {
        folder = getFolderName(file.fieldname, req);
      }
      
      const uploadPath = path.join(__dirname, '../uploads', folder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    } catch (err) {
      console.error('ERROR in destination:', err.message);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.pdf';
    const randomStr = Math.random().toString(36).substr(2, 9);
    const filename = `${Date.now()}_${randomStr}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => checkFileType(file, cb)
});

// Move file to correct location based on documentType
const uploadToS3 = async (req, res, next) => {
  try {
    if (req.file) {
      const currentPath = req.file.path;
      let finalFolder = getFolderName(req.file.fieldname, req);
      
      // If in temp folder, move to documents folder based on documentType
      if (currentPath.includes('uploads\\temp\\') || currentPath.includes('uploads/temp/')) {
        const docType = req.body?.documentType;
        const correctSubfolder = 
          docType === 'aadharCard' ? 'aadhar' :
          docType === 'panCard' ? 'pan' :
          docType === 'gstCertificate' ? 'gst' :
          docType === 'udyamAadhar' ? 'udyam' : 'aadhar';
        
        finalFolder = `documents/${correctSubfolder}`;
        const correctPath = path.join(__dirname, '../uploads', finalFolder);
        
        if (!fs.existsSync(correctPath)) {
          fs.mkdirSync(correctPath, { recursive: true });
        }
        
        const newFilePath = path.join(correctPath, req.file.filename);
        fs.renameSync(currentPath, newFilePath);
        req.file.path = newFilePath;
        console.log(`✅ File moved to: ${finalFolder}`);
      }
      
      const fileUrl = `uploads/${finalFolder}/${req.file.filename}`;
      console.log(`📁 File ready: ${fileUrl}`);
      
      req.file.location = fileUrl;
      req.file.url = fileUrl;
    }
    
    if (req.files && typeof req.files === 'object') {
      for (const fieldName of Object.keys(req.files)) {
        const filesArray = Array.isArray(req.files[fieldName]) ? req.files[fieldName] : [req.files[fieldName]];
        filesArray.forEach((file) => {
          const folder = getFolderName(fieldName, req);
          const fileUrl = `uploads/${folder}/${file.filename}`;
          file.location = fileUrl;
          file.url = fileUrl;
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
};

const normalizeFileLocation = (req, res, next) => {
  next();
};

module.exports = upload;
module.exports.normalizeFileLocation = normalizeFileLocation;
module.exports.uploadToS3 = uploadToS3;
