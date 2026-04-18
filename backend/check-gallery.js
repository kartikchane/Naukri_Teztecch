require('dotenv').config();
const mongoose = require('mongoose');
const Gallery = require('./models/Gallery');

const checkGallery = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const galleries = await Gallery.find().lean();
    console.log('\n=== Gallery Entries ===');
    console.log(JSON.stringify(galleries, null, 2));

    if (galleries.length === 0) {
      console.log('\n❌ No gallery entries found!');
    } else {
      console.log(`\n✅ Found ${galleries.length} gallery entries`);
      galleries.forEach((g, i) => {
        console.log(`\n[${i + 1}] Image URL: ${g.imageUrl}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkGallery();
