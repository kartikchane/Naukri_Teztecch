const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/naukri_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected for user creation...'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createTestUser() {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test user already exists:');
      console.log({
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role
      });
      console.log('\nYou can login with:');
      console.log('Email: test@example.com');
      console.log('Password: test123');
      process.exit(0);
      return;
    }

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      role: 'jobseeker',
      phone: '+91 9876543210'
    });

    console.log('Test user created successfully!');
    console.log({
      email: testUser.email,
      name: testUser.name,
      role: testUser.role
    });
    console.log('\nYou can now login with:');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

// Run the function
createTestUser();
