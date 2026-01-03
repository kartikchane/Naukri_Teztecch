const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Admin credentials - CHANGE THESE!
    const adminData = {
      name: 'Admin User',
      email: 'admin@naukri.com',
      password: 'admin123456', // ⚠️ CHANGE THIS PASSWORD!
      role: 'admin',
      phone: '1234567890'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      if (existingAdmin.role === 'admin') {
        console.log('❌ Admin user already exists with this email');
        console.log('Email:', existingAdmin.email);
        console.log('Name:', existingAdmin.name);
      } else {
        // Update existing user to admin
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User upgraded to admin!');
        console.log('Email:', existingAdmin.email);
        console.log('Name:', existingAdmin.name);
      }
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create new admin
    const admin = await User.create(adminData);
    console.log('\n✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔐 Role:', admin.role);
    console.log('⚠️  Password:', adminData.password);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Admin Login URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the script
console.log('🚀 Starting admin creation process...\n');
createAdmin();
