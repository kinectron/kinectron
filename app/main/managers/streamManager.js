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
   * @param {import('./peerConnectionManager.js').PeerConnectionManager} peerManager
   */
  constructor(kinectController, peerManager) {
    this.kinectController = kinectController;
    this.peerManager = peerManager;
    this.handlers = new Map();
    this.activeStreams = new Set();

    // Listen for peer connection events
    this.peerManager.on('data', this.handlePeerData.bind(this));
    this.peerManager.on(
      'connectionClosed',
      this.handlePeerDisconnect.bind(this),
    );
  }

  /**
   * Handle incoming peer data
   * @private
   * @param {{ connection: any, data: { event: string, data: any } }} eventData
   */
  handlePeerData({ connection, data }) {
    try {
      const { event, data: payload } = data;

      switch (event) {
        case 'feed':
          this.handleFeedRequest(payload);
          break;
        case 'multi':
          this.handleMultiStreamRequest(payload);
          break;
        default:
          console.warn('Unknown peer event:', event);
      }
    } catch (error) {
      console.error('Error handling peer data:', error);
    }
  }

  /**
   * Handle peer feed request
   * @private
   * @param {{ feed: string }} payload
   */
  async handleFeedRequest(payload) {
    try {
      if (payload.feed === 'stop-all') {
        await this.stopAllStreams();
      } else {
        await this.startStream(payload.feed);
      }
    } catch (error) {
      console.error('Error handling feed request:', error);
    }
  }

  /**
   * Handle multi-stream request
   * @private
   * @param {string[]} streams
   */
  async handleMultiStreamRequest(streams) {
    try {
      await this.stopAllStreams();
      const startPromises = streams.map((stream) =>
        this.startStream(stream),
      );
      await Promise.all(startPromises);
    } catch (error) {
      console.error('Error handling multi-stream request:', error);
    }
  }

  /**
   * Handle peer disconnect
   * @private
   */
  async handlePeerDisconnect() {
    if (this.peerManager.connections.size === 0) {
      // Stop all streams if no peers are connected
      await this.stopAllStreams();
    }
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

    // Initialize all stream handlers with both kinectController and peerManager
    const handlers = [
      { type: 'color', Handler: ColorStreamHandler },
      { type: 'depth', Handler: DepthStreamHandler },
      { type: 'raw-depth', Handler: RawDepthStreamHandler },
      { type: 'skeleton', Handler: BodyStreamHandler },
      { type: 'key', Handler: KeyStreamHandler },
      { type: 'depth-key', Handler: DepthKeyStreamHandler },
      { type: 'rgbd', Handler: RGBDStreamHandler },
    ];

    handlers.forEach(({ type, Handler }) => {
      const handler = new Handler(
        this.kinectController,
        this.peerManager,
      );
      this.handlers.set(type, handler);
      handler.setupHandler();
    });
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
