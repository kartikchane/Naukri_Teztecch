const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/naukri_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkUser() {
  try {
    const email = 'chanekarkartik2@gmail.com';
    const user = await User.findOne({ email });
    
    if (user) {
      console.log('✅ User found!');
      console.log({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      console.log('❌ User not found with email:', email);
      console.log('\nCreating user...');
      
      const newUser = await User.create({
        name: 'Kartik Chanekar',
        email: email,
        password: 'kartik123',
        role: 'jobseeker',
        phone: '+91 9876543210'
      });
      
      console.log('✅ User created successfully!');
      console.log({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      });
      console.log('\nYou can now login with:');
      console.log('Email:', email);
      console.log('Password: kartik123');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkUser();
