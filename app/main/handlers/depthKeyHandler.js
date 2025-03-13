// main/handlers/depthKeyHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { DepthKeyFrameProcessor } from '../processors/depthKeyProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles depth key stream operations and IPC communication
 */
export class DepthKeyStreamHandler extends BaseStreamHandler {
  constructor(kinectController) {
    super(kinectController);
    this.processor = new DepthKeyFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Set up IPC handlers for depth key stream
   */
  setupHandler() {
    // Check if handler is already registered
    if (ipcMain.listenerCount('start-depth-key-stream') > 0) {
      console.log(
        'Handler for start-depth-key-stream already registered',
      );
      return;
    }

    ipcMain.handle('start-depth-key-stream', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          // Store callback removal function for cleanup
          this.frameCallback = (data) => {
            if (
              data.depthImageFrame &&
              data.bodyFrame?.bodyIndexMapImageFrame
            ) {
              const processedData = this.processFrame(
                data.depthImageFrame,
                data.bodyFrame.bodyIndexMapImageFrame,
              );
              if (processedData) {
                event.sender.send('depth-key-frame', processedData);
              }
            }
          };

          this.kinectController.startListening(this.frameCallback);
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting depth key stream');
      }
    });
  }

  /**
   * Process a depth key frame
   * @param {Object} depthFrame Raw depth frame data
   * @param {Object} bodyIndexMap Body index map data
   * @returns {Object} Processed frame data
   */
  processFrame(depthFrame, bodyIndexMap) {
    return this.processor.processFrame(depthFrame, bodyIndexMap);
  }

  /**
   * Start the depth key stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startDepthKeyCamera({
        ...KinectOptions.DEPTH_KEY,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting depth key camera');
    }
  }

  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-depth-key-stream';
  }

  /**
   * Stop the depth key stream
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
      this.handleError(error, 'stopping depth key stream');
    }
  }
}
