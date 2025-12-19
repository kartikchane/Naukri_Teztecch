const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Company = require('./models/Company');

async function addJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create a company first
    let company = await Company.findOne({ name: 'TezTech Solutions' });
    if (!company) {
      company = await Company.create({
        name: 'TezTech Solutions',
        description: 'Leading technology company',
        industry: 'Technology',
        location: 'Bangalore, India',
        website: 'https://teztech.com',
        employees: '1000-5000'
      });
      console.log('Company created');
    }

    // Get or create admin user
    const User = require('./models/User');
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: 'admin@teztech.com',
        password: 'admin123',
        role: 'admin'
      });
    }

    // Add jobs for Software Development category
    const softwareJobs = [
      {
        title: 'Senior Full Stack Developer',
        company: company._id,
        postedBy: admin._id,
        description: 'We are looking for an experienced Full Stack Developer to join our team.',
        requirements: ['5+ years experience', 'React.js', 'Node.js', 'MongoDB', 'REST APIs'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Software Development',
        salary: { min: 1200000, max: 2000000, currency: 'INR' },
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
        experience: { min: 5, max: 8 },
        status: 'Open',
        featured: true
      },
      {
        title: 'Backend Developer - Node.js',
        company: company._id,
        postedBy: admin._id,
        description: 'Join our backend team to build scalable microservices.',
        requirements: ['3+ years Node.js', 'MongoDB', 'AWS', 'Docker'],
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Remote',
        category: 'Software Development',
        salary: { min: 800000, max: 1500000, currency: 'INR' },
        skills: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: true
      },
      {
        title: 'Frontend Developer - React',
        company: company._id,
        postedBy: admin._id,
        description: 'Build amazing user interfaces with React.',
        requirements: ['2+ years React', 'Redux', 'TypeScript', 'Responsive Design'],
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Software Development',
        salary: { min: 600000, max: 1200000, currency: 'INR' },
        skills: ['React', 'Redux', 'TypeScript', 'HTML', 'CSS'],
        experience: { min: 2, max: 5 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Java Developer',
        company: company._id,
        postedBy: admin._id,
        description: 'Work on enterprise Java applications.',
        requirements: ['4+ years Java', 'Spring Boot', 'Hibernate', 'MySQL'],
        location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Software Development',
        salary: { min: 900000, max: 1600000, currency: 'INR' },
        skills: ['Java', 'Spring Boot', 'Hibernate', 'MySQL'],
        experience: { min: 4, max: 7 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Python Developer',
        company: company._id,
        postedBy: admin._id,
        description: 'Develop backend services using Python and Django.',
        requirements: ['3+ years Python', 'Django', 'PostgreSQL', 'REST APIs'],
        location: { city: 'Delhi', state: 'Delhi', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Remote',
        category: 'Software Development',
        salary: { min: 700000, max: 1400000, currency: 'INR' },
        skills: ['Python', 'Django', 'PostgreSQL', 'REST APIs'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: false
      }
    ];

    // Add jobs for other categories
    const otherJobs = [
      {
        title: 'UI/UX Designer',
        company: company._id,
        postedBy: admin._id,
        description: 'Create beautiful and intuitive user experiences.',
        requirements: ['3+ years UI/UX', 'Figma', 'Adobe XD', 'User Research'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Design',
        salary: { min: 800000, max: 1400000, currency: 'INR' },
        skills: ['Figma', 'Adobe XD', 'UI Design', 'UX Design'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: true
      },
      {
        title: 'Data Scientist',
        company: company._id,
        postedBy: admin._id,
        description: 'Analyze data and build ML models.',
        requirements: ['4+ years', 'Python', 'Machine Learning', 'TensorFlow'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Data & Analytics',
        salary: { min: 1500000, max: 2500000, currency: 'INR' },
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
        experience: { min: 4, max: 8 },
        status: 'Open',
        featured: true
      },
      {
        title: 'DevOps Engineer',
        company: company._id,
        postedBy: admin._id,
        description: 'Manage cloud infrastructure and CI/CD pipelines.',
        requirements: ['3+ years', 'AWS', 'Docker', 'Kubernetes', 'Jenkins'],
        location: { city: 'Mumbai', state: 'Maharashtra', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Remote',
        category: 'Operations',
        salary: { min: 1000000, max: 1800000, currency: 'INR' },
        skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: true
      },
      {
        title: 'Marketing Manager',
        company: company._id,
        postedBy: admin._id,
        description: 'Lead our digital marketing initiatives.',
        requirements: ['5+ years', 'Digital Marketing', 'SEO', 'Content Strategy'],
        location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Marketing',
        salary: { min: 1200000, max: 2000000, currency: 'INR' },
        skills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics'],
        experience: { min: 5, max: 8 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Customer Support Executive',
        company: company._id,
        postedBy: admin._id,
        description: 'Provide excellent customer support.',
        requirements: ['1+ years', 'Communication', 'Problem Solving'],
        location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Customer Support',
        salary: { min: 300000, max: 500000, currency: 'INR' },
        skills: ['Communication', 'Customer Service', 'Problem Solving'],
        experience: { min: 1, max: 3 },
        status: 'Open',
        featured: false
      }
    ];

    const allJobs = [...softwareJobs, ...otherJobs];

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert new jobs
    const inserted = await Job.insertMany(allJobs);
    console.log(`✅ Successfully added ${inserted.length} jobs`);

    // Show stats
    const stats = await Job.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nJobs by category:');
    stats.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} jobs`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database populated successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addJobs();
