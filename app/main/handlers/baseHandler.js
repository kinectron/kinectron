// main/handlers/baseHandler.js
import { ipcMain } from 'electron';

/**
 * Base class for all stream handlers
 * Provides common functionality and interface for stream handling
 */
export class BaseStreamHandler {
  /**
   * @param {import('../kinectController.js').KinectController} kinectController
   */
  constructor(kinectController) {
    if (new.target === BaseStreamHandler) {
      throw new Error(
        'Cannot instantiate BaseStreamHandler directly',
      );
    }
    this.kinectController = kinectController;
    this.isActive = false;
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
    throw error;
  }
}
