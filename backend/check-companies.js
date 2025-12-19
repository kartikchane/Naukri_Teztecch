require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./models/Company');
const Job = require('./models/Job');

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const companiesCount = await Company.countDocuments();
    console.log(`Total companies: ${companiesCount}`);

    if (companiesCount > 0) {
      const companies = await Company.find().limit(5).select('name industry location');
      console.log('\nFirst 5 companies:');
      companies.forEach(c => {
        console.log(`- ${c.name} (${c.industry})`);
      });
    }

    const jobsCount = await Job.countDocuments();
    const featuredJobsCount = await Job.countDocuments({ featured: true });
    console.log(`\nTotal jobs: ${jobsCount}`);
    console.log(`Featured jobs: ${featuredJobsCount}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkData();
