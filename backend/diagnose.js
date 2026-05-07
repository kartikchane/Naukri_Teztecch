#!/usr/bin/env node

// Quick diagnostic script to check backend issues
require('dotenv').config();

console.log('🔍 Backend Diagnostic Check\n');

// Check environment variables
console.log('📋 Checking Environment Variables:');
const requiredEnvs = [
  'MONGODB_URI',
  'JWT_SECRET',
  'PORT',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'AWS_ACCESS_KEY_ID',
  'AWS_S3_BUCKET'
];

let allEnvsPresent = true;
requiredEnvs.forEach(env => {
  const value = process.env[env];
  if (value) {
    const masked = env.includes('SECRET') || env.includes('PASSWORD') || env.includes('KEY') 
      ? '***MASKED***' 
      : value.substring(0, 20) + (value.length > 20 ? '...' : '');
    console.log(`  ✅ ${env}: ${masked}`);
  } else {
    console.log(`  ❌ ${env}: MISSING`);
    allEnvsPresent = false;
  }
});

if (!allEnvsPresent) {
  console.log('\n⚠️  Some environment variables are missing!');
  process.exit(1);
}

// Check dependencies
console.log('\n📦 Checking Dependencies:');
const dependencies = [
  'express',
  'mongoose',
  'dotenv',
  'multer',
  'razorpay',
  'aws-sdk'
];

dependencies.forEach(dep => {
  try {
    require(dep);
    console.log(`  ✅ ${dep}: installed`);
  } catch (e) {
    console.log(`  ❌ ${dep}: NOT INSTALLED`);
  }
});

// Test MongoDB connection
console.log('\n🔗 Testing MongoDB Connection:');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(conn => {
    console.log(`  ✅ Connected to: ${conn.connection.host}`);
    console.log(`  ✅ Database: ${conn.connection.name}`);
    process.exit(0);
  })
  .catch(err => {
    console.log(`  ❌ Connection failed: ${err.message}`);
    process.exit(1);
  });
