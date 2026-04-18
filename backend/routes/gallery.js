const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/gallery');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get all gallery images for a company
router.get('/company/:companyId', async (req, res) => {
  try {
    const gallery = await Gallery.find({ company: req.params.companyId })
      .sort({ displayOrder: 1, uploadedAt: -1 });

    res.json({
      success: true,
      count: gallery.length,
      data: gallery
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ message: 'Error fetching gallery images' });
  }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id).populate('company');
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }
    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery image' });
  }
});

// Upload gallery image
router.post('/upload/:companyId', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, category } = req.body;

    // Verify company exists
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      // Delete uploaded file if company doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get the last display order
    const lastImage = await Gallery.findOne({ company: req.params.companyId })
      .sort({ displayOrder: -1 });
    const displayOrder = lastImage ? lastImage.displayOrder + 1 : 0;

    // Create gallery entry
    const galleryImage = await Gallery.create({
      company: req.params.companyId,
      title: title || 'Untitled',
      description: description || '',
      imageUrl: `/uploads/gallery/${req.file.filename}`,
      category: category || 'other',
      displayOrder: displayOrder,
      uploadedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: galleryImage
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// Update gallery image
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description, category, displayOrder } = req.body;

    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    if (title) image.title = title;
    if (description) image.description = description;
    if (category) image.category = category;
    if (displayOrder !== undefined) image.displayOrder = displayOrder;

    await image.save();

    res.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: image
    });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ message: 'Error updating gallery image' });
  }
});

// Delete gallery image
router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Gallery image not found' });
    }

    // Delete the file from disk
    const filePath = image.imageUrl.replace(/^\//, '');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ message: 'Error deleting gallery image' });
  }
});

// Reorder gallery images
router.put('/reorder/:companyId', protect, async (req, res) => {
  try {
    const { images } = req.body; // Array of {id, displayOrder}

    const updatePromises = images.map(img =>
      Gallery.findByIdAndUpdate(
        img.id,
        { displayOrder: img.displayOrder },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Gallery order updated successfully'
    });
  } catch (error) {
    console.error('Error reordering gallery:', error);
    res.status(500).json({ message: 'Error reordering gallery' });
  }
});

module.exports = router;
