/**
 * Voice Processing API Routes
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Initialize voice processor
const VoiceProcessor = require('../modules/voice-processor');
const voiceProcessor = new VoiceProcessor();

/**
 * POST /api/voice/process
 * Process voice command
 */
router.post('/process', async (req, res) => {
  try {
    const { audio, language } = req.body;

    if (!audio) {
      return res.status(400).json({
        success: false,
        error: 'Audio data required'
      });
    }

    if (language) {
      voiceProcessor.setLanguage(language);
    }

    const result = await voiceProcessor.processCommand(audio);

    res.json({
      success: true,
      result: result,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error processing voice:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/voice/parse
 * Parse command and extract intent
 */
router.post('/parse', async (req, res) => {
  try {
    const { text, language } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text required'
      });
    }

    // TODO: Integrate with NLP service (e.g., Google Cloud NLP, OpenAI)
    // For now, returning placeholder response
    const intent = extractIntent(text);
    const entities = extractEntities(text);

    res.json({
      success: true,
      intent: intent,
      entities: entities,
      confidence: 0.85,
      language: language || 'en-US'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/voice/languages
 * Get supported languages
 */
router.get('/languages', (req, res) => {
  const languages = voiceProcessor.getSupportedLanguages();

  res.json({
    success: true,
    languages: languages,
    count: languages.length
  });
});

/**
 * PUT /api/voice/language
 * Set current language
 */
router.put('/language', (req, res) => {
  try {
    const { language } = req.body;

    if (!language) {
      return res.status(400).json({
        success: false,
        error: 'Language code required'
      });
    }

    const success = voiceProcessor.setLanguage(language);

    if (success) {
      res.json({
        success: true,
        message: 'Language updated',
        language: language
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Unsupported language'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Helper: Extract intent from text
 */
function extractIntent(text) {
  const textLower = text.toLowerCase();

  if (textLower.includes('open')) return 'open_app';
  if (textLower.includes('close')) return 'close_app';
  if (textLower.includes('call')) return 'make_call';
  if (textLower.includes('message') || textLower.includes('send')) return 'send_message';
  if (textLower.includes('take') && textLower.includes('photo')) return 'take_photo';
  if (textLower.includes('screenshot')) return 'capture_screen';
  if (textLower.includes('volume')) return 'adjust_volume';
  if (textLower.includes('lock')) return 'lock_screen';

  return 'unknown';
}

/**
 * Helper: Extract entities from text
 */
function extractEntities(text) {
  const entities = [];
  // TODO: Implement entity extraction
  return entities;
}

module.exports = router;
