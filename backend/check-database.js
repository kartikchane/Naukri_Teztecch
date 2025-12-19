const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const totalJobs = await Job.countDocuments();
    console.log(`\nTotal jobs in database: ${totalJobs}`);

    const categories = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nJobs by category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} jobs`);
    });

    const softwareJobs = await Job.find({ category: 'Software Development' }).limit(3);
    console.log(`\nSample Software Development jobs (${softwareJobs.length}):`);
    softwareJobs.forEach(job => {
      console.log(`  - ${job.title} (${job.status})`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
