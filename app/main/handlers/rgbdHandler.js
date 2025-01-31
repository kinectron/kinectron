// main/handlers/rgbdHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { RGBDFrameProcessor } from '../processors/rgbdProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles RGBD stream operations and IPC communication
 */
export class RGBDStreamHandler extends BaseStreamHandler {
  constructor(kinectController) {
    super(kinectController);
    this.processor = new RGBDFrameProcessor();
    this.frameCallback = null;
    this.depthRange = null;
  }

  /**
   * Set up IPC handlers for RGBD stream
   */
  setupHandler() {
    ipcMain.handle('start-rgbd-stream', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          this.depthRange = this.kinectController.getDepthModeRange(
            KinectOptions.RGBD.depth_mode,
          );

          // Store callback removal function for cleanup
          this.frameCallback = (data) => {
            if (data.depthImageFrame && data.colorToDepthImageFrame) {
              const processedData = this.processFrame(
                data.depthImageFrame,
                data.colorToDepthImageFrame,
              );
              if (processedData) {
                event.sender.send('rgbd-frame', processedData);
              }
            }
          };

          this.kinectController.startListening(this.frameCallback);
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting RGBD stream');
      }
    });
  }

  /**
   * Process an RGBD frame
   * @param {Object} depthFrame Raw depth frame data
   * @param {Object} colorToDepthFrame Color mapped to depth frame data
   * @returns {Object} Processed frame data
   */
  processFrame(depthFrame, colorToDepthFrame) {
    return this.processor.processFrame(
      depthFrame,
      colorToDepthFrame,
      this.depthRange,
    );
  }

  /**
   * Start the RGBD stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startRGBDCamera({
        ...KinectOptions.RGBD,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting RGBD camera');
    }
  }

  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-rgbd-stream';
  }

  /**
   * Stop the RGBD stream
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
      this.depthRange = null;
    } catch (error) {
      this.handleError(error, 'stopping RGBD stream');
    }
  }
}
