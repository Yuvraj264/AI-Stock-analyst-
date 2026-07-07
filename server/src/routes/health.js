import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Get server health status and check database connectivity
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const readyState = mongoose.connection.readyState;
  const dbStatus = dbStateMap[readyState] || 'unknown';
  const isDbHealthy = readyState === 1;

  // Determine status code depending on database connectivity
  const status = isDbHealthy ? 200 : 503;

  res.status(status).json({
    success: true,
    message: "Server running",
    uptime: `${process.uptime().toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      healthy: isDbHealthy
    }
  });
});

export default router;
