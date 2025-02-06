import Peer from 'peerjs';
import { DEFAULT_PEER_ID, processPeerConfig } from './peerConfig.js';

/**
 * @typedef {import('./peerConfig.js').PeerNetworkConfig} PeerNetworkConfig
 */

/**
 * Handles peer-to-peer connection functionality
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

    this.initialize();
  }

  /**
   * Initialize the peer connection
   * @private
   */
  initialize() {
    try {
      console.log('Initializing peer with config:', this.config);

      // Create new peer instance with random ID
      this.peer = new Peer(null, this.config);

      // Track connection attempts
      this.connectionAttempts = 0;
      this.maxConnectionAttempts = 10;
      this.reconnectDelay = 1000; // Start with 1 second delay

      this.peer.on('open', (id) => {
        console.log('My peer ID is:', id);
        this.connectionAttempts = 0; // Reset connection attempts on successful connection
        this.connect();
      });

      this.peer.on('error', (error) => {
        console.error('Peer connection error:', error);
        this.isConnected = false;

        // Emit error event with more detailed message
        const handler = this.messageHandlers.get('error');
        if (handler) {
          const errorInfo = {
            status: 'error',
            error: this._getErrorMessage(error),
            details: {
              type: error.type || 'server-error',
            },
            timestamp: new Date().toISOString(),
          };
          handler(errorInfo);
        }

        // Only attempt reconnection if we haven't exceeded max attempts
        if (this.connectionAttempts < this.maxConnectionAttempts) {
          this._handleReconnection(error);
        } else {
          console.log(
            'Max connection attempts reached, stopping reconnection attempts',
          );
        }
      });

      // Set initial connection timeout
      this._setConnectionTimeout();
    } catch (error) {
      console.error('Peer initialization error:', error);
      const handler = this.messageHandlers.get('error');
      if (handler) {
        handler({
          message: 'Failed to initialize peer connection',
          details: error,
        });
      }
    }
  }

  /**
   * Get user-friendly error message
   * @private
   * @param {Error} error - The error object
   * @returns {string} User-friendly error message
   */
  _getErrorMessage(error) {
    if (error.type === 'network') {
      return 'Network error - Could not connect to peer server';
    } else if (error.type === 'invalid-id') {
      return 'Invalid ID - The peer ID is invalid or already taken';
    } else if (error.type === 'unavailable-id') {
      return 'ID Unavailable - The peer ID is already taken';
    } else if (error.type === 'browser-incompatible') {
      return 'Browser Incompatible - WebRTC is not supported';
    }
    return error.message || 'Peer connection error';
  }

  /**
   * Connect to the target peer
   * @private
   */
  /**
   * Set connection timeout with retry logic
   * @private
   */
  _setConnectionTimeout() {
    const timeoutDuration = 5000; // 5 second timeout

    setTimeout(() => {
      if (!this.isConnected) {
        if (this.connectionAttempts < this.maxConnectionAttempts) {
          console.log(
            `Connection attempt ${
              this.connectionAttempts + 1
            } timed out`,
          );
          this._handleReconnection({ type: 'timeout' });
        } else {
          const handler = this.messageHandlers.get('error');
          if (handler) {
            const errorInfo = {
              status: 'error',
              error: 'Connection timeout - Max attempts reached',
              details: { type: 'timeout' },
              timestamp: new Date().toISOString(),
            };
            handler(errorInfo);
          }
        }
      }
    }, timeoutDuration);
  }

  /**
   * Handle reconnection logic
   * @private
   * @param {Error} error - The error that triggered reconnection
   */
  _handleReconnection(error) {
    this.connectionAttempts++;
    const delay = Math.min(
      this.reconnectDelay * this.connectionAttempts,
      5000,
    ); // Cap at 5 seconds

    console.log(
      `Attempting reconnection ${this.connectionAttempts} of ${this.maxConnectionAttempts} in ${delay}ms`,
    );

    setTimeout(() => {
      if (!this.isConnected) {
        console.log('Attempting to reconnect...');
        if (this.peer) {
          this.peer.destroy();
        }
        this.initialize();
      }
    }, delay);
  }

  connect() {
    try {
      this.connection = this.peer.connect(this.targetPeerId, {
        reliable: true,
        serialization: 'json',
      });

      this.connection.on('open', () => {
        console.log('Connected to peer:', this.targetPeerId);
        this.isConnected = true;
        this.connectionAttempts = 0; // Reset connection attempts on successful connection

        // Emit ready event when connection is established
        const handler = this.messageHandlers.get('ready');
        if (handler) {
          handler({
            status: 'connected',
            peerId: this.targetPeerId,
            timestamp: new Date().toISOString(),
          });
        }
      });

      this.connection.on('data', (data) => {
        console.log('Received data from peer:', data);
        this.handleIncomingData(data);
      });

      this.connection.on('close', () => {
        console.log('Peer connection closed');
        this.isConnected = false;

        // Attempt to reconnect if not explicitly closed
        if (!this._isClosing) {
          this._handleReconnection({ type: 'connection_closed' });
        }
      });

      this.connection.on('error', (error) => {
        console.error('Data connection error:', error);
        this.isConnected = false;

        // Emit error event
        const handler = this.messageHandlers.get('error');
        if (handler) {
          handler({
            message: error.message || 'Data connection error',
            details: error,
          });
        }

        // Attempt to reconnect
        this._handleReconnection(error);
      });
    } catch (error) {
      console.error('Error establishing connection:', error);
      this._handleReconnection(error);
    }
  }

  /**
   * Handle incoming data from peer
   * @private
   * @param {Object} data - Data received from peer
   * @param {string} data.event - Event type
   * @param {*} data.data - Event data
   */
  handleIncomingData(data) {
    const handler = this.messageHandlers.get(data.event);
    if (handler) {
      handler(data.data);
    }
  }

  /**
   * Register a handler for a specific event type
   * @param {string} event - Event type to handle
   * @param {Function} handler - Handler function for the event
   */
  on(event, handler) {
    this.messageHandlers.set(event, handler);
  }

  /**
   * Send data to peer
   * @param {string} event - Event type
   * @param {*} data - Data to send
   */
  send(event, data) {
    if (!this.isConnected) {
      console.warn(
        'Cannot send data: peer connection not established',
      );
      return;
    }

    this.connection.send({
      event,
      data,
    });
  }

  /**
   * Close the peer connection
   */
  close() {
    this._isClosing = true; // Flag to prevent reconnection attempts
    if (this.connection) {
      this.connection.close();
    }
    if (this.peer) {
      this.peer.destroy();
    }
    this.isConnected = false;
    this._isClosing = false;
  }

  /**
   * Check if peer is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.isConnected;
  }
}
