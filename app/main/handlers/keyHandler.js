// main/handlers/keyHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { KeyFrameProcessor } from '../processors/keyProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

/**
 * Handles key (body segmentation) stream operations and IPC communication
 */
export class KeyStreamHandler extends BaseStreamHandler {
  constructor(kinectController, peerManager) {
    super(kinectController, peerManager);
    this.processor = new KeyFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Create frame callback for processing key frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    this.frameCallback = (data) => {
      if (
        data.colorImageFrame &&
        data.bodyFrame?.bodyIndexMapToColorImageFrame
      ) {
        const processedData = this.processFrame(
          data.colorImageFrame,
          data.bodyFrame.bodyIndexMapToColorImageFrame,
        );

        if (processedData && processedData.imageData) {
          // Process the image with Sharp
          // First, create a raw RGB buffer from the RGBA data
          const width = processedData.imageData.width;
          const height = processedData.imageData.height;
          const rgba = Buffer.from(
            processedData.imageData.data.buffer,
          );

          // Use Sharp to resize and compress the image
          sharp(rgba, {
            raw: {
              width: width,
              height: height,
              channels: 4, // RGBA
            },
          })
            .resize(Math.floor(width / 2), Math.floor(height / 2)) // Resize to half dimensions
            .webp({ quality: 70 }) // Convert to WebP with 70% quality
            .toBuffer()
            .then((compressedBuffer) => {
              // Convert to data URL
              const dataUrl = `data:image/webp;base64,${compressedBuffer.toString(
                'base64',
              )}`;

              // Create a properly structured frame package with compressed data
              const frameData = {
                name: 'key',
                imageData: {
                  // Changed from imagedata to imageData to match renderer expectations
                  data: dataUrl,
                  width: Math.floor(width / 2),
                  height: Math.floor(height / 2),
                },
                timestamp: Date.now(),
              };

              // Send the frame data to renderer
              event.sender.send('key-frame', frameData);

              // Broadcast to peers with the same compressed data
              const framePackage = this.createDataPackage(
                'frame',
                frameData,
              );
              this.broadcastFrame('frame', framePackage, true);
            })
            .catch((err) => {
              console.error(
                'KeyStreamHandler: Error processing image with Sharp:',
                err,
              );
            });
        } else {
          console.error(
            'KeyStreamHandler: Failed to process key frame, processedData is null or missing imageData',
          );
        }
      } else {
        console.warn(
          'KeyStreamHandler: Received frame callback without required data',
        );
      }
    };
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

          // Create frame callback
          this.createFrameCallback(event);

          // Start listening if not in multiframe mode
          if (!this.isMultiFrame) {
            this.kinectController.startListening(this.frameCallback);
          }
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

      // Notify peers that stream has stopped
      if (this.peerManager && this.peerManager.isConnected) {
        this.peerManager.broadcast('feed', {
          feed: 'stop',
          type: 'key',
        });
      }
    } catch (error) {
      this.handleError(error, 'stopping key stream');
    }
  }
}
