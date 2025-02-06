// managers/peerConnectionManager.js
import { EventEmitter } from 'events';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PeerServer } = require('peer');

/**
 * Simple peer server manager
 */
export class PeerConnectionManager extends EventEmitter {
  constructor() {
    super();
    this.server = null;
  }

  /**
   * Initialize the peer server
   */
  async initialize() {
    try {
      console.log('Initializing peer server...');
      this.server = PeerServer({
        port: 9001,
        path: '/',
        allow_discovery: true,
      });

      if (!this.server) {
        throw new Error('Failed to create peer server');
      }

      // Handle server errors
      this.server.on('error', (error) => {
        console.error('Server error:', error);
        this.emit('error', error);
      });

      console.log('Peer server is now listening on port 9001');
      this.emit('ready', {
        host: 'localhost',
        port: 9001,
        path: '/',
      });
    } catch (error) {
      console.error('Failed to initialize peer server:', error);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Close the peer server
   */
  async close() {
    if (this.server) {
      try {
        await new Promise((resolve) => {
          this.server._server.close(() => {
            console.log('Peer server closed');
            this.emit('closed');
            resolve();
          });
        });
        this.server = null;
      } catch (error) {
        console.error('Error closing server:', error);
        throw error;
      }
    }
  }
}
