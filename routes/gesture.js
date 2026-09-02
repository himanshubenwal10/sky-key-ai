/**
 * Gesture Recognition API Routes
 */

const express = require('express');
const router = express.Router();

// Initialize gesture recognizer
const GestureRecognizer = require('../modules/gesture-recognition');
const gestureRecognizer = new GestureRecognizer();

// Initialize on route load
gestureRecognizer.initialize();

/**
 * POST /api/gesture/recognize
 * Process video frame and detect gestures
 */
router.post('/recognize', async (req, res) => {
  try {
    const { frame } = req.body;

    if (!frame) {
      return res.status(400).json({
        success: false,
        error: 'Video frame required'
      });
    }

    const gestures = await gestureRecognizer.processFrame(frame);

    res.json({
      success: true,
      gestures: gestures,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error in gesture recognition:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/gesture/supported
 * Get list of supported gestures
 */
router.get('/supported', (req, res) => {
  const gestures = gestureRecognizer.getSupportedGestures();

  res.json({
    success: true,
    gestures: gestures,
    count: gestures.length
  });
});

/**
 * PUT /api/gesture/sensitivity
 * Update gesture sensitivity
 */
router.put('/sensitivity', (req, res) => {
  try {
    const { sensitivity } = req.body;

    if (sensitivity === undefined || sensitivity < 0 || sensitivity > 1) {
      return res.status(400).json({
        success: false,
        error: 'Sensitivity must be between 0 and 1'
      });
    }

    gestureRecognizer.setSensitivity(sensitivity);

    res.json({
      success: true,
      message: 'Sensitivity updated',
      sensitivity: sensitivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
