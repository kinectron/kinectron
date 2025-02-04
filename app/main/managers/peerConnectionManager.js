// managers/peerConnectionManager.js
import { EventEmitter } from 'events';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PeerServer } = require('peer');
const http = require('http');

/**
 * @typedef {Object} PeerConfig
 * @property {string} [host='localhost'] - Peer server host
 * @property {number} [port=9001] - Peer server port
 * @property {string} [path='/'] - Peer server path
 * @property {string} [peerId='kinectron'] - Peer ID for this instance
 * @property {boolean} [ssl=false] - Whether to use SSL
 * @property {boolean} [proxied=false] - Whether server is behind a proxy
 */

/**
 * Manages peer server and connections
 */
export class PeerConnectionManager extends EventEmitter {
  /**
   * @param {PeerConfig} config - Configuration for the peer server
   */
  constructor(config = {}) {
    super();

    this.config = {
      host: config.host || 'localhost',
      port: config.port || 9001,
      path: config.path || '/',
      peerId: config.peerId || 'kinectron',
      ssl: config.ssl || false,
      proxied: config.proxied || false,
    };

    this.server = null;
    this.connections = new Set();
    this.isConnected = false;
  }

  /**
   * Initialize the peer server
   */
  async initialize() {
    try {
      // Create the peer server
      try {
        // Create PeerServer with its own HTTP server
        this.server = PeerServer({
          debug: true,
          path: this.config.path,
          port: this.config.port,
          ssl: this.config.ssl,
          proxied: this.config.proxied,
          allow_discovery: true,
        });

        if (!this.server) {
          throw new Error('Failed to create peer server');
        }

        // Set up event handlers before starting
        this._setupServerEventHandlers();

        // Server is ready immediately after creation
        console.log('Peer server is now listening');
        this.isConnected = true;
        this.emit('ready', {
          host: this.config.host,
          port: this.config.port,
        });
      } catch (serverError) {
        console.error('Error creating peer server:', serverError);
        throw serverError;
      }

      // Log server details
      console.log('Server details:', {
        url: `http://${this.config.host}:${this.config.port}${this.config.path}`,
        ssl: this.config.ssl,
        proxied: this.config.proxied,
      });
    } catch (error) {
      console.error('Failed to initialize peer server:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Set up event handlers for the peer server
   * @private
   */
  _setupServerEventHandlers() {
    this.server.on('connection', (client) => {
      console.log('Client attempting to connect:', client.id);
      this.connections.add(client);
      this.emit('connection', client);

      // Handle client events
      client.on('close', () => {
        console.log('Client disconnected:', client.id);
        this.connections.delete(client);
        this.emit('clientDisconnected', client);
      });

      client.on('error', (error) => {
        console.error('Client error:', client.id, error);
        this.emit('clientError', { client, error });
      });
    });

    this.server.on('error', (error) => {
      console.error('Server error:', error);
      this.emit('error', error);
      this.isConnected = false;
    });
  }

  /**
   * Broadcast data to all connected peers
   * @param {string} event - Event name
   * @param {*} data - Data to send
   * @param {boolean} [lossy=false] - If true, skip sending if connection is busy
   */
  broadcast(event, data, lossy = false) {
    const dataToSend = { event, data };

    this.connections.forEach((client) => {
      try {
        // Check if client is still connected
        if (client.socket && client.socket.writable) {
          // Skip if connection is busy and lossy sending is enabled
          if (lossy && client.socket.bufferedAmount > 0) {
            return;
          }

          client.socket.send(JSON.stringify(dataToSend));
        }
      } catch (error) {
        console.error(
          'Failed to send data to peer:',
          client.id,
          error,
        );
        this.emit('sendError', { client, error });
      }
    });
  }

  /**
   * Get the number of connected peers
   * @returns {number} Number of connected peers
   */
  getConnectionCount() {
    return this.connections.size;
  }

  /**
   * Close the peer server and all connections
   */
  async close() {
    // Close all peer connections
    this.connections.forEach((client) => {
      try {
        if (client.socket) {
          client.socket.close();
        }
      } catch (error) {
        console.error('Error closing client connection:', error);
      }
    });
    this.connections.clear();

    // Close the server
    if (this.server) {
      try {
        // Access the underlying HTTP server
        const httpServer = this.server._server;
        if (httpServer) {
          await new Promise((resolve) => {
            httpServer.close(() => {
              this.isConnected = false;
              this.emit('closed');
              resolve();
            });
          });
        }
        // Clean up server reference
        this.server = null;
      } catch (error) {
        console.error('Error closing server:', error);
        throw error;
      }
    }
  }
}
