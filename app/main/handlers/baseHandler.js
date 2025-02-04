// main/handlers/baseHandler.js
import { ipcMain } from 'electron';

/**
 * Base class for all stream handlers
 * Provides common functionality and interface for stream handling
 */
export class BaseStreamHandler {
  /**
   * @param {import('../kinectController.js').KinectController} kinectController
   * @param {import('../managers/peerConnectionManager.js').PeerConnectionManager} peerManager
   */
  constructor(kinectController, peerManager) {
    if (new.target === BaseStreamHandler) {
      throw new Error(
        'Cannot instantiate BaseStreamHandler directly',
      );
    }
    this.kinectController = kinectController;
    this.peerManager = peerManager;
    this.isActive = false;
    this.frameCount = 0;
    this.lastFrameTime = 0;
  }

  /**
   * Broadcast frame data to all connected peers
   * @protected
   * @param {string} event Event name for the frame type
   * @param {*} data Frame data to broadcast
   * @param {boolean} [lossy=false] Whether to use lossy transmission
   */
  broadcastFrame(event, data, lossy = false) {
    if (
      !this.peerManager.isConnected ||
      this.peerManager.connections.size === 0
    ) {
      return; // No peers connected, skip broadcasting
    }

    try {
      // Calculate FPS for debugging
      const now = Date.now();
      if (now - this.lastFrameTime >= 1000) {
        console.debug(`${event} FPS:`, this.frameCount);
        this.frameCount = 0;
        this.lastFrameTime = now;
      }
      this.frameCount++;

      this.peerManager.broadcast(event, data, lossy);
    } catch (error) {
      this.handleError(error, 'broadcasting frame');
    }
  }

  /**
   * Create a data package for broadcasting
   * @protected
   * @param {string} name Frame type name
   * @param {*} data Frame data
   * @returns {{ name: string, data: *, timestamp: number }} Packaged data
   */
  createDataPackage(name, data) {
    return {
      name,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * Setup IPC handlers for this stream
   * @abstract
   */
  setupHandler() {
    throw new Error('Must implement setupHandler');
  }

  /**
   * Process incoming frames
   * @abstract
   * @param {Object} frame Raw frame data from Kinect
   * @returns {Object} Processed frame data
   */
  processFrame(frame) {
    throw new Error('Must implement processFrame');
  }

  /**
   * Start the stream
   * @abstract
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    throw new Error('Must implement startStream');
  }

  /**
   * Stop the stream
   * @abstract
   * @returns {Promise<void>}
   */
  async stopStream() {
    throw new Error('Must implement stopStream');
  }

  /**
   * Check if the stream is currently active
   * @returns {boolean}
   */
  isStreamActive() {
    return this.isActive;
  }

  /**
   * Clean up resources used by this handler
   * @returns {Promise<void>}
   */
  async cleanup() {
    await this.stopStream();
    // Remove IPC handler if it exists
    const handlerName = this.getHandlerName();
    if (handlerName) {
      ipcMain.removeHandler(handlerName);
    }
  }

  /**
   * Get the IPC handler name for this stream type
   * @protected
   * @returns {string|null} The handler name or null if not applicable
   */
  getHandlerName() {
    // Derived classes should override this if they use IPC
    return null;
  }

  /**
   * Handle errors that occur during stream operations
   * @protected
   * @param {Error} error The error that occurred
   * @param {string} operation The operation that failed
   */
  handleError(error, operation) {
    console.error(
      `Error in ${this.constructor.name} during ${operation}:`,
      error,
    );

    // Emit error event through peer manager if available
    if (this.peerManager) {
      this.peerManager.emit('error', {
        source: this.constructor.name,
        operation,
        error: error.message,
      });
    }

    throw error;
  }
}
