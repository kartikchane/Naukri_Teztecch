const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit process in serverless environments (Vercel) where module import
    // happens on each invocation. Let the application handle missing DB gracefully
    // and return so the function can respond with proper errors instead of crashing.
    return null;
  }
};

module.exports = connectDB;
