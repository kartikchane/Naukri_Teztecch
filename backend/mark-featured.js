require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const Company = require('./models/Company');

const markJobsAsFeatured = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if there are any jobs
    const totalJobs = await Job.countDocuments();
    console.log(`Total jobs in database: ${totalJobs}`);

    if (totalJobs === 0) {
      console.log('No jobs found in database. Please run seed.js or populate-jobs.js first.');
      process.exit(0);
    }

    // Mark the first 6 jobs as featured
    const result = await Job.updateMany(
      { status: 'Open' },
      { $set: { featured: true } },
      { limit: 6 }
    );

    console.log(`Updated ${result.modifiedCount} jobs to be featured`);

    // Show featured jobs
    const featuredJobs = await Job.find({ featured: true })
      .populate('company', 'name')
      .select('title company featured');
    
    console.log('\nFeatured jobs:');
    featuredJobs.forEach(job => {
      console.log(`- ${job.title} at ${job.company?.name || 'Unknown'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

markJobsAsFeatured();
