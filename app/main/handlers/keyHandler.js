// main/handlers/keyHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { KeyFrameProcessor } from '../processors/keyProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles key (body segmentation) stream operations and IPC communication
 */
export class KeyStreamHandler extends BaseStreamHandler {
  constructor(kinectController) {
    super(kinectController);
    this.processor = new KeyFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Set up IPC handlers for key stream
   */
  setupHandler() {
    // Check if handler is already registered
    if (ipcMain.listenerCount('start-key-stream') > 0) {
      console.log('Handler for start-key-stream already registered');
      return;
    }

    ipcMain.handle('start-key-stream', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          // Wait for body tracker to initialize
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Store callback removal function for cleanup
          this.frameCallback = (data) => {
            if (
              data.colorImageFrame &&
              data.bodyFrame?.bodyIndexMapToColorImageFrame
            ) {
              const processedData = this.processFrame(
                data.colorImageFrame,
                data.bodyFrame.bodyIndexMapToColorImageFrame,
              );
              if (processedData) {
                event.sender.send('key-frame', processedData);
              }
            }
          };

          this.kinectController.startListening(this.frameCallback);
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting key stream');
      }
    });
  }

  /**
   * Process a key frame
   * @param {Object} colorFrame Raw color frame data
   * @param {Object} bodyIndexMap Body index map data
   * @returns {Object} Processed frame data
   */
  processFrame(colorFrame, bodyIndexMap) {
    return this.processor.processFrame(colorFrame, bodyIndexMap);
  }

  /**
   * Start the key stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startKeyCamera({
        ...KinectOptions.KEY,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting key camera');
    }
  }

  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-key-stream';
  }

  /**
   * Stop the key stream
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
      this.handleError(error, 'stopping key stream');
    }
  }
}
