// renderer/js/peer/peerController.js

/**
 * @typedef {Object} PeerState
 * @property {boolean} isConnected - Whether peer is connected
 * @property {number} connectionAttempts - Number of connection attempts
 * @property {number} queuedMessages - Number of messages waiting to be sent
 */

/**
 * Enhanced peer controller for managing connections and data streaming
 */
export class PeerController {
  constructor() {
    this.peer = null;
    this.connections = new Set();
    this.eventListeners = new Map();
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 3;
    this.reconnectDelay = 2000;
    this.messageQueue = new Map(); // clientId -> message[]
    this.maxQueueSize = 100;

    // Enhanced events
    this.EVENTS = {
      CONNECTION: 'connection',
      DISCONNECTION: 'disconnection',
      ERROR: 'error',
      READY: 'ready',
      SEND_ERROR: 'sendError',
      SERVER_STATE: 'serverState',
      QUEUE_FULL: 'queueFull',
      RECONNECTING: 'reconnecting',
    };
  }

  /**
   * Get current peer state
   * @returns {PeerState} Current state information
   */
  getState() {
    return {
      isConnected: this.isConnected,
      connectionAttempts: this.connectionAttempts,
      queuedMessages: Array.from(this.messageQueue.values()).reduce(
        (total, queue) => total + queue.length,
        0,
      ),
    };
  }

  /**
   * Initialize the peer instance with enhanced configuration
   */
  initialize() {
    if (this.peer) {
      console.warn('Peer already initialized');
      return;
    }

    console.log('Initializing peer...');

    // Create peer instance with ID 'kinectron' and enhanced config
    this.peer = new Peer('kinectron', {
      host: 'localhost',
      port: 9001,
      path: '/',
      config: {
        iceServers: [],
        sdpSemantics: 'unified-plan',
      },
      // Add reliability options
      reliable: true,
      retries: 3,
      timeout: 10000,
      pingInterval: 5000,
    });

    this.setupPeerEventHandlers();
    this.startConnectionMonitor();
  }

  /**
   * Start connection monitoring
   * @private
   */
  startConnectionMonitor() {
    setInterval(() => {
      if (this.isConnected) {
        this.checkConnections();
      }
    }, 10000);
  }

  /**
   * Check health of all connections
   * @private
   */
  async checkConnections() {
    for (const conn of this.connections) {
      if (!conn.open) {
        console.warn('Found dead connection:', conn.peer);
        this.connections.delete(conn);
        this.emit(this.EVENTS.DISCONNECTION, { connection: conn });

        // Try to recover queued messages
        await this.handleDisconnection(conn);
      }
    }
  }

