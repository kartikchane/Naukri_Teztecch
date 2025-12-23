// Run this script with: node scripts/makeAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://naukri_admin:GLaV55gSAJaGal0p@cluster0.eum9qca.mongodb.net/naukri_platform?appName=Cluster0';

async function makeAdmin(email) {
  await mongoose.connect(MONGODB_URI);
  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found!');
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log(`User ${email} is now admin!`);
  process.exit(0);
}

makeAdmin('admin@example.com'); // Change email if needed
