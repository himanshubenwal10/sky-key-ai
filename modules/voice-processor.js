/**
 * Voice Processor Module
 * Handles speech recognition and command processing
 */

const WebSpeechAPI = require('web-speech-api');
const axios = require('axios');

class VoiceProcessor {
  constructor(config = {}) {
    this.languages = config.languages || ['en-US', 'hi-IN', 'es-ES', 'fr-FR'];
    this.currentLanguage = config.defaultLanguage || 'en-US';
    this.isListening = false;
    this.confidenceThreshold = config.confidenceThreshold || 0.5;
    this.commandKeyword = config.commandKeyword || 'sky key';
  }

  /**
   * Initialize voice recognition
   */
  async initialize() {
    console.log('🎤 Initializing Voice Processor...');
    try {
      // Initialize Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.language = this.currentLanguage;

      this.setupEventListeners();
      console.log('✅ Voice Processor initialized');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize voice processor:', error);
      return false;
    }
  }

  /**
   * Setup event listeners for speech recognition
   */
  setupEventListeners() {
    this.recognition.onstart = () => {
      console.log('🎙️ Listening...');
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        isFinal = event.results[i].isFinal;
      }

      if (isFinal) {
        this.processCommand(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      console.log('🔇 Stopped listening');
      this.isListening = false;
    };
  }

  /**
   * Start listening for voice commands
   */
  startListening() {
    if (!this.isListening) {
      console.log('▶️ Starting voice recognition...');
      this.recognition.start();
    }
  }

  /**
   * Stop listening for voice commands
   */
  stopListening() {
    if (this.isListening) {
      console.log('⏹️ Stopping voice recognition...');
      this.recognition.stop();
    }
  }

  /**
   * Process voice command
   */
  async processCommand(transcript) {
    console.log('📝 Transcript:', transcript);

    const lowerTranscript = transcript.toLowerCase();

    // Check if command keyword is present
    if (lowerTranscript.includes(this.commandKeyword)) {
      const command = lowerTranscript.replace(this.commandKeyword, '').trim();
      
      try {
        const result = await this.parseCommand(command);
        return result;
      } catch (error) {
        console.error('Error processing command:', error);
        return null;
      }
    }
  }

  /**
   * Parse and extract intent from command
   */
  async parseCommand(command) {
    console.log('🔍 Parsing command:', command);

    // Send to NLP service for intent extraction
    try {
      const response = await axios.post('/api/voice/parse', {
        text: command,
        language: this.currentLanguage
      });

      const intent = response.data.intent;
      const entities = response.data.entities;
      const confidence = response.data.confidence;

      if (confidence >= this.confidenceThreshold) {
        return {
          intent: intent,
          entities: entities,
          confidence: confidence,
          timestamp: Date.now(),
          language: this.currentLanguage
        };
      }
    } catch (error) {
      console.error('Error parsing command:', error);
    }

    return null;
  }

  /**
   * Set language for recognition
   */
  setLanguage(languageCode) {
    if (this.languages.includes(languageCode)) {
      this.currentLanguage = languageCode;
      this.recognition.language = languageCode;
      console.log(`🌍 Language changed to: ${languageCode}`);
      return true;
    }
    return false;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages() {
    return this.languages;
  }

  /**
   * Text-to-speech synthesis
   */
  async speak(text, options = {}) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    return new Promise((resolve) => {
      utterance.onend = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }
}

module.exports = VoiceProcessor;
