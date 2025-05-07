// renderer/js/peer/peerConnectionController.js

/**
 * Manages peer-to-peer connections and data streaming
 */
export class PeerConnectionController {
  constructor() {
    this.peer = null;
    this.connections = new Set();
    this.isConnected = false;
    this.eventListeners = {};

    // Standard events that can be listened to
    this.EVENTS = {
      CONNECTION: 'connection',
      DISCONNECTION: 'disconnection',
      ERROR: 'error',
      READY: 'ready',
      SEND_ERROR: 'sendError',
    };

    this.setupEventListeners();
    this.initializeStatus();
  }

  /**
   * Initialize peer status and start periodic updates
   * @private
   */
  async initializeStatus() {
    try {
      const status = await window.kinectron.getPeerStatus();
      this.updateStatus(status);

      // Update status periodically
      setInterval(async () => {
        try {
          const status = await window.kinectron.getPeerStatus();
          this.updateStatus(status);
        } catch (error) {
          console.error('Error updating peer status:', error);
        }
      }, 5000); // Update every 5 seconds
    } catch (error) {
      console.error('Error getting initial peer status:', error);
    }
  }

  /**
   * Update status display with new information
   * @private
   */
  updateStatus(status) {
    document.getElementById('ipaddress').textContent = status.address;
    document.getElementById('peerid').textContent = status.id;
    document.getElementById('port').textContent = status.port;
    document.getElementById('peer-count').textContent =
      status.connectionCount;
    document.getElementById('server-status').textContent =
      status.isConnected ? 'Connected' : 'Disconnected';
  }

  /**
   * Set up event listeners for peer connection events
   * @private
   */
  setupEventListeners() {
    window.kinectron.onPeerConnection((data) => {
      console.log('Peer connected:', data);
      this.isConnected = true;
      this.connections.add(data.connection);
      this.emit(this.EVENTS.CONNECTION, data);
    });

    window.kinectron.onPeerDisconnection((data) => {
      console.log('Peer disconnected:', data);
      this.connections.delete(data.connection);
      if (this.connections.size === 0) {
        this.isConnected = false;
      }
      this.emit(this.EVENTS.DISCONNECTION, data);
    });

    window.kinectron.onPeerError((error) => {
      console.error('Peer error:', error);
      this.emit(this.EVENTS.ERROR, error);
    });

    window.kinectron.onPeerReady((data) => {
      console.log('Peer ready:', data);
      this.peer = data.peer;
      this.emit(this.EVENTS.READY, data);
    });
  }

  /**
   * Update peer server configuration
   * @param {Object} config - Peer server configuration
   * @returns {Promise<void>}
   */
  async updateConfig(config) {
    try {
      await window.kinectron.updatePeerConfig(config);
    } catch (error) {
      console.error('Failed to update peer config:', error);
      throw error;
    }
  }

  /**
   * Get current peer connection status
   * @returns {Promise<Object>} Status object
   */
  async getStatus() {
    try {
      return await window.kinectron.getPeerStatus();
    } catch (error) {
      console.error('Failed to get peer status:', error);
      throw error;
    }
  }

  /**
   * Broadcast data to all connected peers
   * @param {string} event - Event name
   * @param {*} data - Data to broadcast
   * @param {boolean} [lossy=false] - If true, skip sending if connection is busy
   */
  broadcast(event, data, lossy = false) {
    if (!this.isConnected) return;

    const message = {
      event,
      data,
      timestamp: Date.now(),
    };

    this.connections.forEach((connection) => {
      try {
        if (connection.open) {
          // Skip if connection is busy and lossy sending is enabled
          if (lossy && connection.bufferedAmount > 0) {
            return;
          }
          connection.send(message);
        }
      } catch (error) {
        console.error('Failed to send data to peer:', error);
        this.emit(this.EVENTS.SEND_ERROR, { connection, error });
      }
    });
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = new Set();
    }
    this.eventListeners[event].add(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].delete(callback);
    }
  }

  /**
   * Emit event to listeners
   * @private
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Clean up connections and event listeners
   */
  cleanup() {
    this.connections.clear();
    this.eventListeners = {};
    this.isConnected = false;
    this.peer = null;
  }
}
