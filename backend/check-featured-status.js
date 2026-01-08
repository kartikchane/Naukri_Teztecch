const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Company = require('./models/Company');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected\n');
    
    // Get all featured jobs
    const featuredJobs = await Job.find({ featured: true })
      .select('title company featured createdAt')
      .populate('company', 'name')
      .sort('-createdAt')
      .limit(10);
    
    console.log(`📊 Featured Jobs Count: ${featuredJobs.length}\n`);
    
    if (featuredJobs.length > 0) {
      console.log('⭐ Featured Jobs:');
      featuredJobs.forEach((job, index) => {
        console.log(`${index + 1}. ${job.title} - ${job.company?.name || 'Unknown'}`);
      });
    } else {
      console.log('❌ No jobs are currently marked as featured.');
      console.log('\n💡 To mark jobs as featured:');
      console.log('   1. Open admin panel: http://localhost:3001');
      console.log('   2. Click the star ⭐ icon on any job card');
      console.log('   3. The job will be marked as featured');
    }
    
    // Get total jobs count
    const totalJobs = await Job.countDocuments({ status: 'Open' });
    console.log(`\n📋 Total Open Jobs: ${totalJobs}`);
    
    // Get first 3 jobs to show their featured status
    const sampleJobs = await Job.find({ status: 'Open' })
      .select('title featured')
      .limit(3);
    
    console.log('\n📄 Sample jobs status:');
    sampleJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} - Featured: ${job.featured ? '✅ Yes' : '❌ No'}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
