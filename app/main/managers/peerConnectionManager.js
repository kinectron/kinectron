// managers/peerConnectionManager.js
import { EventEmitter } from 'events';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PeerServer } = require('peer');

/**
 * Connection states for the peer server
 * @enum {string}
 */
const ServerState = {
  STOPPED: 'stopped',
  STARTING: 'starting',
  RUNNING: 'running',
  RESTARTING: 'restarting',
  ERROR: 'error',
};

/**
 * Enhanced peer server manager with health checks and connection management
 */
export class PeerConnectionManager extends EventEmitter {
  constructor() {
    super();
    this.server = null;
    this.state = ServerState.STOPPED;
    this.healthCheckInterval = null;
    this.restartAttempts = 0;
    this.maxRestartAttempts = 3;
    this.connectionQueue = new Set();
    this.maxConnections = 50; // Increased from 10 to handle more connections
  }

  /**
   * Get current server state
   * @returns {ServerState} Current state of the server
   */
  getState() {
    return this.state;
  }

  /**
   * Check if server can accept new connections
   * @returns {boolean} Whether server can accept new connections
   */
  canAcceptConnections() {
    return (
      this.state === ServerState.RUNNING &&
      this.connectionQueue.size < this.maxConnections
    );
  }

  /**
   * Initialize the peer server with enhanced monitoring and management
   */
  async initialize() {
    try {
      if (this.state === ServerState.RUNNING) {
        console.log('Server already running');
        return;
      }

      this.state = ServerState.STARTING;
      console.log('Initializing peer server...');

      this.server = PeerServer({
        port: 9001,
        path: '/',
        allow_discovery: true,
        // Add connection limits and timeouts
        proxied: true,
        concurrent_limit: this.maxConnections,
        alive_timeout: 60000, // 60 seconds
      });

      if (!this.server) {
        throw new Error('Failed to create peer server');
      }

      this.setupServerEventHandlers();
      this.startHealthCheck();

      this.state = ServerState.RUNNING;
      console.log('Peer server is now listening on port 9001');
      this.emit('ready', {
        host: 'localhost',
        port: 9001,
        path: '/',
        state: this.state,
      });
    } catch (error) {
      await this.handleServerError(error);
    }
  }

  /**
   * Set up event handlers for the peer server
   * @private
   */
  setupServerEventHandlers() {
    // Handle new connections
    this.server.on('connection', (client) => {
      if (this.canAcceptConnections()) {
        console.log('New client connected:', client.id);
        this.connectionQueue.add(client.id);
        this.emit('connection', { clientId: client.id });
      } else {
        console.log('Connection rejected - server at capacity');
        if (client.socket) {
          client.socket.close();
        }
      }
    });

    // Handle disconnections
    this.server.on('disconnect', (client) => {
      console.log('Client disconnected:', client.id);
      this.connectionQueue.delete(client.id);
      this.emit('disconnect', { clientId: client.id });
    });

    // Handle server errors
    this.server.on('error', async (error) => {
      await this.handleServerError(error);
    });
  }

  /**
   * Start health check interval
   * @private
   */
  startHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      if (this.state !== ServerState.RUNNING) {
        return;
      }

      try {
        // Check server health
        const isHealthy = await this.checkServerHealth();
        if (!isHealthy && this.connectionQueue.size > 0) {
          // Only restart if there are clients and server is unhealthy
          console.warn(
            'Server health check failed, attempting restart',
          );
          await this.restartServer();
        }
      } catch (error) {
        console.error('Health check error:', error);
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Check server health
   * @private
   * @returns {Promise<boolean>} Server health status
   */
  async checkServerHealth() {
    if (!this.server) {
      return false;
    }

    try {
      // Only check active connections
      let activeConnections = 0;
      let deadConnections = 0;

      if (this.server._clients) {
        for (const clientId of this.connectionQueue) {
          const client = this.server._clients.get(clientId);
          if (client?.socket?.connected) {
            activeConnections++;
          } else {
            deadConnections++;
            this.connectionQueue.delete(clientId);
          }
        }
      }

      // Only consider server unhealthy if there are dead connections
      // and no active connections
      return deadConnections === 0 || activeConnections > 0;
    } catch (error) {
      console.error('Health check failed:', error);
      return true; // Assume healthy unless we can definitively determine otherwise
    }
  }

  /**
   * Handle server errors with recovery attempts
   * @private
   * @param {Error} error - The error that occurred
   */
  async handleServerError(error) {
    console.error('Server error:', error);
    this.state = ServerState.ERROR;
    this.emit('error', {
      error,
      state: this.state,
      connections: this.connectionQueue.size,
    });

    if (this.restartAttempts < this.maxRestartAttempts) {
      await this.restartServer();
    } else {
      console.error(
        'Max restart attempts reached, manual intervention required',
      );
      throw error;
    }
  }

  /**
   * Attempt to restart the server
   * @private
   */
  async restartServer() {
    try {
      this.state = ServerState.RESTARTING;
      this.restartAttempts++;
      console.log(
        `Attempting server restart (${this.restartAttempts}/${this.maxRestartAttempts})`,
      );

      // Destroy the server instance
      if (this.server) {
        try {
          // Close all client connections first
          if (this.server._clients) {
            for (const client of this.server._clients.values()) {
              try {
                if (client.socket) {
                  client.socket.close();
                }
              } catch (err) {
                console.warn('Error closing client socket:', err);
              }
            }
          }

          // Close the server if possible
          if (
            this.server._server &&
            typeof this.server._server.close === 'function'
          ) {
            await new Promise((resolve) => {
              this.server._server.close(resolve);
            });
          }
        } catch (err) {
          console.warn('Error during server cleanup:', err);
        }
      }

      // Clear state
      this.server = null;
      this.connectionQueue.clear();

      // Wait before restarting
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Initialize new server
      await this.initialize();

      this.restartAttempts = 0; // Reset counter on successful restart
    } catch (error) {
      console.error('Failed to restart server:', error);
      throw error;
    }
  }

  /**
   * Close the peer server and clean up resources
   */
  async close() {
    if (this.server) {
      try {
        if (this.healthCheckInterval) {
          clearInterval(this.healthCheckInterval);
          this.healthCheckInterval = null;
        }

        // Close all client connections first
        if (this.server._clients) {
          for (const client of this.server._clients.values()) {
            try {
              if (client.socket) {
                client.socket.close();
              }
            } catch (err) {
              console.warn('Error closing client socket:', err);
            }
          }
        }

        this.connectionQueue.clear();

        // Close the server if it exists
        if (
          this.server._server &&
          typeof this.server._server.close === 'function'
        ) {
          await new Promise((resolve) => {
            this.server._server.close(() => {
              console.log('Peer server closed');
              resolve();
            });
          });
        } else {
          // If no server instance, just clean up
          console.log('No server instance to close');
        }

        // Cleanup
        this.state = ServerState.STOPPED;
        this.emit('closed', { state: this.state });
        this.server = null;
      } catch (error) {
        console.error('Error during server cleanup:', error);
        // Continue with cleanup even if there's an error
        this.state = ServerState.STOPPED;
        this.server = null;
      }
    }
  }
}
