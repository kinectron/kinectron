// main/handlers/colorHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { ColorFrameProcessor } from '../processors/colorProcessor.js';
import { KinectOptions } from '../kinectController.js';

/**
 * Handles color stream operations and IPC communication
 */
export class ColorStreamHandler extends BaseStreamHandler {
  constructor(kinectController, peerManager) {
    super(kinectController, peerManager);
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
                // Send to renderer process via IPC
                event.sender.send('color-frame', processedData);

                // Broadcast to peers
                const framePackage = this.createDataPackage('frame', {
                  name: 'color',
                  imagedata: processedData.imagedata,
                });
                this.broadcastFrame('frame', framePackage, true);
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

      // Notify peers that stream has stopped
      if (this.peerManager.isConnected) {
        this.peerManager.broadcast('feed', {
          feed: 'stop',
          type: 'color',
        });
      }
    } catch (error) {
      this.handleError(error, 'stopping color stream');
    }
  }
}
