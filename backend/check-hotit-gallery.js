require('dotenv').config();
const mongoose = require('mongoose');
const Gallery = require('./models/Gallery');

const checkGalleryForCompany = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // HOTIT company ID from your screenshot
    const companyId = '69f844e43b1608b10571819b';
    
    const galleries = await Gallery.find({ company: companyId }).lean();
    console.log('\n=== Gallery Entries for HOTIT ===');
    console.log(`Total images: ${galleries.length}`);
    
    galleries.forEach((g, i) => {
      console.log(`\n[${i + 1}] Image Details:`);
      console.log(`   ID: ${g._id}`);
      console.log(`   Title: ${g.title}`);
      console.log(`   ImageUrl: ${g.imageUrl}`);
      console.log(`   Category: ${g.category}`);
      console.log(`   DisplayOrder: ${g.displayOrder}`);
      console.log(`   UploadedAt: ${g.uploadedAt}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkGalleryForCompany();
