require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

const checkResumes = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const applications = await Application.find()
      .populate('job', 'title')
      .populate('applicant', 'name email');

    console.log(`\n📊 Total Applications: ${applications.length}\n`);

    applications.forEach((app, index) => {
      console.log(`\n--- Application ${index + 1} ---`);
      console.log(`Applicant: ${app.applicant?.name || 'Unknown'} (${app.applicant?.email})`);
      console.log(`Job: ${app.job?.title || 'Unknown'}`);
      console.log(`Status: ${app.status}`);
      console.log(`Resume Path: ${app.resume || 'No resume'}`);
      
      if (app.resume) {
        // Check if file exists
        let filePath = app.resume;
        
        // Normalize path
        filePath = filePath.replace(/\\/g, '/');
        if (!filePath.startsWith('uploads/')) {
          const parts = filePath.split('uploads/');
          filePath = parts.length > 1 ? 'uploads/' + parts[parts.length - 1] : filePath;
        }
        
        const fullPath = path.join(__dirname, '..', filePath);
        const exists = fs.existsSync(fullPath);
        console.log(`File Exists: ${exists ? '✅ Yes' : '❌ No'}`);
        console.log(`Full Path: ${fullPath}`);
      }
      console.log(`Applied At: ${new Date(app.appliedAt).toLocaleString()}`);
    });

    console.log('\n\n📈 Summary:');
    const withResume = applications.filter(app => app.resume).length;
    const withoutResume = applications.filter(app => !app.resume).length;
    console.log(`Applications with resume: ${withResume}`);
    console.log(`Applications without resume: ${withoutResume}`);

    mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkResumes();
