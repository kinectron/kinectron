// main/managers/streamManager.js
import { ipcMain } from 'electron';
import { ColorStreamHandler } from '../handlers/colorHandler.js';
import { DepthStreamHandler } from '../handlers/depthHandler.js';
import { RawDepthStreamHandler } from '../handlers/rawDepthHandler.js';
import { BodyStreamHandler } from '../handlers/bodyHandler.js';
import { KeyStreamHandler } from '../handlers/keyHandler.js';
import { DepthKeyStreamHandler } from '../handlers/depthKeyHandler.js';
import { RGBDStreamHandler } from '../handlers/rgbdHandler.js';

/**
 * Manages all stream handlers and their lifecycle
 */
export class StreamManager {
  /**
   * @param {import('../kinectController.js').KinectController} kinectController
   */
  constructor(kinectController) {
    this.kinectController = kinectController;
    this.handlers = new Map();
    this.activeStreams = new Set();
  }

  /**
   * Initialize stream handlers and setup IPC listeners
   */
  initialize() {
    // Setup stop stream handler
    ipcMain.handle('stop-stream', async (event, streamType) => {
      try {
        if (streamType === 'all') {
          await this.stopAllStreams();
        } else {
          await this.stopStream(streamType);
        }
        return true;
      } catch (error) {
        console.error(`Error stopping ${streamType} stream:`, error);
        throw error;
      }
    });

    // Initialize color stream handler
    const colorHandler = new ColorStreamHandler(
      this.kinectController,
    );
    this.handlers.set('color', colorHandler);
    colorHandler.setupHandler();

    // Initialize depth stream handler
    const depthHandler = new DepthStreamHandler(
      this.kinectController,
    );
    this.handlers.set('depth', depthHandler);
    depthHandler.setupHandler();

    // Initialize raw depth stream handler
    const rawDepthHandler = new RawDepthStreamHandler(
      this.kinectController,
    );
    this.handlers.set('raw-depth', rawDepthHandler);
    rawDepthHandler.setupHandler();

    // Initialize body tracking handler
    const bodyHandler = new BodyStreamHandler(this.kinectController);
    this.handlers.set('skeleton', bodyHandler);
    bodyHandler.setupHandler();

    // Initialize key stream handler
    const keyHandler = new KeyStreamHandler(this.kinectController);
    this.handlers.set('key', keyHandler);
    keyHandler.setupHandler();

    // Initialize depth key stream handler
    const depthKeyHandler = new DepthKeyStreamHandler(
      this.kinectController,
    );
    this.handlers.set('depth-key', depthKeyHandler);
    depthKeyHandler.setupHandler();

    // Initialize RGBD stream handler
    const rgbdHandler = new RGBDStreamHandler(this.kinectController);
    this.handlers.set('rgbd', rgbdHandler);
    rgbdHandler.setupHandler();
  }

  /**
   * Get a stream handler by type
   * @param {string} streamType The type of stream
   * @returns {BaseStreamHandler|undefined} The stream handler
   */
  getHandler(streamType) {
    return this.handlers.get(streamType);
  }

  /**
   * Check if a stream is currently active
   * @param {string} streamType The type of stream
   * @returns {boolean} Whether the stream is active
   */
  isStreamActive(streamType) {
    const handler = this.getHandler(streamType);
    return handler ? handler.isStreamActive() : false;
  }

  /**
   * Start a stream
   * @param {string} streamType The type of stream to start
   * @returns {Promise<boolean>} Success status
   */
  async startStream(streamType) {
    try {
      const handler = this.getHandler(streamType);
      if (!handler) {
        throw new Error(
          `No handler found for stream type: ${streamType}`,
        );
      }

      const success = await handler.startStream();
      if (success) {
        this.activeStreams.add(streamType);
      }
      return success;
    } catch (error) {
      console.error(`Error starting ${streamType} stream:`, error);
      return false;
    }
  }

  /**
   * Stop a stream
   * @param {string} streamType The type of stream to stop
   * @returns {Promise<void>}
   */
  async stopStream(streamType) {
    try {
      const handler = this.getHandler(streamType);
      if (handler) {
        await handler.stopStream();
        this.activeStreams.delete(streamType);
      }
    } catch (error) {
      console.error(`Error stopping ${streamType} stream:`, error);
    }
  }

  /**
   * Stop all active streams
   * @returns {Promise<void>}
   */
  async stopAllStreams() {
    const stopPromises = Array.from(this.activeStreams).map(
      (streamType) => this.stopStream(streamType),
    );
    await Promise.all(stopPromises);
    this.activeStreams.clear();
  }

  /**
   * Clean up all resources
   * @returns {Promise<void>}
   */
  async cleanup() {
    await this.stopAllStreams();
    // Remove IPC handlers
    ipcMain.removeHandler('stop-stream');
    // Clear all handlers
    this.handlers.clear();
  }
}
