// main/handlers/depthHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { DepthFrameProcessor } from '../processors/depthProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles depth stream operations and IPC communication
 */
export class DepthStreamHandler extends BaseStreamHandler {
  constructor(kinectController) {
    super(kinectController);
    this.processor = new DepthFrameProcessor();
    this.frameCallback = null;
    this.depthRange = null;
  }

  /**
   * Set up IPC handlers for depth stream
   */
  setupHandler() {
    ipcMain.handle('start-depth-stream', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          this.depthRange = this.kinectController.getDepthModeRange(
            KinectOptions.DEPTH.depth_mode,
          );

          // Store callback removal function for cleanup
          this.frameCallback = (data) => {
            if (data.depthImageFrame) {
              const processedData = this.processFrame(
                data.depthImageFrame,
              );
              if (processedData) {
                event.sender.send('depth-frame', processedData);
              }
            }
          };

          this.kinectController.startListening(this.frameCallback);
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting depth stream');
      }
    });
  }

  /**
   * Process a depth frame
   * @param {Object} frame Raw depth frame data
   * @returns {Object} Processed frame data
   */
  processFrame(frame) {
    return this.processor.processFrame(frame, this.depthRange);
  }

  /**
   * Start the depth stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startDepthCamera({
        ...KinectOptions.DEPTH,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting depth camera');
    }
  }

  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-depth-stream';
  }

  /**
   * Stop the depth stream
   * @returns {Promise<void>}
   */
  async stopStream() {
    try {
      if (this.frameCallback) {
        await this.kinectController.stopListening();
        this.frameCallback = null;
      }
      await this.kinectController.stopCameras();
      this.isActive = false;
    } catch (error) {
      this.handleError(error, 'stopping depth stream');
    }
  }
}
