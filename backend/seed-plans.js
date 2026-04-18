/**
 * Seed script to populate default job posting plans
 * Run: node backend/seed-plans.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Plan = require('./models/Plan');

const seedPlans = async () => {
  try {
    await connectDB();

    // Clear existing plans
    await Plan.deleteMany({});

    const plans = [
      {
        name: 'free',
        displayName: 'Free',
        description: 'Free job posting plan',
        price: 0,
        billingCycle: 'one-time',
        planType: 'job-posting',
        displayOrder: 1,
        isActive: true,
        features: {
          jobsPerPosting: 1,
          totalJobPostings: 1,
          jobLocations: 1,
          jobValidityDays: 7,
          descriptionCharLimit: 250,
          viewApplicants: true,
          boostOnSearch: false,
          jobBranding: false,
          contactDetailsVisible: true,
          featuredPosting: false,
          discountPercentage: 0,
          resumeDatabase: false
        }
      },
      {
        name: 'standard',
        displayName: 'Standard',
        description: 'Standard job posting plan',
        price: 400,
        billingCycle: 'monthly',
        planType: 'job-posting',
        displayOrder: 2,
        isActive: true,
        features: {
          jobsPerPosting: 1,
          totalJobPostings: null, // unlimited
          jobLocations: 1,
          jobValidityDays: 15,
          descriptionCharLimit: 400,
          viewApplicants: true,
          boostOnSearch: false,
          jobBranding: false,
          contactDetailsVisible: true,
          featuredPosting: false,
          discountPercentage: 10,
          resumeDatabase: false
        }
      },
      {
        name: 'classified',
        displayName: 'Classified',
        description: 'Classified job posting plan with more features',
        price: 850,
        billingCycle: 'monthly',
        planType: 'job-posting',
        displayOrder: 3,
        isActive: true,
        features: {
          jobsPerPosting: 1,
          totalJobPostings: null, // unlimited
          jobLocations: 3,
          jobValidityDays: 30,
          descriptionCharLimit: 500,
          viewApplicants: true,
          boostOnSearch: true,
          jobBranding: true,
          contactDetailsVisible: true,
          featuredPosting: false,
          discountPercentage: 10,
          resumeDatabase: true
        }
      },
      {
        name: 'hot-vacancy',
        displayName: 'Hot Vacancy',
        description: 'Premium hot vacancy job posting plan',
        price: 1650,
        billingCycle: 'monthly',
        planType: 'job-posting',
        displayOrder: 4,
        isActive: true,
        features: {
          jobsPerPosting: 3,
          totalJobPostings: null, // unlimited
          jobLocations: 5,
          jobValidityDays: 30,
          descriptionCharLimit: 1000,
          viewApplicants: true,
          boostOnSearch: true,
          jobBranding: true,
          contactDetailsVisible: true,
          featuredPosting: true,
          discountPercentage: 10,
          resumeDatabase: true
        }
      }
    ];

    // Insert plans
    const insertedPlans = await Plan.insertMany(plans);
    console.log(`✓ ${insertedPlans.length} job posting plans created successfully`);

    // Also create subscription plans for students and companies
    const subscriptionPlans = [
      {
        name: 'company-subscription',
        displayName: 'Company Subscription',
        description: 'Monthly subscription for company registration and verification',
        price: 1000,
        billingCycle: 'monthly',
        planType: 'company-subscription',
        displayOrder: 1,
        isActive: true,
        subscriptionFeatures: {
          companyVerificationFee: 1000,
          durationMonths: 1
        }
      },
      {
        name: 'student-job-viewing',
        displayName: 'Student Job Viewing Subscription',
        description: 'Monthly subscription for students to access premium jobs',
        price: 200,
        billingCycle: 'monthly',
        planType: 'job-viewing',
        displayOrder: 1,
        isActive: true,
        subscriptionFeatures: {
          studentViewingFee: 200,
          durationMonths: 1
        }
      }
    ];

    const insertedSubscriptionPlans = await Plan.insertMany(subscriptionPlans);
    console.log(`✓ ${insertedSubscriptionPlans.length} subscription plans created successfully`);

    console.log('\n✓ All plans seeded successfully!');
    console.log('\nPlans created:');
    console.log('- Free (₹0)');
    console.log('- Standard (₹400/month)');
    console.log('- Classified (₹850/month)');
    console.log('- Hot Vacancy (₹1,650/month)');
    console.log('- Company Subscription (₹1,000/month)');
    console.log('- Student Job Viewing (₹200/month)');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seedPlans();
