// renderer/js/peer/peerController.js

/**
 * Manages peer connections and data streaming in the renderer process
 */
export class PeerController {
  constructor() {
    this.peer = null;
    this.connections = new Set();
    this.eventListeners = new Map();
    this.isConnected = false;

    // Standard events that can be listened to
    this.EVENTS = {
      CONNECTION: 'connection',
      DISCONNECTION: 'disconnection',
      ERROR: 'error',
      READY: 'ready',
      SEND_ERROR: 'sendError',
    };
  }

  /**
   * Initialize the peer instance
   */
  initialize() {
    console.log('Initializing peer...');

    // Create peer instance with ID 'kinectron'
    this.peer = new Peer('kinectron', {
      host: 'localhost',
      port: 9001,
      path: '/',
      config: {
        iceServers: [],
        sdpSemantics: 'unified-plan',
      },
    });

    this.setupPeerEventHandlers();
  }

  /**
   * Set up event handlers for the peer instance
   * @private
   */
  setupPeerEventHandlers() {
    this.peer.on('open', (id) => {
      console.log('My peer ID is:', id);
      this.isConnected = true;
      this.emit(this.EVENTS.READY, {
        peer: {
          id: id,
          options: {
            port: this.peer.options.port,
            host: this.peer.options.host,
            path: this.peer.options.path,
          },
        },
      });
    });

    this.peer.on('connection', (conn) => {
      console.log('Got a new data connection from peer:', conn.peer);
      this.connections.add(conn);
      this.setupConnectionHandlers(conn);
      this.emit(this.EVENTS.CONNECTION, { connection: conn });
    });

    this.peer.on('error', (error) => {
      console.error('Peer error:', error);
      this.emit(this.EVENTS.ERROR, error);
    });

    this.peer.on('close', () => {
      console.log('Peer connection closed');
      this.isConnected = false;
    });
  }

  /**
   * Set up event handlers for a peer connection
   * @private
   * @param {DataConnection} conn - The peer connection
   */
  setupConnectionHandlers(conn) {
    conn.on('open', () => {
      console.log('Connection opened with peer:', conn.peer);
      // Send current Kinect status to new peer
      conn.send({
        event: 'ready',
        data: { kinect: 'azure' },
      });
    });

    conn.on('close', () => {
      console.log('Connection closed with peer:', conn.peer);
      this.connections.delete(conn);
      this.emit(this.EVENTS.DISCONNECTION, { connection: conn });
    });

    conn.on('error', (error) => {
      console.error('Connection error:', error);
      this.emit(this.EVENTS.ERROR, { connection: conn, error });
    });

    conn.on('data', (data) => {
      if (data.event) {
        this.handleIncomingData(conn, data);
      }
    });
  }

  /**
   * Handle incoming data from a peer
   * @private
   * @param {DataConnection} conn - The peer connection
   * @param {Object} data - The received data
   */
  handleIncomingData(conn, data) {
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
    }
  }

  /**
   * Broadcast data to all connected peers
   * @param {string} event - Event name
   * @param {*} data - Data to send
   * @param {boolean} [lossy=false] - If true, skip sending if connection is busy
   */
  broadcast(event, data, lossy = false) {
    const dataToSend = { event, data };

    this.connections.forEach((conn) => {
      try {
        // Skip if connection is busy and lossy sending is enabled
        if (lossy && conn.dataChannel?.bufferedAmount > 0) {
          return;
        }

        if (conn.open) {
          conn.send(dataToSend);
        }
      } catch (error) {
        console.error('Failed to send data to peer:', error);
        this.emit(this.EVENTS.SEND_ERROR, {
          connection: conn,
          error,
        });
      }
    });
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
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
    }
  }

  /**
   * Emit event to listeners
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.connections.forEach((conn) => {
      try {
        conn.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    });
    this.connections.clear();

    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }

    this.eventListeners.clear();
    this.isConnected = false;
  }
}
