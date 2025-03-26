// main/handlers/rawDepthHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { RawDepthFrameProcessor } from '../processors/rawDepthProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

/**
 * Handles raw depth stream operations and IPC communication
 */
export class RawDepthStreamHandler extends BaseStreamHandler {
  constructor(kinectController, peerManager) {
    super(kinectController, peerManager);
    this.processor = new RawDepthFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Create frame callback for processing raw depth frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    this.frameCallback = (data) => {
      if (data.depthImageFrame) {
        const processedData = this.processFrame(data.depthImageFrame);

        if (processedData && processedData.imageData) {
          // Process the image with Sharp
          const width = processedData.imageData.width;
          const height = processedData.imageData.height;
          const rgba = Buffer.from(
            processedData.imageData.data.buffer,
          );

          // Use Sharp to compress the image (no resizing)
          sharp(rgba, {
            raw: {
              width: width,
              height: height,
              channels: 4, // RGBA
            },
          })
            .webp({ quality: 100 }) // Use highest quality for WebP
            .toBuffer()
            .then((compressedBuffer) => {
              // Convert to data URL
              const dataUrl = `data:image/webp;base64,${compressedBuffer.toString(
                'base64',
              )}`;

              // Create a frame package with metadata about the packed format
              const frameData = {
                name: 'rawDepth',
                imagedata: dataUrl,
                isPacked: processedData.imageData.isPacked,
                originalWidth: processedData.imageData.originalWidth,
                width: width,
                height: height,
                testValues: processedData.imageData.testValues, // Pass test values to client
              };

              // Log the test values being sent to client
              if (processedData.imageData.testValues) {
                console.log(
                  'Sending test values to client:',
                  processedData.imageData.testValues,
                );
              }

              // Send the frame data to renderer
              event.sender.send('raw-depth-frame', frameData);

              // Broadcast to peers directly without additional wrapping
              this.broadcastFrame('rawDepth', frameData, true);
            })
            .catch((err) => {
              console.error(
                'RawDepthStreamHandler: Error processing image with Sharp:',
                err,
              );
            });
        } else {
          console.error(
            'RawDepthStreamHandler: Failed to process raw depth frame, processedData is null or missing imageData',
          );
        }
      } else {
        console.warn(
          'RawDepthStreamHandler: Received frame callback without depthImageFrame',
        );
      }
    };
  }

  /**
   * Set up IPC handlers for raw depth stream
   */
  setupHandler() {
    // Check if handler is already registered
    if (ipcMain.listenerCount('start-raw-depth-stream') > 0) {
      console.log(
        'Handler for start-raw-depth-stream already registered',
      );
      return;
    }

    ipcMain.handle('start-raw-depth-stream', async (event) => {
      try {
        const success = await this.startStream();
        if (success) {
          this.createFrameCallback(event);
          if (!this.isMultiFrame) {
            this.kinectController.startListening(this.frameCallback);
          }
        }
        return success;
      } catch (error) {
        return this.handleError(error, 'starting raw depth stream');
      }
    });
  }

  /**
   * Process a raw depth frame
   * @param {Object} frame Raw depth frame data
   * @returns {Object} Processed frame data
   */
  processFrame(frame) {
    return this.processor.processFrame(frame);
  }

  /**
   * Start the raw depth stream
   * @returns {Promise<boolean>} Success status
   */
  async startStream() {
    try {
      const success = this.kinectController.startRawDepthCamera({
        ...KinectOptions.RAW_DEPTH,
      });

      if (success) {
        this.isActive = true;
      }

      return success;
    } catch (error) {
      return this.handleError(error, 'starting raw depth camera');
    }
  }

  /**
   * Get the IPC handler name for this stream
   * @protected
   * @returns {string} The handler name
   */
  getHandlerName() {
    return 'start-raw-depth-stream';
  }

  /**
   * Stop the raw depth stream
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
      this.handleError(error, 'stopping raw depth stream');
    }
  }
}
