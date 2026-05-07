const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Gallery = require('../models/Gallery');
const Company = require('../models/Company');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { normalizeFileLocation, uploadToS3 } = require('../middleware/upload');

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
router.post('/upload/:companyId', protect, upload.single('image'), uploadToS3, normalizeFileLocation, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, description, category } = req.body;

    // Verify company exists
    const company = await Company.findById(req.params.companyId);
    if (!company) {
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
      imageUrl: req.file.location, // S3 URL
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
    // imageUrl is stored as "uploads/gallery/filename.jpg"
    const backendDir = path.join(__dirname, '..');
    const filePath = path.join(backendDir, image.imageUrl.replace(/^\//, ''));
    
    console.log(`🗑️  Attempting to delete file: ${filePath}`);
    console.log(`📁 File exists: ${fs.existsSync(filePath)}`);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ File deleted successfully: ${filePath}`);
      } catch (fileError) {
        console.error(`❌ Error deleting file: ${fileError.message}`);
        // Continue with DB deletion even if file deletion fails
      }
    } else {
      console.log(`⚠️  File not found on disk: ${filePath}`);
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Gallery image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ message: 'Error deleting gallery image', error: error.message });
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
