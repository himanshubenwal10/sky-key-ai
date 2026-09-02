/**
 * App Automation Module
 * Controls phone apps and system functions
 */

const axios = require('axios');
const uuid = require('uuid');

class AppAutomation {
  constructor(config = {}) {
    this.whitelist = config.whitelist || [
      'camera', 'gallery', 'contacts', 'settings',
      'maps', 'messages', 'phone', 'clock'
    ];
    this.enableSystemControl = config.enableSystemControl || true;
    this.sessionId = uuid.v4();
    this.appHistory = [];
    this.maxHistorySize = 50;
  }

  /**
   * Launch an application
   */
  async launchApp(appName) {
    console.log(`🚀 Launching app: ${appName}`);

    const normalizedName = appName.toLowerCase().trim();

    if (!this.isAppWhitelisted(normalizedName)) {
      console.warn(`⚠️ App not whitelisted: ${appName}`);
      return { success: false, error: 'App not whitelisted' };
    }

    try {
      const result = await this.executeAppCommand('launch', {
        app: normalizedName,
        timestamp: Date.now()
      });

      if (result.success) {
        this.addToHistory('launch', appName);
      }

      return result;
    } catch (error) {
      console.error('Error launching app:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Close an application
   */
  async closeApp(appName) {
    console.log(`❌ Closing app: ${appName}`);

    const normalizedName = appName.toLowerCase().trim();

    try {
      const result = await this.executeAppCommand('close', {
        app: normalizedName
      });

      if (result.success) {
        this.addToHistory('close', appName);
      }

      return result;
    } catch (error) {
      console.error('Error closing app:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send app-specific command
   */
  async sendAppCommand(appName, action, params = {}) {
    console.log(`📤 Sending command to ${appName}:`, action);

    const normalizedName = appName.toLowerCase().trim();

    if (!this.isAppWhitelisted(normalizedName)) {
      return { success: false, error: 'App not whitelisted' };
    }

    try {
      const result = await this.executeAppCommand('action', {
        app: normalizedName,
        action: action,
        params: params
      });

      this.addToHistory('action', `${appName}:${action}`);
      return result;
    } catch (error) {
      console.error('Error sending app command:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Capture screenshot
   */
  async captureScreenshot() {
    console.log('📸 Capturing screenshot...');

    try {
      const result = await this.executeSystemCommand('screenshot', {});
      if (result.success) {
        this.addToHistory('screenshot', 'system');
      }
      return result;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Control volume
   */
  async setVolume(level) {
    console.log(`🔊 Setting volume to: ${level}%`);

    if (level < 0 || level > 100) {
      return { success: false, error: 'Volume must be between 0 and 100' };
    }

    try {
      const result = await this.executeSystemCommand('volume', {
        level: level
      });
      this.addToHistory('volume', level);
      return result;
    } catch (error) {
      console.error('Error setting volume:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Lock/Unlock screen
   */
  async toggleLock() {
    console.log('🔒 Toggling screen lock...');

    try {
      const result = await this.executeSystemCommand('lock', {});
      this.addToHistory('lock', 'toggle');
      return result;
    } catch (error) {
      console.error('Error toggling lock:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get list of available apps
   */
  async getAvailableApps() {
    console.log('📱 Fetching available apps...');

    try {
      const response = await axios.get('/api/apps/list', {
        params: { whitelist: true }
      });

      return {
        success: true,
        apps: response.data.apps,
        count: response.data.count
      };
    } catch (error) {
      console.error('Error fetching apps:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Execute system command
   */
  async executeSystemCommand(command, params) {
    try {
      const response = await axios.post('/api/apps/execute', {
        sessionId: this.sessionId,
        command: command,
        params: params,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Execute app command
   */
  async executeAppCommand(action, params) {
    return this.executeSystemCommand('app_action', {
      action: action,
      ...params
    });
  }

  /**
   * Check if app is whitelisted
   */
  isAppWhitelisted(appName) {
    return this.whitelist.includes(appName.toLowerCase());
  }

  /**
   * Add command to history
   */
  addToHistory(action, app) {
    this.appHistory.push({
      action: action,
      app: app,
      timestamp: Date.now()
    });

    if (this.appHistory.length > this.maxHistorySize) {
      this.appHistory.shift();
    }
  }

  /**
   * Get command history
   */
  getHistory(limit = 10) {
    return this.appHistory.slice(-limit).reverse();
  }

  /**
   * Clear command history
   */
  clearHistory() {
    this.appHistory = [];
  }
}

module.exports = AppAutomation;
