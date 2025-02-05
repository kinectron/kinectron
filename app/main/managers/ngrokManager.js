// main/managers/ngrokManager.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const ngrok = require('ngrok');

export class NgrokManager {
  constructor() {
    this.url = null;
    this.isConnected = false;
  }

  /**
   * Start ngrok tunnel with the provided auth token
   * @param {string} authToken - ngrok auth token
   * @returns {Promise<string>} The public URL
   */
  async connect(authToken) {
    try {
      if (!authToken) {
        throw new Error('Auth token is required');
      }

      // If already connected, disconnect first
      if (this.isConnected) {
        await this.disconnect();
      }

      // Connect to ngrok
      this.url = await ngrok.connect({
        addr: 9001, // Peer server port
        authtoken: authToken,
        proto: 'http',
      });

      this.isConnected = true;
      console.log('Ngrok tunnel established:', this.url);

      return this.url;
    } catch (error) {
      console.error('Failed to establish ngrok tunnel:', error);
      throw error;
    }
  }

  /**
   * Stop the ngrok tunnel
   */
  async disconnect() {
    try {
      if (this.isConnected) {
        await ngrok.disconnect();
        await ngrok.kill();
        this.url = null;
        this.isConnected = false;
        console.log('Ngrok tunnel closed');
      }
    } catch (error) {
      console.error('Error disconnecting ngrok:', error);
      throw error;
    }
  }

  /**
   * Get current ngrok connection status
   * @returns {Object} Connection status and URL
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      url: this.url,
    };
  }

  /**
   * Clean up ngrok connection
   */
  async cleanup() {
    await this.disconnect();
  }
}
