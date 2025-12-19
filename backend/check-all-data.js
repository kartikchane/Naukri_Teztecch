require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

async function checkAllData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('\n' + '='.repeat(50));
    
    const userCount = await User.countDocuments();
    const companyCount = await Company.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('='.repeat(50));
    console.log(`👥 Users: ${userCount}`);
    console.log(`🏢 Companies: ${companyCount}`);
    console.log(`💼 Jobs: ${jobCount}`);
    console.log(`📝 Applications: ${applicationCount}`);
    console.log('='.repeat(50));
    
    if (userCount > 0) {
      console.log('\n👥 Sample Users:');
      const users = await User.find().limit(3).select('name email role');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
      });
    }
    
    if (companyCount > 0) {
      console.log('\n🏢 Sample Companies:');
      const companies = await Company.find().limit(3).select('name industry location');
      companies.forEach(company => {
        console.log(`  - ${company.name} - ${company.industry}`);
      });
    }
    
    if (jobCount > 0) {
      console.log('\n💼 Sample Jobs:');
      const jobs = await Job.find().limit(5).select('title company type status');
      jobs.forEach(job => {
        console.log(`  - ${job.title} (${job.type}) - Status: ${job.status}`);
      });
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ Database check complete!');
    console.log('='.repeat(50) + '\n');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAllData();
