/**
 * Health Check API Routes
 */

const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

/**
 * GET /api/health/detailed
 * Detailed health information
 */
router.get('/detailed', (req, res) => {
  const memUsage = process.memoryUsage();

  res.json({
    success: true,
    status: 'healthy',
    timestamp: Date.now(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
      external: Math.round(memUsage.external / 1024 / 1024) + ' MB'
    },
    cpuUsage: process.cpuUsage(),
    modules: {
      gesture_recognition: 'active',
      voice_processor: 'active',
      app_automation: 'active'
    }
  });
});

module.exports = router;
