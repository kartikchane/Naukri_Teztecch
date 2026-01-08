// Test script to check admin stats API
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Application = require('./models/Application');

const testStats = async () => {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    const rejections = await Application.countDocuments({ status: 'Rejected' });
    console.log('📊 Direct DB Query - Rejections:', rejections);
    
    // Test exact query
    const apps = await Application.find({ status: 'Rejected' });
    console.log('📋 Found applications:', apps.length);
    
    apps.forEach(app => {
      console.log('  - Status:', app.status, '| ID:', app._id);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testStats();
