import Peer from 'peerjs';
import { DEFAULT_PEER_ID, processPeerConfig } from './peerConfig.js';
import { NgrokClientState, NgrokClientError } from './ngrokState.js';
import { DEBUG } from '../utils/debug.js';

/**
 * @typedef {import('./peerConfig.js').PeerNetworkConfig} PeerNetworkConfig
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
    this.messageHandlers = new Map();
    /** @private */
    this.messageQueue = [];
    /** @private */
    this.maxQueueSize = 100;
    /** @private */
    this.lastPingTime = 0;
    /** @private */
    this.pingInterval = null;
    /** @private */
    this.healthCheckInterval = null;
    /** @private */
    this.clientId = this.generateClientId();
    /** @private */
    this.state = new NgrokClientState();

    // Forward state events to message handlers
    this.state.on('stateChange', (data) => {
      const handler = this.messageHandlers.get('stateChange');
      if (handler) handler(data);
    });

    this.state.on('error', (data) => {
      const handler = this.messageHandlers.get('error');
      if (handler) handler(data);
    });

    this.state.on('metrics', (data) => {
      const handler = this.messageHandlers.get('metrics');
      if (handler) handler(data);
    });

    this.initialize();
  }

  /**
   * Generate a consistent client ID
   * @private
   * @returns {string} Client ID
   */
  generateClientId() {
    // Generate unique ID for each instance
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const prefix = this.config.host?.includes('ngrok')
      ? 'ngrok'
      : 'local';
    const role = this.config.role || 'default';
    return `${prefix}-${role}-${timestamp}-${random}`;
  }

  /**
   * Get current connection state
   * @returns {Object} Current state information
   */
  getState() {
    return this.state.getMetadata();
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

      if (DEBUG.PEER) {
        console.log('Initializing peer with config:', this.config);
      }

      // Check if this is an ngrok connection
      const isNgrok =
        typeof this.config.host === 'string' &&
        this.config.host.includes('ngrok');

      if (isNgrok) {
        // Set state to validating for ngrok connections
        this.state.setState(NgrokClientState.STATES.VALIDATING);

        // Validate ngrok URL format
        if (!this.config.host.includes('ngrok-free.app')) {
          throw new NgrokClientError('Invalid ngrok URL format', {
            url: this.config.host,
            reason: 'URL must include ngrok-free.app domain',
          });
        }
      }

      // Create peer instance with consistent ID
      this.peer = new Peer(this.clientId, {
        ...this.config,
        // Basic reliability options
        reliable: true,
        retries: 2,
        timeout: isNgrok ? 5000 : 3000,
        debug: 0, // Reduced from 3 to 0 to suppress verbose logs
      });

      // Move to connecting state (skip validation for local connections)
      if (!isNgrok) {
        this.state.setState(NgrokClientState.STATES.CONNECTING);
      }

      this.setupPeerEventHandlers();
      this.startHealthCheck();
    } catch (error) {
      console.error('Peer initialization error:', error);
      this.handleError(error);
      this.state.setState(NgrokClientState.STATES.ERROR, {
        error: error.message,
        context: 'initialization',
      });
    }
  }

  /**
   * Set up event handlers for the peer instance
   * @private
   */
  setupPeerEventHandlers() {
    this.peer.on('open', (id) => {
      if (DEBUG.PEER) {
        console.log('My peer ID is:', id);
      }
      // Already in CONNECTING state, proceed with connection
      this.connect();
    });

    this.peer.on('error', (error) => {
      console.error('Peer connection error:', error);

      // Handle ID taken error by generating new ID
      if (error.type === 'unavailable-id') {
        if (DEBUG.PEER) {
          console.log('Client ID taken, generating new ID');
        }
        this.clientId = this.generateClientId();
        this._cleanup(false);
        this.initialize();
        return;
      }

      this.handleError(error);

      // Set error state
      this.state.setState(NgrokClientState.STATES.ERROR, {
        error: error.message,
        type: error.type,
      });

      // Attempt reconnection if appropriate
      if (this.shouldAttemptReconnection(error)) {
        this._handleReconnection(error);
      }
    });

    this.peer.on('disconnected', () => {
      if (DEBUG.PEER) {
        console.log('Peer disconnected from server');
      }
      this.state.setState(NgrokClientState.STATES.DISCONNECTED, {
        reason: 'peer_disconnected',
      });
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
      if (
        this.state.getState() === NgrokClientState.STATES.CONNECTED &&
        this.connection
      ) {
        this.checkConnectionHealth();
      }
    }, 10000);

    // Start ping interval
    this.pingInterval = setInterval(() => {
      if (
        this.state.getState() === NgrokClientState.STATES.CONNECTED &&
        this.connection?.open
      ) {
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

    // Update connection metrics
    this.state.updateMetrics({
      latency: timeSinceLastPing,
      timestamp: new Date(),
    });
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
    if (this.connection) {
      try {
        this.connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
      this.connection = null;
    }

    this.state.setState(NgrokClientState.STATES.RECONNECTING, {
      reason: 'connection_failure',
      timestamp: new Date(),
    });

    await this._handleReconnection({ type: 'connection_failure' });
  }

  /**
   * Handle errors with enhanced information
   * @private
   * @param {Error} error - The error that occurred
   */
  handleError(error) {
    // Record error in state
    this.state.recordError(error, {
      type: error.type || 'server-error',
      state: this.state.getState(),
      timestamp: new Date().toISOString(),
    });

    // Forward to message handler
    const handler = this.messageHandlers.get('error');
    if (handler) {
      const errorInfo = {
        status: 'error',
        error: this._getErrorMessage(error),
        details: {
          type: error.type || 'server-error',
          state: this.state.getState(),
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

    return this.state.getMetadata().metrics.reconnects.count < 3;
  }

  /**
   * Set connection timeout with enhanced retry logic
   * @private
   */
  _setConnectionTimeout() {
    const timeoutDuration = 15000; // 15 second timeout for ngrok connections

    setTimeout(() => {
      if (
        this.state.getState() !== NgrokClientState.STATES.CONNECTED
      ) {
        if (DEBUG.PEER) {
          console.log('Connection attempt timed out');
        }

        if (this.shouldAttemptReconnection({ type: 'timeout' })) {
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
    // Update state to reconnecting
    this.state.setState(NgrokClientState.STATES.RECONNECTING, {
      error: error.message,
      attempt: this.state.getMetadata().metrics.reconnects.count + 1,
    });

    // Use exponential backoff with jitter
    const baseDelay = Math.min(
      2000 *
        Math.pow(
          1.5,
          this.state.getMetadata().metrics.reconnects.count,
        ),
      15000,
    );
    const jitter = baseDelay * 0.2 * (Math.random() * 2 - 1);
    const delay = Math.max(2000, baseDelay + jitter);

    if (DEBUG.PEER) {
      console.log(
        `Attempting reconnection ${
          this.state.getMetadata().metrics.reconnects.count + 1
        } of 3 in ${Math.round(delay)}ms`,
      );
    }

    // Wait for delay
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (
      this.state.getState() === NgrokClientState.STATES.RECONNECTING
    ) {
      if (DEBUG.PEER) {
        console.log('Attempting to reconnect...');
      }

      // Clean up existing resources
      await this._cleanup(false);

      // Only try to reconnect if we haven't exceeded max attempts
      if (this.shouldAttemptReconnection(error)) {
        // Move back to connecting state
        this.state.setState(NgrokClientState.STATES.CONNECTING);
        this.initialize();
      } else {
        if (DEBUG.PEER) {
          console.log('Max reconnection attempts reached');
        }
        this.state.setState(NgrokClientState.STATES.ERROR, {
          error: 'Maximum reconnection attempts reached',
          type: 'max_retries',
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
          if (DEBUG.PEER) {
            console.log('Reusing existing connection');
          }
          this.connection = existingConn;
          this.setupConnectionHandlers();
          return;
        }
      }

      // Create new connection
      if (DEBUG.PEER) {
        console.log('Creating new connection to:', this.targetPeerId);
      }
      this.connection = this.peer.connect(this.targetPeerId, {
        reliable: true,
        serialization: 'binary', // Explicitly set to binary
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
      if (DEBUG.PEER) {
        console.log('Connected to peer:', this.targetPeerId);
      }

      // Update state
      this.state.setState(NgrokClientState.STATES.CONNECTED, {
        peerId: this.targetPeerId,
        timestamp: new Date(),
      });

      // Process any queued messages
      this.processMessageQueue();

      // Emit ready event
      const handler = this.messageHandlers.get('ready');
      if (handler) {
        handler({
          status: 'connected',
          peerId: this.targetPeerId,
          state: this.state.getState(),
          timestamp: new Date().toISOString(),
        });
      }
    });

    this.connection.on('data', (data) => {
      if (data.event === 'pong') {
        this.lastPingTime = Date.now();
        // Update latency metrics
        const latency = Date.now() - data.data.timestamp;
        this.state.updateMetrics({ latency });
        return;
      }
      if (DEBUG.PEER) {
        console.log('Received data from peer:', data);
      }
      this.handleIncomingData(data);
    });

    this.connection.on('close', () => {
      if (DEBUG.PEER) {
        console.log('Peer connection closed');
      }

      if (!this._isClosing) {
        this.state.setState(NgrokClientState.STATES.DISCONNECTED, {
          reason: 'connection_closed',
        });
        this._handleReconnection({ type: 'connection_closed' });
      }
    });

    this.connection.on('error', (error) => {
      console.error('Data connection error:', error);

      this.state.setState(NgrokClientState.STATES.ERROR, {
        error: error.message,
        type: error.type,
      });

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
      if (DEBUG.PEER) {
        console.log(
          'PeerConnection: Received event:',
          data.event,
          'with data:',
          data.data,
        );
      }

      // First, try to find a specific handler for this event
      const handler = this.messageHandlers.get(data.event);

      if (handler) {
        if (DEBUG.PEER) {
          console.log(
            'PeerConnection: Found specific handler for event:',
            data.event,
          );
        }
        handler({
          ...data.data,
          timestamp: Date.now(),
          state: this.state.getState(),
        });
      } else {
        if (DEBUG.PEER) {
          console.log(
            'PeerConnection: No specific handler for event:',
            data.event,
            'forwarding to data handler',
          );
        }
        // If no specific handler is found, forward the event to the data handler
        // This ensures all events are forwarded to the Kinectron class
        const dataHandler = this.messageHandlers.get('data');

        // if (data.event === 'bodyFrame') debugger;

        if (dataHandler) {
          dataHandler(data);
        } else {
          console.warn(
            'PeerConnection: No data handler found for event:',
            data.event,
          );
        }
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
    while (
      this.messageQueue.length > 0 &&
      this.state.getState() === NgrokClientState.STATES.CONNECTED
    ) {
      const message = this.messageQueue.shift();
      try {
        await this.send(message.event, message.data);
      } catch (error) {
        console.error('Failed to send queued message:', error);
        // Re-queue message if connection is still open
        if (
          this.state.getState() ===
            NgrokClientState.STATES.CONNECTED &&
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
      if (
        this.state.getState() !== NgrokClientState.STATES.CONNECTED ||
        !this.connection?.open
      ) {
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

    // Reset state
    this.state.reset();
    this.messageQueue = [];
    this._isClosing = false;
  }

  /**
   * Check if peer is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return (
      this.state.getState() === NgrokClientState.STATES.CONNECTED &&
      this.connection?.open
    );
  }
}
