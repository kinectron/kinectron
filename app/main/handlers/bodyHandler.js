// main/handlers/bodyHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { BodyFrameProcessor } from '../processors/bodyProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles body tracking stream operations and IPC communication
 */
export class BodyStreamHandler extends BaseStreamHandler {
  constructor(kinectController) {
    super(kinectController);
    this.processor = new BodyFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Set up IPC handlers for body tracking stream
   */
  setupHandler() {
    ipcMain.handle('start-body-tracking', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          // Store callback removal function for cleanup
          this.frameCallback = (data) => {
            if (data.bodyFrame && data.bodyFrame.numBodies > 0) {
              const processedData = this.processFrame(data.bodyFrame);
              if (processedData) {
                event.sender.send('body-frame', processedData);
              }
            }
          };

          this.kinectController.startListening(this.frameCallback);
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting body tracking');
      }
    });
  }

  /**
   * Process a body frame
   * @param {Object} frame Raw body frame data
   * @returns {Object} Processed frame data
   */
  processFrame(frame) {
    return this.processor.processFrame(frame);
  }

  /**
   * Start the body tracking stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startBodyTracking({
        ...KinectOptions.BODY,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting body tracking');
    }
  }

  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-body-tracking';
  }

  /**
   * Stop the body tracking stream
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
      this.handleError(error, 'stopping body tracking');
    }
  }
}
