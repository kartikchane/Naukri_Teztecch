require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { startJobExpirationChecker } = require('./utils/jobExpiration');


// Connect to MongoDB
connectDB();

// Start job expiration checker
startJobExpirationChecker();

// Log uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();

// Middleware - CORS for production
const allowedOrigins = [
  'https://teztecch-naukri-frontend.vercel.app',
  'https://teztech-naukri-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',  // Admin Panel Local
  'https://your-admin-panel.vercel.app'  // Admin Panel Production (update with actual URL)
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

// Serve uploaded files with path normalization middleware
app.use('/uploads', (req, res, next) => {
  // Normalize path - remove absolute path prefixes if present
  let filePath = req.path;
  
  // Handle absolute Windows paths (D:/demo_project/...)
  if (filePath.includes('demo_project')) {
    const parts = filePath.split('uploads/');
    filePath = parts.length > 1 ? '/' + parts[parts.length - 1] : filePath;
  }
  
  req.url = filePath;
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Serve Admin Panel static files (Production) - only static assets
if (process.env.NODE_ENV === 'production') {
  const adminPanelPath = path.join(__dirname, '../admin-panel/build');
  app.use(express.static(adminPanelPath));
}

// Root route for development
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Naukri Platform API',
      status: 'running',
      endpoints: {
        health: '/api/health',
        jobs: '/api/jobs',
        stats: '/api/stats',
        auth: '/api/auth',
        admin: 'http://localhost:3001 (Admin Panel)'
      }
    });
  });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/admin', require('./routes/admin')); // Admin routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date() });
});

// Serve Admin Panel for all non-API routes (Production) - MUST BE AFTER API ROUTES
if (process.env.NODE_ENV === 'production') {
  const adminPanelPath = path.join(__dirname, '../admin-panel/build');
  app.get('*', (req, res) => {
    res.sendFile(path.join(adminPanelPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler - Only for API routes in production
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

const PORT = process.env.PORT || 5000;

// Always start server (Vercel will ignore this in serverless mode)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel serverless
module.exports = app;
