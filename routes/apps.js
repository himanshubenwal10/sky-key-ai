/**
 * App Control API Routes
 */

const express = require('express');
const router = express.Router();

// Initialize app automation
const AppAutomation = require('../modules/app-automation');
const appAutomation = new AppAutomation();

/**
 * POST /api/apps/launch
 * Launch an application
 */
router.post('/launch', async (req, res) => {
  try {
    const { app } = req.body;

    if (!app) {
      return res.status(400).json({
        success: false,
        error: 'App name required'
      });
    }

    const result = await appAutomation.launchApp(app);

    res.json(result);
  } catch (error) {
    console.error('Error launching app:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/apps/close
 * Close an application
 */
router.post('/close', async (req, res) => {
  try {
    const { app } = req.body;

    if (!app) {
      return res.status(400).json({
        success: false,
        error: 'App name required'
      });
    }

    const result = await appAutomation.closeApp(app);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/apps/list
 * Get list of available apps
 */
router.get('/list', async (req, res) => {
  try {
    const result = await appAutomation.getAvailableApps();

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/apps/execute
 * Execute app command
 */
router.post('/execute', async (req, res) => {
  try {
    const { app, action, params } = req.body;

    if (!app || !action) {
      return res.status(400).json({
        success: false,
        error: 'App name and action required'
      });
    }

    const result = await appAutomation.sendAppCommand(app, action, params);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/apps/history
 * Get command history
 */
router.get('/history', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const history = appAutomation.getHistory(parseInt(limit));

    res.json({
      success: true,
      history: history,
      count: history.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
