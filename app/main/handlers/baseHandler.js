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
    this.isMultiFrame = false;
    this.frameCallback = null;
  }

  /**
   * Set whether this handler is being used in multiframe mode
   * @param {boolean} isMulti Whether this handler is in multiframe mode
   */
  setMultiFrameMode(isMulti) {
    this.isMultiFrame = isMulti;
  }

  /**
   * Create frame callback for processing frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    // Derived classes should implement this
    throw new Error('Must implement createFrameCallback');
  }

  /**
   * Broadcast frame data to all connected peers
   * @protected
   * @param {string} event Event name for the frame type
   * @param {*} data Frame data to broadcast
   * @param {boolean} [lossy=false] Whether to use lossy transmission
   */
  broadcastFrame(event, data, lossy = false) {
    try {
      console.log(
        `BaseStreamHandler: Broadcasting ${event} event to peers`,
      );

      // Calculate FPS for debugging
      const now = Date.now();
      if (now - this.lastFrameTime >= 1000) {
        console.debug(`${event} FPS:`, this.frameCount);
        this.frameCount = 0;
        this.lastFrameTime = now;
      }
      this.frameCount++;

      // Log data structure before broadcasting
      if (event === 'frame') {
        console.log(
          'BaseStreamHandler: Frame data structure:',
          'name=',
          data.name,
          'data.name=',
          data.data?.name,
          'has imagedata=',
          !!data.data?.imagedata,
        );
      }

      // Use both methods to broadcast the frame data
      // 1. Use the PeerConnectionManager's broadcast method
      this.peerManager.broadcast(event, data, lossy);

      // 2. Use the IPC channel to broadcast to the renderer process
      // This will allow the renderer process to broadcast to its peer connections
      try {
        // Import BrowserWindow using ES modules
        import('electron')
          .then(({ BrowserWindow }) => {
            const windows = BrowserWindow.getAllWindows();
            windows.forEach((window) => {
              if (!window.isDestroyed()) {
                console.log(
                  'BaseStreamHandler: Sending frame to renderer process via IPC',
                );
                window.webContents.send('broadcast-to-peers', {
                  event,
                  data,
                  lossy,
                });
              }
            });
          })
          .catch((error) => {
            console.error(
              'BaseStreamHandler: Error importing electron:',
              error,
            );
          });
      } catch (error) {
        console.error(
          'BaseStreamHandler: Error sending to renderer:',
          error,
        );
      }

      console.log(
        `BaseStreamHandler: Broadcast of ${event} event completed`,
      );
    } catch (error) {
      console.error(
        'BaseStreamHandler: Error broadcasting frame:',
        error,
      );
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
    console.log(
      'BaseStreamHandler: Creating data package:',
      'name=',
      name,
      'data.name=',
      data?.name,
      'has imagedata=',
      !!data?.imagedata,
    );

    const pkg = {
      name,
      data,
      timestamp: Date.now(),
    };

    console.log(
      'BaseStreamHandler: Created package structure:',
      'name=',
      pkg.name,
      'data.name=',
      pkg.data?.name,
      'has imagedata=',
      !!pkg.data?.imagedata,
      'timestamp=',
      pkg.timestamp,
    );

    return pkg;
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