  /**
   * Set up event handlers for the peer instance with enhanced error handling
   * @private
   */
  setupPeerEventHandlers() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is:', id);
      this.isConnected = true;
      this.connectionAttempts = 0;
      this.emit(this.EVENTS.READY, {
        peer: {
          id: id,
          options: {
            port: this.peer.options.port,
            host: this.peer.options.host,
            path: this.peer.options.path,
          },
        },
        state: this.getState(),
      });
    });

    this.peer.on('connection', (conn) => {
      if (this.connections.size >= 10) {
        console.warn(
          'Connection limit reached, rejecting connection',
        );
        conn.close();
        return;
      }

      console.log('Got a new data connection from peer:', conn.peer);
      this.connections.add(conn);
      this.setupConnectionHandlers(conn);
      this.emit(this.EVENTS.CONNECTION, {
        connection: conn,
        state: this.getState(),
      });
    });

    this.peer.on('error', (error) => {
      console.error('Peer error:', error);
      this.isConnected = false;

      // Attempt reconnection if appropriate
      if (this.shouldAttemptReconnection(error)) {
        this.handleReconnection();
      }

      this.emit(this.EVENTS.ERROR, {
        error,
        state: this.getState(),
      });
    });

    this.peer.on('close', () => {
      console.log('Peer connection closed');
      this.isConnected = false;
      this.emit(this.EVENTS.SERVER_STATE, {
        state: 'closed',
        connections: this.connections.size,
      });
    });

    this.peer.on('disconnected', () => {
      console.log('Peer disconnected');
      this.isConnected = false;
      this.handleReconnection();
    });
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
   * Handle reconnection attempts
   * @private
   */
  async handleReconnection() {
    this.connectionAttempts++;
    const delay = Math.min(
      this.reconnectDelay * this.connectionAttempts,
      10000,
    );

    this.emit(this.EVENTS.RECONNECTING, {
      attempt: this.connectionAttempts,
      maxAttempts: this.maxConnectionAttempts,
      delay,
    });

    console.log(
      `Attempting reconnection ${this.connectionAttempts}/${this.maxConnectionAttempts} in ${delay}ms`,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (!this.isConnected) {
      this.cleanup();
      this.initialize();
    }
  }

  /**
   * Set up event handlers for a peer connection with enhanced error handling
   * @private
   * @param {DataConnection} conn - The peer connection
   */
  setupConnectionHandlers(conn) {
    // Initialize message queue for this connection
    this.messageQueue.set(conn.peer, []);

    conn.on('open', () => {
      console.log('Connection opened with peer:', conn.peer);

      // Process any queued messages
      this.processMessageQueue(conn);

      // Send current Kinect status to new peer
      conn.send({
        event: 'ready',
        data: {
          kinect: 'azure',
          state: this.getState(),
        },
      });
    });

    conn.on('close', () => {
      console.log('Connection closed with peer:', conn.peer);
      this.handleDisconnection(conn);
    });

    conn.on('error', (error) => {
      console.error('Connection error:', error);
      this.emit(this.EVENTS.ERROR, {
        connection: conn,
        error,
        state: this.getState(),
      });
    });

    conn.on('data', (data) => {
      if (data.event) {
        this.handleIncomingData(conn, data);
      }
    });
  }

  /**
   * Handle connection disconnection
   * @private
   * @param {DataConnection} conn - The disconnected connection
   */
  async handleDisconnection(conn) {
    this.connections.delete(conn);

    // Get queued messages for this connection
    const queuedMessages = this.messageQueue.get(conn.peer) || [];
    if (queuedMessages.length > 0) {
      console.log(
        `${queuedMessages.length} messages queued for ${conn.peer}`,
      );
    }

    this.messageQueue.delete(conn.peer);

    this.emit(this.EVENTS.DISCONNECTION, {
      connection: conn,
      queuedMessages: queuedMessages.length,
      state: this.getState(),
    });
  }

  /**
   * Process queued messages for a connection
   * @private
   * @param {DataConnection} conn - The connection to process messages for
   */
  async processMessageQueue(conn) {
    const queue = this.messageQueue.get(conn.peer) || [];
    while (queue.length > 0) {
      const msg = queue.shift();
      try {
        await this.sendMessage(conn, msg);
      } catch (error) {
        console.error('Failed to send queued message:', error);
        // Re-queue message if connection is still open
        if (conn.open && queue.length < this.maxQueueSize) {
          queue.push(msg);
        }
      }
    }
  }

  /**
   * Handle incoming data from peer with enhanced error handling
   * @private
   * @param {DataConnection} conn - The peer connection
   * @param {Object} data - The received data
   */
  handleIncomingData(conn, data) {
    try {
      switch (data.event) {
        case 'setkinect':
          // Handle kinect type setting
          break;

        case 'initfeed':
          if (data.data?.feed) {
            // Initialize feed
          }
          break;

        case 'feed':
          if (data.data?.feed) {
            // Change feed
          }
          break;

        case 'multi':
          // Handle multi-frame request
          break;

        case 'record':
          if (data.data === 'start') {
            // Start recording
          } else if (data.data === 'stop') {
            // Stop recording
          }
          break;

        case 'ping':
          // Respond to ping requests
          conn.send({
            event: 'pong',
            data: { timestamp: Date.now() },
          });
          break;

        default:
          console.warn('Unknown event type:', data.event);
      }
    } catch (error) {
      console.error('Error handling incoming data:', error);
      this.emit(this.EVENTS.ERROR, {
        connection: conn,
        error,
        data,
      });
    }
  }

  /**
   * Send a message to a specific connection
   * @private
   * @param {DataConnection} conn - The connection to send to
   * @param {Object} message - The message to send
   * @returns {Promise<void>}
   */
  async sendMessage(conn, message) {
    return new Promise((resolve, reject) => {
      try {
        if (!conn.open) {
          throw new Error('Connection not open');
        }

        const timeout = setTimeout(() => {
          reject(new Error('Send timeout'));
        }, 5000);

        conn.send(message);
        clearTimeout(timeout);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Broadcast data to all connected peers with enhanced reliability
   * @param {string} event - Event name
   * @param {*} data - Data to send
   * @param {boolean} [lossy=false] - If true, skip sending if connection is busy
   */
  broadcast(event, data, lossy = false) {
    const dataToSend = {
      event,
      data,
      timestamp: Date.now(),
    };

    this.connections.forEach((conn) => {
      try {
        // Skip if connection is busy and lossy sending is enabled
        if (lossy && conn.dataChannel?.bufferedAmount > 0) {
          return;
        }

        if (conn.open) {
          this.sendMessage(conn, dataToSend).catch((error) => {
            console.error('Failed to send message:', error);

            // Queue message for retry if not lossy
            if (!lossy) {
              const queue = this.messageQueue.get(conn.peer) || [];
              if (queue.length < this.maxQueueSize) {
                queue.push(dataToSend);
                this.messageQueue.set(conn.peer, queue);
              } else {
                this.emit(this.EVENTS.QUEUE_FULL, {
                  connection: conn,
                  droppedMessage: dataToSend,
                });
              }
            }

            this.emit(this.EVENTS.SEND_ERROR, {
              connection: conn,
              error,
              data: dataToSend,
            });
          });
        }
      } catch (error) {
        console.error('Failed to send data to peer:', error);
        this.emit(this.EVENTS.SEND_ERROR, {
          connection: conn,
          error,
          data: dataToSend,
        });
      }
    });
  }

  /**
   * Add event listener with validation
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!Object.values(this.EVENTS).includes(event)) {
      console.warn('Unknown event type:', event);
      return;
    }

    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      // Clean up empty listener sets
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Emit event to listeners with error handling
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback({
            ...data,
            timestamp: Date.now(),
            event,
          });
        } catch (error) {
          console.error('Error in event listener:', error);
          // Emit error but prevent infinite loop
          if (event !== this.EVENTS.ERROR) {
            this.emit(this.EVENTS.ERROR, {
              error,
              source: 'eventListener',
              event,
            });
          }
        }
      });
    }
  }

  /**
   * Clean up resources and handle graceful shutdown
   */
  cleanup() {
    // Clear all intervals
    if (this._connectionMonitorInterval) {
      clearInterval(this._connectionMonitorInterval);
    }

    // Close all connections
    this.connections.forEach((conn) => {
      try {
        // Send close event to peers
        if (conn.open) {
          conn.send({
            event: 'shutdown',
            data: { reason: 'cleanup' },
          });
        }
        conn.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    });
    this.connections.clear();

    // Clear message queues
    this.messageQueue.clear();

    // Destroy peer instance
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    // Reset state
    this.eventListeners.clear();
    this.isConnected = false;
    this.connectionAttempts = 0;
  }
}
