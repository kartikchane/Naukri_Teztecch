require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Connection Error:', error.message);
    process.exit(1);
  }
};

const resetAdminPassword = async () => {
  try {
    await connectDB();

    const adminUser = await User.findOne({ email: 'teztecchadmin@gmail.com' }).select('+password');
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('Found admin user:', adminUser.email);
    console.log('Current role:', adminUser.role);

    // Reset password
    adminUser.password = 'password123'; // Will be hashed by pre-save hook
    await adminUser.save();

    console.log('✅ Admin password reset successfully!');
    console.log('New Password: password123');

    // Verify the password works
    const isMatch = await adminUser.matchPassword('password123');
    console.log('✅ Password verification:', isMatch ? 'SUCCESS' : 'FAILED');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
