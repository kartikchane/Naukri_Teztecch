require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const Company = require('./models/Company');
const User = require('./models/User');

async function addFeaturedJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get or create company
    let techSolutions = await Company.findOne({ name: 'Tech Solutions Inc' });
    if (!techSolutions) {
      techSolutions = await Company.create({
        name: 'Tech Solutions Inc',
        description: 'Leading technology company',
        industry: 'Technology',
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        website: 'https://techsolutions.com',
        companySize: '51-200',
        verified: true
      });
    }

    let dataTech = await Company.findOne({ name: 'DataTech Analytics' });
    if (!dataTech) {
      dataTech = await Company.create({
        name: 'DataTech Analytics',
        description: 'Data analytics solutions provider',
        industry: 'Data & Analytics',
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        website: 'https://datatech.com',
        companySize: '11-50',
        verified: true
      });
    }

    // Get or create employer user
    let employer = await User.findOne({ role: 'employer' });
    if (!employer) {
      employer = await User.create({
        name: 'Employer User',
        email: 'employer@example.com',
        password: 'password123',
        role: 'employer',
        company: techSolutions._id
      });
    }

    // Clear existing featured jobs
    await Job.deleteMany({ featured: true });
    console.log('Cleared existing featured jobs');

    // Create featured jobs matching the reference image
    const featuredJobs = [
      {
        title: 'Contract DevOps Engineer',
        company: techSolutions._id,
        postedBy: employer._id,
        description: 'We are seeking an experienced DevOps Engineer to work on contract basis.',
        requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', '4+ years experience'],
        location: { city: 'Remote', state: 'Remote', country: 'India' },
        employmentType: 'Contract',
        workMode: 'Remote',
        category: 'Software Development',
        salary: { min: 1800000, max: 2400000, currency: 'INR' },
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        experience: { min: 4, max: 7 },
        status: 'Open',
        featured: true,
        createdAt: new Date('2025-12-17')
      },
      {
        title: 'Frontend Development Intern',
        company: techSolutions._id,
        postedBy: employer._id,
        description: 'Join our team as a Frontend Development Intern and learn modern web technologies.',
        requirements: ['HTML', 'CSS', 'JavaScript', 'React Basics', '0-1 years experience'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        employmentType: 'Internship',
        workMode: 'Hybrid',
        category: 'Software Development',
        salary: { min: 180000, max: 240000, currency: 'INR' },
        skills: ['HTML', 'CSS', 'JavaScript', 'React Basics'],
        experience: { min: 0, max: 1 },
        status: 'Open',
        featured: true,
        createdAt: new Date('2025-12-17')
      },
      {
        title: 'Data Science Intern',
        company: dataTech._id,
        postedBy: employer._id,
        description: 'Exciting opportunity for Data Science enthusiasts to work with real-world data.',
        requirements: ['Python', 'Statistics', 'Machine Learning Basics', 'SQL', '0-1 years experience'],
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        employmentType: 'Internship',
        workMode: 'Hybrid',
        category: 'Data Science',
        salary: { min: 200000, max: 300000, currency: 'INR' },
        skills: ['Python', 'Statistics', 'Machine Learning Basics', 'SQL'],
        experience: { min: 0, max: 1 },
        status: 'Open',
        featured: true,
        createdAt: new Date('2025-12-17')
      },
      {
        title: 'HR Manager',
        company: techSolutions._id,
        postedBy: employer._id,
        description: 'Manage recruitment and employee relations for our growing team.',
        requirements: ['Recruitment', 'Employee Relations', 'HR Policies', '4+ years experience'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'HR & Recruitment',
        salary: { min: 1100000, max: 1600000, currency: 'INR' },
        skills: ['Recruitment', 'Employee Relations', 'HR Policies'],
        experience: { min: 4, max: 7 },
        status: 'Open',
        featured: true,
        createdAt: new Date('2025-12-17')
      },
      {
        title: 'Financial Analyst',
        company: dataTech._id,
        postedBy: employer._id,
        description: 'Analyze financial data and provide insights for business decisions.',
        requirements: ['Financial Modeling', 'Excel', 'Data Analysis', '2+ years experience'],
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Banking & Finance',
        salary: { min: 1000000, max: 1500000, currency: 'INR' },
        skills: ['Financial Modeling', 'Excel', 'Data Analysis'],
        experience: { min: 2, max: 5 },
        status: 'Open',
        featured: true,
        createdAt: new Date('2025-12-17')
      },
      {
        title: 'Digital Marketing Manager',
        company: techSolutions._id,
        postedBy: employer._id,
        description: 'Lead our digital marketing initiatives and grow our online presence.',
        requirements: ['SEO', 'Social Media Marketing', 'Content Strategy', '4+ years experience'],
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Marketing',
        salary: { min: 1200000, max: 1800000, currency: 'INR' },
        skills: ['SEO', 'Social Media Marketing', 'Content Strategy', 'Analytics'],
        experience: { min: 4, max: 7 },
        status: 'Open',
        featured: true,
        createdAt: new Date('2025-12-17')
      }
    ];

    await Job.insertMany(featuredJobs);
    console.log('✅ Successfully added 6 featured jobs!');
    console.log('Jobs created:');
    featuredJobs.forEach(job => console.log(`  - ${job.title} at ${job.location.city}`));

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

addFeaturedJobs();
