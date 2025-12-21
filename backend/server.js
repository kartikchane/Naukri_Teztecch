require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { startJobExpirationChecker } = require('./utils/jobExpiration');
const multer = require('multer');

// Connect to MongoDB only when a connection string is provided.
// In serverless environments (e.g. Vercel) env vars may be set in the project
// settings; if missing, skip connect to avoid crashing during import.
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn('MONGODB_URI not set - skipping DB connect. Set MONGODB_URI in deployment env vars.');
}

// Start job expiration checker only in long-running environments (development or when explicitly enabled).
// Serverless platforms should not run background intervals on import.
if (process.env.NODE_ENV !== 'production' || process.env.RUN_JOB_EXPIRATION === 'true') {
  startJobExpirationChecker();
} else {
  console.log('Skipping job expiration checker in production/serverless environment.');
}

const app = express();

// Middleware - CORS for production
const allowedOrigins = [
  'https://teztecch-naukri-frontend.vercel.app',
  'https://teztech-naukri-frontend.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true); // Temporarily allow all
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
// Ensure uploads directory exists (useful for local development)
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Naukri Platform API',
    status: 'running',
    endpoints: {
      health: '/api/health',
      jobs: '/api/jobs',
      stats: '/api/stats',
      auth: '/api/auth'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Multer-specific error handler (catch file upload errors)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

// Export for Vercel serverless
module.exports = app;
