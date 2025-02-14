import Peer from 'peerjs';
import { DEFAULT_PEER_ID, processPeerConfig } from './peerConfig.js';

/**
 * @typedef {import('./peerConfig.js').PeerNetworkConfig} PeerNetworkConfig
 */

/**
 * @typedef {Object} ConnectionState
 * @property {boolean} isConnected - Whether peer is connected
 * @property {number} connectionAttempts - Number of connection attempts
 * @property {number} queuedMessages - Number of messages in queue
 * @property {string} serverState - Current state of the peer server
 */

/**
 * Enhanced peer-to-peer connection handler with improved reliability
 */
export class PeerConnection {
  /**
   * @param {string|PeerNetworkConfig} [networkConfig] - Network configuration or host address
   * @param {string} [peerId] - ID of the peer to connect to
   */
  constructor(networkConfig, peerId) {
    /** @private */
    this.peer = null;
    /** @private */
    this.connection = null;
    /** @private */
    this.targetPeerId = peerId || DEFAULT_PEER_ID;
    /** @private */
    this.config = processPeerConfig(networkConfig);
    /** @private */
    this.isConnected = false;
    /** @private */
    this.messageHandlers = new Map();
    /** @private */
    this.messageQueue = [];
    /** @private */
    this.maxQueueSize = 100;
    /** @private */
    this.connectionAttempts = 0;
    /** @private */
    this.maxConnectionAttempts = 3;
    /** @private */
    this.reconnectDelay = 1000;
    /** @private */
    this.maxReconnectDelay = 5000;
    /** @private */
    this.serverState = 'disconnected';
    /** @private */
    this.lastPingTime = 0;
    /** @private */
    this.pingInterval = null;
    /** @private */
    this.healthCheckInterval = null;
    /** @private */
    this.clientId = this.generateClientId();

    this.initialize();
  }

