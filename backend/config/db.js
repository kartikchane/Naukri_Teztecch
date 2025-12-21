const mongoose = require('mongoose');

let lastError = null;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    lastError = null;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    lastError = error;
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit process in serverless environments (Vercel) where module import
    // happens on each invocation. Let the application handle missing DB gracefully
    // and return so the function can respond with proper errors instead of crashing.
    return null;
  }
};

const getDBStatus = () => {
  try {
    const state = mongoose.connection.readyState; // 0 = disconnected, 1 = connected
    return {
      connected: state === 1,
      readyState: state,
      host: mongoose.connection.host || null,
      error: lastError ? String(lastError.message || lastError) : null
    };
  } catch (err) {
    return { connected: false, readyState: 0, host: null, error: String(err.message || err) };
  }
};

module.exports = { connectDB, getDBStatus, mongoose };
