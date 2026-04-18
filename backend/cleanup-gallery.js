require('dotenv').config();
const mongoose = require('mongoose');
const Gallery = require('./models/Gallery');

const cleanupGallery = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Gallery.deleteMany({});
    console.log(`\n✅ Deleted ${result.deletedCount} gallery entries`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

cleanupGallery();
