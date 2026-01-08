require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');
const connectDB = require('./config/db');

const checkRejections = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Get all applications
    const allApps = await Application.find();
    console.log(`📊 Total Applications: ${allApps.length}`);

    // Count by status
    const statusCounts = {};
    allApps.forEach(app => {
      const status = app.status || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    console.log('\n📈 Applications by Status:');
    Object.keys(statusCounts).forEach(status => {
      console.log(`   ${status}: ${statusCounts[status]}`);
    });

    // Get rejected applications
    const rejectedApps = await Application.find({ status: 'Rejected' })
      .populate('applicant', 'name email')
      .populate('job', 'title');

    console.log(`\n❌ Rejected Applications: ${rejectedApps.length}\n`);

    if (rejectedApps.length > 0) {
      rejectedApps.forEach((app, index) => {
        console.log(`${index + 1}. ${app.applicant?.name || 'Unknown'} - ${app.job?.title || 'Unknown Job'}`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Applied: ${new Date(app.appliedAt).toLocaleDateString()}\n`);
      });
    } else {
      console.log('No rejected applications found.');
    }

    mongoose.connection.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkRejections();
