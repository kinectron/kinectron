// main/managers/ngrokManager.js
import { createRequire } from 'module';
import { NgrokState, NgrokStateError } from './ngrokState.js';

const require = createRequire(import.meta.url);
const ngrok = require('ngrok');

export class NgrokManager {
  constructor() {
    this.state = new NgrokState();
    this.healthCheckInterval = null;
    this.startHealthCheck();
  }

  /**
   * Start periodic health checks
   * @private
   */
  startHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      if (this.state.getState() === NgrokState.STATES.CONNECTED) {
        try {
          const status = await this._checkTunnelHealth();
          this.state.recordHealthCheck(status);
        } catch (error) {
          this.state.recordError(error, { context: 'health_check' });
          if (error.message.includes('tunnel not found')) {
            await this._handleTunnelLost();
          }
        }
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check tunnel health
   * @private
   * @returns {Promise<Object>} Health status
   */
  async _checkTunnelHealth() {
    const tunnelUrl = this.state.metadata.url;
    if (!tunnelUrl) {
      throw new Error('No active tunnel URL');
    }

    try {
      const response = await fetch(tunnelUrl);
      return {
        status: response.status,
        latency: response.headers.get('x-response-time'),
        timestamp: new Date(),
      };
    } catch (error) {
      throw new Error(`Tunnel health check failed: ${error.message}`);
    }
  }

  /**
   * Handle lost tunnel connection
   * @private
   */
  async _handleTunnelLost() {
    console.warn('Ngrok tunnel appears to be lost');
    await this.disconnect();
    this.state.setState(NgrokState.STATES.ERROR, {
      reason: 'tunnel_lost',
      message: 'Ngrok tunnel connection was lost',
    });
  }

  /**
   * Start ngrok tunnel with the provided auth token
   * @param {string} authToken - ngrok auth token
   * @returns {Promise<string>} The public URL
   */
  async connect(authToken) {
    try {
      if (!authToken) {
        throw new NgrokStateError('Auth token is required', {
          code: 'AUTH_REQUIRED',
        });
      }

      // Set state to initializing
      this.state.setState(NgrokState.STATES.INITIALIZING);

      // If already connected, disconnect first
      if (this.state.getState() === NgrokState.STATES.CONNECTED) {
        await this.disconnect();
      }

      // Set state to connecting
      this.state.setState(NgrokState.STATES.CONNECTING);

      // Connect to ngrok
      const tunnelConfig = {
        addr: 9001, // Peer server port
        authtoken: authToken,
        proto: 'http',
      };

      const url = await ngrok.connect(tunnelConfig);

      // Update state and metadata
      this.state.setTunnelConfig(tunnelConfig);
      this.state.metadata.url = url;
      this.state.setState(NgrokState.STATES.CONNECTED, {
        url,
        timestamp: new Date(),
      });

      console.log('Ngrok tunnel established:', url);
      return url;
    } catch (error) {
      console.error('Failed to establish ngrok tunnel:', error);
      this.state.recordError(error, { context: 'connect' });
      this.state.setState(NgrokState.STATES.ERROR, {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Stop the ngrok tunnel
   */
  async disconnect() {
    try {
      const currentState = this.state.getState();
      if (currentState === NgrokState.STATES.CONNECTED) {
        await ngrok.disconnect();
        await ngrok.kill();

        // Update state
        this.state.setState(NgrokState.STATES.DISCONNECTED, {
          reason: 'user_requested',
          timestamp: new Date(),
        });

        console.log('Ngrok tunnel closed');
      }
    } catch (error) {
      console.error('Error disconnecting ngrok:', error);
      this.state.recordError(error, { context: 'disconnect' });
      throw error;
    }
  }

  /**
   * Get current ngrok connection status
   * @returns {Object} Connection status and URL
   */
  getStatus() {
    const metadata = this.state.getMetadata();
    return {
      state: this.state.getState(),
      isConnected:
        this.state.getState() === NgrokState.STATES.CONNECTED,
      url: metadata.url,
      uptime: metadata.uptime,
      lastHealthCheck: metadata.metrics.lastHealthCheck,
      errors: {
        total: metadata.metrics.errors.total,
        recent: this.state.getErrorHistory()[0],
      },
    };
  }

  /**
   * Clean up ngrok connection
   */
  async cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    await this.disconnect();
    this.state.reset();
  }
}
