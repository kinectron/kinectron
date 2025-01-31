// main/handlers/colorHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { ColorFrameProcessor } from '../processors/colorProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles color stream operations and IPC communication
 */
export class ColorStreamHandler extends BaseStreamHandler {
  constructor(kinectController) {
    super(kinectController);
    this.processor = new ColorFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Set up IPC handlers for color stream
   */
  setupHandler() {
    ipcMain.handle('start-color-stream', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          // Store callback removal function for cleanup
          this.frameCallback = (data) => {
            if (data.colorImageFrame) {
              const processedData = this.processFrame(
                data.colorImageFrame,
              );
              if (processedData) {
                event.sender.send('color-frame', processedData);
              }
            }
          };

          this.kinectController.startListening(this.frameCallback);
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting color stream');
      }
    });
  }

  /**
   * Process a color frame
   * @param {Object} frame Raw color frame data
   * @returns {Object} Processed frame data
   */
  processFrame(frame) {
    return this.processor.processFrame(frame);
  }

  /**
   * Start the color stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startColorCamera({
        ...KinectOptions.COLOR,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting color camera');
    }
  }

  /**
   * Stop the color stream
   * @returns {Promise<void>}
   */
  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-color-stream';
  }

  async stopStream() {
    try {
      if (this.frameCallback) {
        await this.kinectController.stopListening();
        this.frameCallback = null;
      }
      await this.kinectController.stopCameras();
      this.isActive = false;
    } catch (error) {
      this.handleError(error, 'stopping color stream');
    }
  }
}
