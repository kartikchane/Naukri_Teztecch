require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    console.log('Cleared existing data');

    // Create Users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const jobSeeker = await User.create({
      name: 'John Doe',
      email: 'jobseeker@example.com',
      password: hashedPassword,
      role: 'jobseeker',
      phone: '+91 9876543210',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      },
      bio: 'Full-stack developer with 3 years of experience',
    });

    const employer = await User.create({
      name: 'Jane Smith',
      email: 'employer@example.com',
      password: hashedPassword,
      role: 'employer',
      phone: '+91 9876543211',
    });

    console.log('Created users');

    // Create Companies
    const company1 = await Company.create({
      name: 'Tech Solutions Inc',
      description: 'Leading technology company specializing in web and mobile app development',
      website: 'https://techsolutions.example.com',
      logo: '/teztecch-logo.svg',
      industry: 'Technology',
      companySize: '51-200',
      location: {
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India'
      },
      owner: employer._id,
      verified: true
    });

    const company2 = await Company.create({
      name: 'DataTech Analytics',
      description: 'Data analytics and business intelligence solutions provider',
      website: 'https://datatech.example.com',
      logo: '/teztecch-logo.svg',
      industry: 'Data & Analytics',
      companySize: '11-50',
      location: {
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India'
      },
      owner: employer._id,
      verified: true
    });

    console.log('Created companies');

    // Update employer with company
    employer.company = company1._id;
    await employer.save();

    // Create Jobs
    const jobs = [
      // Software Development Jobs
      {
        title: 'Senior Full Stack Developer',
        description: 'We are looking for an experienced Full Stack developer to join our team and work on exciting projects using modern technologies.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Full-time',
        workMode: 'Remote',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 1800000,
          max: 2800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 5,
          max: 8
        },
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        requirements: [
          '5+ years of full stack development experience',
          'Strong knowledge of React and Node.js',
          'Experience with cloud platforms (AWS/Azure)',
          'Good understanding of microservices architecture'
        ],
        responsibilities: [
          'Design and develop full stack applications',
          'Build reusable components and backend APIs',
          'Optimize applications for performance and scalability',
          'Mentor junior developers'
        ],
        benefits: ['Health Insurance', 'Work from Home', 'Flexible Hours', 'Stock Options'],
        openings: 3,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Python Developer',
        description: 'Join our team as a Python developer to build scalable backend systems and data pipelines.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        location: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 1200000,
          max: 1800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 6
        },
        skills: ['Python', 'Django', 'Flask', 'PostgreSQL', 'Docker'],
        requirements: [
          '3+ years of Python development',
          'Experience with Django or Flask',
          'Strong knowledge of databases',
          'Understanding of containerization'
        ],
        responsibilities: [
          'Develop backend APIs and services',
          'Build data processing pipelines',
          'Optimize code for performance',
          'Write comprehensive tests'
        ],
        benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget'],
        openings: 2,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Java Spring Boot Developer',
        description: 'Experienced Java developer needed for enterprise application development.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: 'Hyderabad',
          state: 'Telangana',
          country: 'India'
        },
        salary: {
          min: 1500000,
          max: 2200000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 4,
          max: 7
        },
        skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Redis'],
        requirements: [
          '4+ years of Java development',
          'Expert in Spring Boot framework',
          'Experience with microservices',
          'Knowledge of caching strategies'
        ],
        responsibilities: [
          'Design and develop enterprise applications',
          'Build RESTful APIs',
          'Implement security best practices',
          'Collaborate with cross-functional teams'
        ],
        benefits: ['Health Insurance', 'Transport', 'Performance Bonus'],
        openings: 2,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Frontend React Developer',
        description: 'Build beautiful and responsive user interfaces using React and modern frontend technologies.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Full-time',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 1000000,
          max: 1600000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 5
        },
        skills: ['React', 'JavaScript', 'CSS', 'Redux', 'Webpack'],
        requirements: [
          '2+ years of React development',
          'Strong JavaScript fundamentals',
          'Experience with state management',
          'Knowledge of responsive design'
        ],
        responsibilities: [
          'Develop user-facing features',
          'Build reusable components',
          'Ensure cross-browser compatibility',
          'Optimize applications for speed'
        ],
        benefits: ['Health Insurance', 'Work from Home', 'Flexible Hours'],
        openings: 3,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Mobile App Developer (React Native)',
        description: 'Develop cross-platform mobile applications using React Native.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 1400000,
          max: 2000000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 6
        },
        skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Firebase'],
        requirements: [
          '3+ years of mobile development',
          'Strong React Native experience',
          'Published apps on App Store/Play Store',
          'Knowledge of native modules'
        ],
        responsibilities: [
          'Develop mobile applications',
          'Integrate with backend APIs',
          'Optimize app performance',
          'Handle app store submissions'
        ],
        benefits: ['Health Insurance', 'Hybrid Work', 'Device Allowance'],
        openings: 2,
        featured: false,
        status: 'Open'
      },

      // Data & Analytics Jobs
      {
        title: 'Data Scientist',
        description: 'Join our analytics team to build predictive models and extract insights from large datasets.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Data & Analytics',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        location: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 1500000,
          max: 2500000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 7
        },
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
        requirements: [
          '3+ years in data science',
          'Strong ML/AI experience',
          'Proficiency in Python and SQL',
          'Experience with deep learning frameworks'
        ],
        responsibilities: [
          'Build predictive models',
          'Analyze complex datasets',
          'Present findings to stakeholders',
          'Deploy ML models to production'
        ],
        benefits: ['Health Insurance', 'Performance Bonus', 'Learning Budget'],
        openings: 2,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Business Intelligence Analyst',
        description: 'Transform data into actionable insights using BI tools and analytics.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Data & Analytics',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 900000,
          max: 1400000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 5
        },
        skills: ['Power BI', 'Tableau', 'SQL', 'Excel', 'Data Visualization'],
        requirements: [
          '2+ years of BI experience',
          'Expert in Power BI or Tableau',
          'Strong SQL skills',
          'Business acumen'
        ],
        responsibilities: [
          'Create interactive dashboards',
          'Generate business reports',
          'Identify trends and patterns',
          'Support decision-making process'
        ],
        benefits: ['Health Insurance', 'Performance Bonus', 'Transport'],
        openings: 1,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Data Engineer',
        description: 'Build and maintain data pipelines and infrastructure for large-scale data processing.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Data & Analytics',
        employmentType: 'Full-time',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 1600000,
          max: 2400000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 4,
          max: 7
        },
        skills: ['Python', 'Spark', 'Kafka', 'AWS', 'SQL', 'ETL'],
        requirements: [
          '4+ years in data engineering',
          'Experience with big data tools',
          'Strong Python and SQL',
          'Cloud platform experience'
        ],
        responsibilities: [
          'Design data pipelines',
          'Optimize data processing',
          'Ensure data quality',
          'Implement ETL processes'
        ],
        benefits: ['Health Insurance', 'Work from Home', 'Stock Options'],
        openings: 2,
        featured: true,
        status: 'Open'
      },

      // Design Jobs
      {
        title: 'UI/UX Designer',
        description: 'Creative designer needed to craft beautiful and intuitive user experiences.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Design',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 1200000,
          max: 1800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 6
        },
        skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
        requirements: [
          '3+ years of UI/UX design',
          'Strong portfolio',
          'Expert in design tools',
          'Understanding of design principles'
        ],
        responsibilities: [
          'Design user interfaces',
          'Create wireframes and prototypes',
          'Conduct user testing',
          'Maintain design systems'
        ],
        benefits: ['Health Insurance', 'Hybrid Work', 'Creative Freedom'],
        openings: 2,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Graphic Designer',
        description: 'Create stunning visual content for digital and print media.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Design',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        },
        salary: {
          min: 600000,
          max: 1000000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 4
        },
        skills: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Typography'],
        requirements: [
          '2+ years of graphic design',
          'Strong visual design skills',
          'Expert in Adobe Creative Suite',
          'Portfolio showcasing diverse work'
        ],
        responsibilities: [
          'Design marketing materials',
          'Create brand assets',
          'Design social media content',
          'Collaborate with marketing team'
        ],
        benefits: ['Health Insurance', 'Creative Environment'],
        openings: 1,
        featured: false,
        status: 'Open'
      },

      // Marketing Jobs
      {
        title: 'Digital Marketing Manager',
        description: 'Lead digital marketing initiatives and drive online growth.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Marketing',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 1200000,
          max: 1800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 4,
          max: 7
        },
        skills: ['SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing'],
        requirements: [
          '4+ years in digital marketing',
          'Proven track record',
          'Strong analytical skills',
          'Experience with marketing tools'
        ],
        responsibilities: [
          'Develop marketing strategies',
          'Manage campaigns',
          'Analyze campaign performance',
          'Lead marketing team'
        ],
        benefits: ['Health Insurance', 'Performance Bonus', 'Flexible Hours'],
        openings: 1,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Content Writer',
        description: 'Create engaging content for blogs, websites, and marketing materials.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Marketing',
        employmentType: 'Full-time',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 500000,
          max: 800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 1,
          max: 3
        },
        skills: ['Content Writing', 'SEO', 'Research', 'Storytelling', 'Copywriting'],
        requirements: [
          '1+ years of content writing',
          'Excellent writing skills',
          'SEO knowledge',
          'Portfolio of published work'
        ],
        responsibilities: [
          'Write blog posts and articles',
          'Create marketing copy',
          'Research industry topics',
          'Optimize content for SEO'
        ],
        benefits: ['Health Insurance', 'Work from Home', 'Flexible Hours'],
        openings: 2,
        featured: false,
        status: 'Open'
      },

      // Customer Support Jobs
      {
        title: 'Customer Support Executive',
        description: 'Provide exceptional customer service and resolve customer queries.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Customer Support',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 400000,
          max: 600000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 1,
          max: 3
        },
        skills: ['Communication', 'Problem Solving', 'CRM Tools', 'Customer Service'],
        requirements: [
          '1+ years in customer support',
          'Excellent communication skills',
          'Patient and empathetic',
          'Technical aptitude'
        ],
        responsibilities: [
          'Handle customer inquiries',
          'Resolve issues promptly',
          'Document customer interactions',
          'Provide product guidance'
        ],
        benefits: ['Health Insurance', 'Night Shift Allowance', 'Transport'],
        openings: 5,
        featured: false,
        status: 'Open'
      },

      // Banking & Finance Jobs
      {
        title: 'Financial Analyst',
        description: 'Analyze financial data and provide insights for business decisions.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Banking & Finance',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 1000000,
          max: 1500000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 5
        },
        skills: ['Financial Modeling', 'Excel', 'SAP', 'Risk Analysis', 'Accounting'],
        requirements: [
          '2+ years in finance',
          'Strong Excel skills',
          'Knowledge of financial principles',
          'Analytical mindset'
        ],
        responsibilities: [
          'Prepare financial reports',
          'Conduct financial analysis',
          'Support budgeting process',
          'Identify financial trends'
        ],
        benefits: ['Health Insurance', 'Performance Bonus', 'Retirement Benefits'],
        openings: 2,
        featured: true,
        status: 'Open'
      },

      // Operations Jobs
      {
        title: 'Operations Manager',
        description: 'Oversee daily operations and improve operational efficiency.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Operations',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 1300000,
          max: 1800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 5,
          max: 8
        },
        skills: ['Operations Management', 'Process Improvement', 'Team Leadership', 'Analytics'],
        requirements: [
          '5+ years in operations',
          'Strong leadership skills',
          'Process optimization experience',
          'Data-driven approach'
        ],
        responsibilities: [
          'Manage daily operations',
          'Improve processes',
          'Lead operations team',
          'Ensure quality standards'
        ],
        benefits: ['Health Insurance', 'Performance Bonus', 'Leadership Training'],
        openings: 1,
        featured: false,
        status: 'Open'
      },

      // HR & Recruitment Jobs
      {
        title: 'HR Manager',
        description: 'Lead HR initiatives and manage talent acquisition and employee relations.',
        company: company1._id,
        postedBy: employer._id,
        category: 'HR & Recruitment',
        employmentType: 'Full-time',
        workMode: 'Hybrid',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 1100000,
          max: 1600000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 4,
          max: 7
        },
        skills: ['Recruitment', 'Employee Relations', 'HR Policies', 'HRIS', 'Compliance'],
        requirements: [
          '4+ years in HR',
          'Experience in recruitment',
          'Knowledge of labor laws',
          'Strong interpersonal skills'
        ],
        responsibilities: [
          'Manage recruitment process',
          'Handle employee relations',
          'Implement HR policies',
          'Conduct training programs'
        ],
        benefits: ['Health Insurance', 'Flexible Hours', 'Professional Development'],
        openings: 1,
        featured: true,
        status: 'Open'
      },

      // Part-time Jobs
      {
        title: 'Part-time Content Writer',
        description: 'Create engaging blog posts and articles on a flexible schedule.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Marketing',
        employmentType: 'Part-time',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 300000,
          max: 500000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 1,
          max: 3
        },
        skills: ['Content Writing', 'SEO', 'Research', 'Editing'],
        requirements: [
          '1+ years of writing experience',
          'Strong writing portfolio',
          'Availability for 20-25 hours per week',
          'Good communication skills'
        ],
        responsibilities: [
          'Write 8-10 articles per month',
          'Research industry topics',
          'Optimize content for SEO',
          'Meet deadlines'
        ],
        benefits: ['Flexible Hours', 'Work from Home', 'Performance Bonus'],
        openings: 3,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Part-time UI Designer',
        description: 'Design user interfaces for web and mobile applications on a part-time basis.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Design',
        employmentType: 'Part-time',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 400000,
          max: 700000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 4
        },
        skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping'],
        requirements: [
          '2+ years of UI design experience',
          'Strong portfolio',
          'Availability for 20 hours per week',
          'Expert in design tools'
        ],
        responsibilities: [
          'Create UI designs',
          'Design mockups',
          'Collaborate with team',
          'Maintain design consistency'
        ],
        benefits: ['Flexible Hours', 'Work from Home'],
        openings: 2,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Part-time Data Entry Specialist',
        description: 'Accurate data entry and database management on flexible hours.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Operations',
        employmentType: 'Part-time',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 200000,
          max: 350000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 0,
          max: 2
        },
        skills: ['Excel', 'Data Entry', 'Attention to Detail', 'Typing Speed'],
        requirements: [
          'Good typing speed (40+ WPM)',
          'Attention to detail',
          'Basic Excel knowledge',
          'Availability for 15-20 hours per week'
        ],
        responsibilities: [
          'Enter data accurately',
          'Maintain databases',
          'Verify data accuracy',
          'Generate reports'
        ],
        benefits: ['Flexible Hours', 'Work from Home'],
        openings: 5,
        featured: false,
        status: 'Open'
      },

      // Contract Jobs
      {
        title: 'Contract Frontend Developer',
        description: '6-month contract for building a new web application.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Contract',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 1200000,
          max: 1800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 6
        },
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'REST API'],
        requirements: [
          '3+ years of React experience',
          'Available for 6-month contract',
          'Strong JavaScript skills',
          'Portfolio of completed projects'
        ],
        responsibilities: [
          'Develop web application',
          'Implement features',
          'Write clean code',
          'Meet project milestones'
        ],
        benefits: ['Remote Work', 'Competitive Pay'],
        openings: 2,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Contract Digital Marketing Consultant',
        description: '3-month contract to revamp digital marketing strategy.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Marketing',
        employmentType: 'Contract',
        workMode: 'Hybrid',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 800000,
          max: 1200000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 4,
          max: 8
        },
        skills: ['SEO', 'SEM', 'Social Media Marketing', 'Analytics', 'Strategy'],
        requirements: [
          '4+ years in digital marketing',
          'Proven track record',
          'Available for 3-month contract',
          'Strategic mindset'
        ],
        responsibilities: [
          'Develop marketing strategy',
          'Execute campaigns',
          'Analyze performance',
          'Provide recommendations'
        ],
        benefits: ['Hybrid Work', 'Performance Bonus'],
        openings: 1,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Contract Data Analyst',
        description: '4-month project for data migration and analysis.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Data & Analytics',
        employmentType: 'Contract',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 900000,
          max: 1300000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 5
        },
        skills: ['SQL', 'Python', 'Excel', 'Data Visualization', 'ETL'],
        requirements: [
          '2+ years in data analysis',
          'Strong SQL and Python',
          'Available for 4-month contract',
          'Experience with data migration'
        ],
        responsibilities: [
          'Migrate data',
          'Analyze datasets',
          'Create reports',
          'Document processes'
        ],
        benefits: ['Remote Work', 'Flexible Hours'],
        openings: 1,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Contract DevOps Engineer',
        description: '6-month contract to set up CI/CD pipelines and cloud infrastructure.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Contract',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 1800000,
          max: 2400000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 4,
          max: 7
        },
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        requirements: [
          '4+ years in DevOps',
          'AWS certification preferred',
          'Available for 6-month contract',
          'Strong automation skills'
        ],
        responsibilities: [
          'Set up CI/CD pipelines',
          'Configure cloud infrastructure',
          'Implement monitoring',
          'Document architecture'
        ],
        benefits: ['Remote Work', 'Competitive Pay'],
        openings: 1,
        featured: true,
        status: 'Open'
      },

      // Internship Jobs
      {
        title: 'Frontend Development Intern',
        description: 'Learn and build web applications using React and modern frontend technologies.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Internship',
        workMode: 'Hybrid',
        location: {
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 180000,
          max: 240000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 0,
          max: 1
        },
        skills: ['HTML', 'CSS', 'JavaScript', 'React Basics'],
        requirements: [
          'Currently pursuing or completed CS degree',
          'Basic knowledge of HTML, CSS, JavaScript',
          'Eager to learn',
          '6-month commitment'
        ],
        responsibilities: [
          'Build UI components',
          'Learn from senior developers',
          'Fix bugs',
          'Participate in code reviews'
        ],
        benefits: ['Learning Opportunity', 'Mentorship', 'Certificate', 'Pre-Placement Offer'],
        openings: 5,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Data Science Intern',
        description: 'Work on real-world data science projects and learn ML techniques.',
        company: company2._id,
        postedBy: employer._id,
        category: 'Data & Analytics',
        employmentType: 'Internship',
        workMode: 'Hybrid',
        location: {
          city: 'Pune',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 200000,
          max: 300000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 0,
          max: 1
        },
        skills: ['Python', 'Statistics', 'Machine Learning Basics', 'SQL'],
        requirements: [
          'Pursuing degree in CS/Statistics/Math',
          'Basic Python knowledge',
          'Understanding of statistics',
          '6-month internship'
        ],
        responsibilities: [
          'Analyze datasets',
          'Build ML models',
          'Create visualizations',
          'Learn from data scientists'
        ],
        benefits: ['Learning Opportunity', 'Mentorship', 'Certificate', 'Stipend'],
        openings: 3,
        featured: true,
        status: 'Open'
      },
      {
        title: 'Graphic Design Intern',
        description: 'Create visual content and learn professional design practices.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Design',
        employmentType: 'Internship',
        workMode: 'On-site',
        location: {
          city: 'Delhi',
          state: 'Delhi',
          country: 'India'
        },
        salary: {
          min: 150000,
          max: 200000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 0,
          max: 1
        },
        skills: ['Adobe Photoshop', 'Illustrator', 'Creativity', 'Basic Design'],
        requirements: [
          'Pursuing design degree or course',
          'Basic knowledge of design tools',
          'Creative portfolio',
          '3-6 month internship'
        ],
        responsibilities: [
          'Design social media posts',
          'Create marketing materials',
          'Assist senior designers',
          'Learn design principles'
        ],
        benefits: ['Learning Opportunity', 'Mentorship', 'Certificate', 'Portfolio Building'],
        openings: 4,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Digital Marketing Intern',
        description: 'Learn SEO, social media marketing, and content creation.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Marketing',
        employmentType: 'Internship',
        workMode: 'Hybrid',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 120000,
          max: 180000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 0,
          max: 1
        },
        skills: ['Social Media', 'Content Creation', 'Basic SEO', 'Communication'],
        requirements: [
          'Pursuing MBA/BBA or related degree',
          'Good communication skills',
          'Social media savvy',
          '3-6 month internship'
        ],
        responsibilities: [
          'Manage social media accounts',
          'Create content',
          'Assist in campaigns',
          'Learn marketing strategies'
        ],
        benefits: ['Learning Opportunity', 'Mentorship', 'Certificate', 'Flexible Hours'],
        openings: 3,
        featured: false,
        status: 'Open'
      },

      // Freelance Jobs
      {
        title: 'Freelance React Developer',
        description: 'Build React components and features on a project basis.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Freelance',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 800000,
          max: 1500000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 8
        },
        skills: ['React', 'JavaScript', 'TypeScript', 'Git'],
        requirements: [
          '3+ years of React experience',
          'Strong portfolio',
          'Available for multiple projects',
          'Self-motivated'
        ],
        responsibilities: [
          'Build React components',
          'Implement features',
          'Fix bugs',
          'Deliver on time'
        ],
        benefits: ['Flexible Schedule', 'Remote Work', 'Project-based Pay'],
        openings: 3,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Freelance Content Writer',
        description: 'Write articles, blogs, and website content on a freelance basis.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Marketing',
        employmentType: 'Freelance',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 400000,
          max: 800000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 5
        },
        skills: ['Content Writing', 'SEO', 'Research', 'Editing'],
        requirements: [
          '2+ years of writing experience',
          'Strong portfolio',
          'Ability to meet deadlines',
          'SEO knowledge'
        ],
        responsibilities: [
          'Write quality content',
          'Research topics',
          'Optimize for SEO',
          'Revise based on feedback'
        ],
        benefits: ['Flexible Schedule', 'Remote Work', 'Per-article Payment'],
        openings: 5,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Freelance UI/UX Designer',
        description: 'Design beautiful interfaces for web and mobile projects.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Design',
        employmentType: 'Freelance',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 600000,
          max: 1200000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 2,
          max: 6
        },
        skills: ['Figma', 'Adobe XD', 'UI Design', 'Prototyping', 'User Research'],
        requirements: [
          '2+ years of design experience',
          'Strong portfolio',
          'Available for projects',
          'Good communication'
        ],
        responsibilities: [
          'Design user interfaces',
          'Create prototypes',
          'Collaborate remotely',
          'Deliver designs on time'
        ],
        benefits: ['Flexible Schedule', 'Remote Work', 'Project-based Pay'],
        openings: 2,
        featured: false,
        status: 'Open'
      },
      {
        title: 'Freelance Python Developer',
        description: 'Develop backend services and scripts on a freelance basis.',
        company: company1._id,
        postedBy: employer._id,
        category: 'Software Development',
        employmentType: 'Freelance',
        workMode: 'Remote',
        location: {
          city: 'Remote',
          state: '',
          country: 'India'
        },
        salary: {
          min: 700000,
          max: 1400000,
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: 3,
          max: 7
        },
        skills: ['Python', 'Django', 'Flask', 'API Development', 'Databases'],
        requirements: [
          '3+ years of Python experience',
          'Strong backend skills',
          'Portfolio of projects',
          'Self-managed'
        ],
        responsibilities: [
          'Develop backend services',
          'Build APIs',
          'Write scripts',
          'Deliver quality code'
        ],
        benefits: ['Flexible Schedule', 'Remote Work', 'Competitive Rates'],
        openings: 2,
        featured: false,
        status: 'Open'
      }
    ];

    await Job.insertMany(jobs);
    console.log('Created jobs');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Job Seeker:');
    console.log('  Email: jobseeker@example.com');
    console.log('  Password: password123');
    console.log('\nEmployer:');
    console.log('  Email: employer@example.com');
    console.log('  Password: password123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeder
connectDB().then(seedData);
