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
   * Start multiple streams sequentially
   * NOTE: This functionality is currently not working and under development.
   * Known issues:
   * 1. Camera initialization in multiframe mode
   * 2. Frame callback management
   * 3. Resource cleanup
   * 4. Kinect Azure SDK multiframe requirements
   *
   * This feature has been temporarily disabled in the UI.
   * Future work needed:
   * - Review Kinect Azure SDK documentation for multiframe support
   * - Add detailed logging for camera state transitions
   * - Implement proper camera state verification
   * - Consider alternative approaches to multiframe streaming
   *
   * @private
   * @param {string[]} streams Array of stream types to start
   * @param {Electron.IpcMainInvokeEvent} event
   * @returns {Promise<boolean>} Success status
   */
  async startMultipleStreams(streams, event) {
    try {
      await this.stopAllStreams();
      // Wait a bit to avoid ThreadSafeFunction error
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create frame callbacks for each stream first
      streams.forEach((stream) => {
        const handler = this.getHandler(stream);
        if (handler) {
          handler.setMultiFrameMode(true);
          handler.createFrameCallback(event);
        }
      });

      // Start all cameras first
      let success = true;
      for (const stream of streams) {
        const handler = this.getHandler(stream);
        if (!handler) {
          console.error(`No handler found for stream: ${stream}`);
          success = false;
          break;
        }

        const streamSuccess = await handler.startStream();
        if (!streamSuccess) {
          console.error(`Failed to start stream: ${stream}`);
          success = false;
          break;
        }
        this.activeStreams.add(stream);
        // Small delay between starting streams
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (!success) {
        await this.stopAllStreams();
        return false;
      }

      // Start listening for all streams at once
      const multiFrameCallback = (data) => {
        streams.forEach((stream) => {
          const handler = this.getHandler(stream);
          if (handler && handler.frameCallback) {
            handler.frameCallback(data);
          }
        });
      };

      this.kinectController.startListening(multiFrameCallback);
      return true;
    } catch (error) {
      console.error('Error starting multiple streams:', error);
      await this.stopAllStreams();
      return false;
    }
  }

  /**
   * Handle multi-stream request from peer
   * @private
   * @param {string[]} streams
   */
  async handleMultiStreamRequest(streams) {
    await this.startMultipleStreams(streams);
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

    // Setup multi-stream handler
    ipcMain.handle('start-multi-stream', async (event, streams) => {
      return this.startMultipleStreams(streams, event);
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
    // Map 'body' to 'skeleton' since that's how the handler is registered
    const mappedType =
      streamType === 'body' ? 'skeleton' : streamType;
    return this.handlers.get(mappedType);
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
    console.log(`StreamManager: Starting stream: ${streamType}`);
    try {
      const handler = this.getHandler(streamType);
      if (!handler) {
        console.error(
          `StreamManager: No handler found for stream type: ${streamType}`,
        );
        throw new Error(
          `No handler found for stream type: ${streamType}`,
        );
      }

      console.log(
        `StreamManager: Found handler for ${streamType}, calling startStream()`,
      );
      const success = await handler.startStream();
      console.log(
        `StreamManager: Handler.startStream() returned: ${success}`,
      );

      if (success) {
        this.activeStreams.add(streamType);
        console.log(
          `StreamManager: Added ${streamType} to active streams`,
        );
        console.log(
          `StreamManager: Active streams: ${Array.from(
            this.activeStreams,
          ).join(', ')}`,
        );
      } else {
        console.warn(
          `StreamManager: Failed to start ${streamType} stream`,
        );
      }
      return success;
    } catch (error) {
      console.error(
        `StreamManager: Error starting ${streamType} stream:`,
        error,
      );
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
    // Reset multiframe mode for all handlers
    Array.from(this.handlers.values()).forEach((handler) => {
      handler.setMultiFrameMode(false);
    });

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
    ipcMain.removeHandler('start-multi-stream');
    // Clear all handlers
    this.handlers.clear();
  }
}
