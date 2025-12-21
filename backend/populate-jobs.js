const mongoose = require('mongoose');
require('dotenv').config();

const Job = require('./models/Job');
const Company = require('./models/Company');

async function addJobs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create or update company and ensure owner is set
    let company = await Company.findOne({ name: 'TezTech Solutions' });

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

    if (!company) {
      company = await Company.create({
        name: 'TezTech Solutions',
        description: 'Leading technology company',
        industry: 'Technology',
        location: 'Bangalore, India',
        website: 'https://teztech.com',
        employees: '1000-5000',
        owner: admin._id
      });
      console.log('Company created');
    } else {
      // Always ensure owner is set
      if (!company.owner || String(company.owner) !== String(admin._id)) {
        company.owner = admin._id;
        await company.save();
        console.log('Assigned admin as company owner (existing company)');
      }
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

    // Add jobs for other categories (expanded)
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
        title: 'Product Designer',
        company: company._id,
        postedBy: admin._id,
        description: 'Design end-to-end product experiences.',
        requirements: ['4+ years', 'Figma', 'Prototyping', 'User Testing'],
        location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Remote',
        category: 'Design',
        salary: { min: 900000, max: 1500000, currency: 'INR' },
        skills: ['Figma', 'User Research', 'Prototyping'],
        experience: { min: 4, max: 7 },
        status: 'Open',
        featured: false
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
        title: 'Data Engineer',
        company: company._id,
        postedBy: admin._id,
        description: 'Build ETL pipelines and data platforms.',
        requirements: ['3+ years', 'Python/Scala', 'Spark', 'Data Warehousing'],
        location: { city: 'Gurgaon', state: 'Haryana', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Data & Analytics',
        salary: { min: 1200000, max: 2200000, currency: 'INR' },
        skills: ['Spark', 'Airflow', 'SQL', 'Python'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: false
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
        title: 'Cloud Architect',
        company: company._id,
        postedBy: admin._id,
        description: 'Design cloud solutions and reference architectures.',
        requirements: ['6+ years', 'AWS/Azure/GCP', 'Architecting at scale'],
        location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Operations',
        salary: { min: 2000000, max: 3500000, currency: 'INR' },
        skills: ['Cloud', 'Kubernetes', 'Networking', 'Security'],
        experience: { min: 6, max: 12 },
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
        title: 'Content Writer',
        company: company._id,
        postedBy: admin._id,
        description: 'Create engaging content for blogs and product.',
        requirements: ['2+ years', 'SEO writing', 'Editing'],
        location: { city: 'Noida', state: 'Uttar Pradesh', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Remote',
        category: 'Content',
        salary: { min: 400000, max: 800000, currency: 'INR' },
        skills: ['Writing', 'SEO', 'Research'],
        experience: { min: 2, max: 4 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Sales Executive',
        company: company._id,
        postedBy: admin._id,
        description: 'Drive B2B sales and close enterprise deals.',
        requirements: ['3+ years', 'Sales', 'CRM', 'Negotiation'],
        location: { city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Sales',
        salary: { min: 500000, max: 1200000, currency: 'INR' },
        skills: ['Sales', 'Negotiation', 'CRM'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Human Resources Generalist',
        company: company._id,
        postedBy: admin._id,
        description: 'Manage recruitment and employee relations.',
        requirements: ['3+ years', 'Recruitment', 'HR Policies'],
        location: { city: 'Ahmedabad', state: 'Gujarat', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Human Resources',
        salary: { min: 500000, max: 900000, currency: 'INR' },
        skills: ['Recruitment', 'Employee Relations'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Quality Assurance Engineer',
        company: company._id,
        postedBy: admin._id,
        description: 'Ensure product quality with automated tests.',
        requirements: ['2+ years', 'Selenium', 'Cypress', 'Test Automation'],
        location: { city: 'Kochi', state: 'Kerala', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        category: 'Quality Assurance',
        salary: { min: 600000, max: 1100000, currency: 'INR' },
        skills: ['Selenium', 'Cypress', 'JavaScript', 'Test Automation'],
        experience: { min: 2, max: 5 },
        status: 'Open',
        featured: false
      },
      {
        title: 'Business Analyst',
        company: company._id,
        postedBy: admin._id,
        description: 'Work with stakeholders to define product requirements.',
        requirements: ['3+ years', 'Requirements Gathering', 'UML', 'Stakeholder Management'],
        location: { city: 'Lucknow', state: 'Uttar Pradesh', country: 'India' },
        employmentType: 'Full-time',
        workMode: 'On-site',
        category: 'Business',
        salary: { min: 700000, max: 1200000, currency: 'INR' },
        skills: ['Analysis', 'Communication', 'Documentation'],
        experience: { min: 3, max: 6 },
        status: 'Open',
        featured: false
      }
    ];

    const allJobs = [...softwareJobs, ...otherJobs];

    let addedCount = 0;
    for (const job of allJobs) {
      // Check if a job with same title and company already exists
      const exists = await Job.findOne({ title: job.title, company: job.company });
      if (!exists) {
        await Job.create(job);
        addedCount++;
        console.log(`Added: ${job.title}`);
      } else {
        console.log(`Skipped (already exists): ${job.title}`);
      }
    }
    console.log(`\n✅ Successfully added ${addedCount} new jobs (existing jobs were not deleted)`);

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
    console.log('\n✅ Database update complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addJobs();