  /**
   * Generate a consistent client ID
   * @private
   * @returns {string} Client ID
   */
  generateClientId() {
    // Try to get stored client ID
    const storedId = localStorage.getItem('kinectron_client_id');
    if (storedId) {
      return storedId;
    }

    // Generate new ID if none exists
    const newId = `client-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('kinectron_client_id', newId);
    return newId;
  }

  /**
   * Get current connection state
   * @returns {ConnectionState} Current state information
   */
  getState() {
    return {
      isConnected: this.isConnected,
      connectionAttempts: this.connectionAttempts,
      queuedMessages: this.messageQueue.length,
      serverState: this.serverState,
      clientId: this.clientId,
    };
  }

  /**
   * Initialize the peer connection with enhanced reliability
   * @private
   */
  initialize() {
    try {
      if (this.peer) {
        console.warn('Peer already initialized');
        return;
      }

      console.log('Initializing peer with config:', this.config);

      // Create peer instance with consistent ID
      this.peer = new Peer(this.clientId, {
        ...this.config,
        // Basic reliability options
        reliable: true,
        retries: 2,
        timeout: 5000,
        debug: 3,
      });

      this.setupPeerEventHandlers();
      this.startHealthCheck();
    } catch (error) {
      console.error('Peer initialization error:', error);
      this.handleError(error);
    }
  }

  /**
   * Set up event handlers for the peer instance
   * @private
   */
  setupPeerEventHandlers() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is:', id);
      this.connectionAttempts = 0;
      this.serverState = 'connected';
      this.connect();
    });

    this.peer.on('error', (error) => {
      console.error('Peer connection error:', error);
      this.isConnected = false;
      this.serverState = 'error';

      // Handle ID taken error by generating new ID
      if (error.type === 'unavailable-id') {
        console.log('Client ID taken, generating new ID');
        localStorage.removeItem('kinectron_client_id');
        this.clientId = this.generateClientId();
        this._cleanup(false);
        this.initialize();
        return;
      }

      this.handleError(error);

      // Attempt reconnection if appropriate
      if (this.shouldAttemptReconnection(error)) {
        this._handleReconnection(error);
      }
    });

    this.peer.on('disconnected', () => {
      console.log('Peer disconnected from server');
      this.isConnected = false;
      this.serverState = 'disconnected';
      this._handleReconnection({ type: 'disconnected' });
    });
  }

  /**
   * Start health check interval
   * @private
   */
  startHealthCheck() {
    // Clear any existing intervals
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    // Start health check
    this.healthCheckInterval = setInterval(() => {
      if (this.isConnected && this.connection) {
        this.checkConnectionHealth();
      }
    }, 10000);

    // Start ping interval
    this.pingInterval = setInterval(() => {
      if (this.isConnected && this.connection?.open) {
        this.sendPing();
      }
    }, 5000);
  }

  /**
   * Check connection health
   * @private
   */
  async checkConnectionHealth() {
    if (!this.connection?.open) {
      console.warn('Connection appears dead, attempting recovery');
      await this.handleConnectionFailure();
      return;
    }

    // Check last ping time
    const timeSinceLastPing = Date.now() - this.lastPingTime;
    if (timeSinceLastPing > 15000) {
      // No ping response for 15 seconds
      console.warn('No ping response, connection may be dead');
      await this.handleConnectionFailure();
    }
  }

  /**
   * Send ping to peer
   * @private
   */
  sendPing() {
    try {
      this.connection.send({
        event: 'ping',
        data: { timestamp: Date.now() },
      });
    } catch (error) {
      console.error('Failed to send ping:', error);
    }
  }

  /**
   * Handle connection failure
   * @private
   */
  async handleConnectionFailure() {
    this.isConnected = false;
    if (this.connection) {
      try {
        this.connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
      this.connection = null;
    }

    await this._handleReconnection({ type: 'connection_failure' });
  }

  /**
   * Handle errors with enhanced information
   * @private
   * @param {Error} error - The error that occurred
   */
  handleError(error) {
    const handler = this.messageHandlers.get('error');
    if (handler) {
      const errorInfo = {
        status: 'error',
        error: this._getErrorMessage(error),
        details: {
          type: error.type || 'server-error',
          state: this.getState(),
          timestamp: new Date().toISOString(),
        },
      };
      handler(errorInfo);
    }
  }

  /**
   * Get user-friendly error message
   * @private
   * @param {Error} error - The error object
   * @returns {string} User-friendly error message
   */
  _getErrorMessage(error) {
    const errorMessages = {
      network: 'Network error - Could not connect to peer server',
      'invalid-id':
        'Invalid ID - The peer ID is invalid or already taken',
      'unavailable-id':
        'ID Unavailable - The peer ID is already taken',
      'browser-incompatible':
        'Browser Incompatible - WebRTC is not supported',
      'connection-failure':
        'Connection failed - Unable to establish or maintain connection',
      disconnected: 'Disconnected - Lost connection to peer server',
    };

    return (
      errorMessages[error.type] ||
      error.message ||
      'Peer connection error'
    );
  }

  /**
   * Determine if reconnection should be attempted
   * @private
   * @param {Error} error - The error that occurred
   * @returns {boolean} Whether to attempt reconnection
   */
  shouldAttemptReconnection(error) {
    // Don't reconnect for certain error types
    const fatalErrors = [
      'browser-incompatible',
      'invalid-id',
      'invalid-key',
    ];
    if (fatalErrors.includes(error.type)) {
      return false;
    }

    return this.connectionAttempts < this.maxConnectionAttempts;
  }

  /**
   * Set connection timeout with enhanced retry logic
   * @private
   */
  _setConnectionTimeout() {
    const timeoutDuration = 5000; // 5 second timeout

    setTimeout(() => {
      if (!this.isConnected) {
        console.log(
          `Connection attempt ${
            this.connectionAttempts + 1
          } timed out`,
        );

        if (this.connectionAttempts < this.maxConnectionAttempts) {
          this._handleReconnection({ type: 'timeout' });
        } else {
          this.handleError({
            type: 'timeout',
            message: 'Connection timeout - Max attempts reached',
          });
        }
      }
    }, timeoutDuration);
  }

  /**
   * Handle reconnection logic with improved retry strategy
   * @private
   * @param {Error} error - The error that triggered reconnection
   */
  async _handleReconnection(error) {
    // Reset attempts if we haven't tried in a while
    const timeSinceLastAttempt =
      Date.now() - (this._lastReconnectAttempt || 0);
    if (timeSinceLastAttempt > 30000) {
      // 30 seconds
      this.connectionAttempts = 0;
    }

    this.connectionAttempts++;
    this._lastReconnectAttempt = Date.now();

    // Use exponential backoff with jitter
    const baseDelay = Math.min(
      this.reconnectDelay *
        Math.pow(1.5, this.connectionAttempts - 1),
      this.maxReconnectDelay,
    );
    // Add jitter (±20% of base delay)
    const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
    const delay = Math.max(this.reconnectDelay, baseDelay + jitter);

    // Notify about reconnection attempt
    const handler = this.messageHandlers.get('reconnecting');
    if (handler) {
      handler({
        attempt: this.connectionAttempts,
        maxAttempts: this.maxConnectionAttempts,
        delay,
        error: this._getErrorMessage(error),
        nextAttemptIn: delay,
      });
    }

    console.log(
      `Attempting reconnection ${this.connectionAttempts} of ${
        this.maxConnectionAttempts
      } in ${Math.round(delay)}ms`,
    );

    // Wait for delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (!this.isConnected) {
      console.log('Attempting to reconnect...');

      // Clean up existing resources
      await this._cleanup(false);

      // Only try to reconnect if we haven't exceeded max attempts
      if (this.connectionAttempts < this.maxConnectionAttempts) {
        this.initialize();
      } else {
        console.log('Max reconnection attempts reached');
        this.handleError({
          type: 'max_retries',
          message: 'Maximum reconnection attempts reached',
        });
      }
    }
  }

  /**
   * Clean up resources
   * @private
   * @param {boolean} [isClosing=true] - Whether this is a final cleanup
   */
  async _cleanup(isClosing = true) {
    // Clean up existing peer
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    // Clean up existing connection
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    // Clear intervals if doing final cleanup
    if (isClosing) {
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = null;
      }
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }
  }

  /**
   * Connect to target peer with enhanced reliability
   */
  connect() {
    try {
      // Check if we already have a connection
      if (this.peer.connections[this.targetPeerId]?.length > 0) {
        const existingConn =
          this.peer.connections[this.targetPeerId][0];
        if (existingConn.open) {
          console.log('Reusing existing connection');
          this.connection = existingConn;
          this.setupConnectionHandlers();
          return;
        }
      }

      // Create new connection
      console.log('Creating new connection to:', this.targetPeerId);
      this.connection = this.peer.connect(this.targetPeerId, {
        reliable: true,
        serialization: 'json',
        metadata: {
          version: '2.0.0',
          features: ['ping', 'queue'],
          clientId: this.clientId,
        },
      });

      this.setupConnectionHandlers();
      this._setConnectionTimeout();
    } catch (error) {
      console.error('Error establishing connection:', error);
      this._handleReconnection(error);
    }
  }

  /**
   * Set up handlers for the peer connection
   * @private
   */
  setupConnectionHandlers() {
    this.connection.on('open', () => {
      console.log('Connected to peer:', this.targetPeerId);
      this.isConnected = true;
      this.connectionAttempts = 0;
      this.serverState = 'connected';

      // Process any queued messages
      this.processMessageQueue();

      // Emit ready event
      const handler = this.messageHandlers.get('ready');
      if (handler) {
        handler({
          status: 'connected',
          peerId: this.targetPeerId,
          state: this.getState(),
          timestamp: new Date().toISOString(),
        });
      }
    });

    this.connection.on('data', (data) => {
      if (data.event === 'pong') {
        this.lastPingTime = Date.now();
        return;
      }
      console.log('Received data from peer:', data);
      this.handleIncomingData(data);
    });

    this.connection.on('close', () => {
      console.log('Peer connection closed');
      this.isConnected = false;
      this.serverState = 'disconnected';

      if (!this._isClosing) {
        this._handleReconnection({ type: 'connection_closed' });
      }
    });

    this.connection.on('error', (error) => {
      console.error('Data connection error:', error);
      this.isConnected = false;
      this.serverState = 'error';

      this.handleError(error);
      this._handleReconnection(error);
    });
  }

  /**
   * Handle incoming data from peer with enhanced error handling
   * @private
   * @param {Object} data - Data received from peer
   * @param {string} data.event - Event type
   * @param {*} data.data - Event data
   */
  handleIncomingData(data) {
    try {
      const handler = this.messageHandlers.get(data.event);
      if (handler) {
        handler({
          ...data.data,
          timestamp: Date.now(),
          state: this.getState(),
        });
      }
    } catch (error) {
      console.error('Error handling incoming data:', error);
      this.handleError({
        type: 'data_handling_error',
        message: 'Error processing received data',
        originalError: error,
      });
    }
  }

  /**
   * Process queued messages
   * @private
   */
  async processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      try {
        await this.send(message.event, message.data);
      } catch (error) {
        console.error('Failed to send queued message:', error);
        // Re-queue message if connection is still open
        if (
          this.isConnected &&
          this.messageQueue.length < this.maxQueueSize
        ) {
          this.messageQueue.push(message);
        }
      }
    }
  }

  /**
   * Register a handler for a specific event type with validation
   * @param {string} event - Event type to handle
   * @param {Function} handler - Handler function for the event
   */
  on(event, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function');
    }
    this.messageHandlers.set(event, handler);
  }

  /**
   * Send data to peer with enhanced reliability
   * @param {string} event - Event type
   * @param {*} data - Data to send
   * @returns {Promise<void>}
   */
  async send(event, data) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected || !this.connection?.open) {
        // Queue message if not connected
        if (this.messageQueue.length < this.maxQueueSize) {
          this.messageQueue.push({ event, data });
          resolve(); // Resolve since message was queued
        } else {
          reject(new Error('Message queue full'));
        }
        return;
      }

      try {
        const message = {
          event,
          data,
          timestamp: Date.now(),
        };

        const timeout = setTimeout(() => {
          reject(new Error('Send timeout'));
        }, 5000);

        this.connection.send(message);
        clearTimeout(timeout);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Close the peer connection with graceful shutdown
   */
  async close() {
    this._isClosing = true;

    // Send shutdown message if possible
    if (this.connection?.open) {
      try {
        await this.send('shutdown', { reason: 'client_close' });
      } catch (error) {
        console.error('Error sending shutdown message:', error);
      }
    }

    // Clean up resources
    await this._cleanup(true);

    // Clear state
    this.isConnected = false;
    this.serverState = 'closed';
    this.messageQueue = [];
    this.connectionAttempts = 0;
    this._lastReconnectAttempt = 0;
    this._isClosing = false;
  }

  /**
   * Check if peer is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.isConnected && this.connection?.open;
  }
}
