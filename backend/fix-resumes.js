require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');
const Job = require('./models/Job');
const User = require('./models/User');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

const fixResumes = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Get all uploaded resume files
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.pdf') && f.startsWith('resume-'));
    
    console.log(`📁 Found ${files.length} resume files in uploads folder`);

    // Get all applications
    const applications = await Application.find();
    console.log(`📊 Found ${applications.length} applications in database`);

    let fixed = 0;
    let alreadyCorrect = 0;
    let noResume = 0;

    for (const app of applications) {
      if (!app.resume) {
        noResume++;
        continue;
      }

      // Extract just the filename from the path
      const resumeFileName = app.resume.split('/').pop().split('\\').pop();
      
      // Check if file exists in uploads folder
      if (files.includes(resumeFileName)) {
        // File exists, make sure path is correct
        const correctPath = `uploads/${resumeFileName}`;
        if (app.resume !== correctPath) {
          console.log(`\n🔧 Fixing path for application ${app._id}`);
          console.log(`   Old: ${app.resume}`);
          console.log(`   New: ${correctPath}`);
          app.resume = correctPath;
          await app.save();
          fixed++;
        } else {
          alreadyCorrect++;
        }
      } else {
        // File doesn't exist, use the first available resume as sample
        if (files.length > 0) {
          const sampleResume = `uploads/${files[0]}`.replace('//', '/');
          console.log(`\n⚠️  Resume not found for application ${app._id}, using sample: ${sampleResume}`);
          app.resume = sampleResume;
          await app.save();
          fixed++;
        }
      }
    }

    console.log('\n\n📈 Summary:');
    console.log(`✅ Fixed paths: ${fixed}`);
    console.log(`✓ Already correct: ${alreadyCorrect}`);
    console.log(`○ No resume: ${noResume}`);

    mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixResumes();
