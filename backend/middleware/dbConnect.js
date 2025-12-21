const { connectDB, getDBStatus, mongoose } = require('../config/db');

/**
 * Middleware to ensure DB connection is established.
 * If connection is ready, continue. If not, attempt connect.
 * On failure, respond with 503 and DB status (helps serverless deployments).
 */
module.exports = async function dbConnect(req, res, next) {
  try {
    const state = mongoose && mongoose.connection ? mongoose.connection.readyState : 0;
    // 1 == connected
    if (state === 1) return next();

    // If connection is in progress (2), allow request to continue and hope connection completes
    if (state === 2) return next();

    // Try to connect (will return null on failure)
    const conn = await connectDB();
    if (conn) return next();

    // If we reach here, connection failed. Return a graceful 503 with DB status
    const dbStatus = getDBStatus ? getDBStatus() : { connected: false };
    res.status(503).json({
      message: 'Service temporarily unavailable - database connection failed',
      db: dbStatus
    });
  } catch (err) {
    const dbStatus = getDBStatus ? getDBStatus() : { connected: false, error: String(err.message || err) };
    res.status(503).json({ message: 'Service temporarily unavailable', db: dbStatus });
  }
};
