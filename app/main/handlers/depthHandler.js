// main/handlers/depthHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { DepthFrameProcessor } from '../processors/depthProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

/**
 * Handles depth stream operations and IPC communication
 */
export class DepthStreamHandler extends BaseStreamHandler {
  constructor(kinectController, peerManager) {
    super(kinectController, peerManager);
    this.processor = new DepthFrameProcessor();
    this.frameCallback = null;
    this.depthRange = null;
  }

  /**
   * Create frame callback for processing depth frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    this.depthRange = this.kinectController.getDepthModeRange(
      KinectOptions.DEPTH.depth_mode,
    );

    this.frameCallback = (data) => {
      console.log('DepthStreamHandler: Received frame callback');
      if (data.depthImageFrame) {
        console.log(
          'DepthStreamHandler: Processing depth image frame',
        );
        const processedData = this.processFrame(data.depthImageFrame);

        if (processedData && processedData.imageData) {
          console.log(
            'DepthStreamHandler: Successfully processed depth frame, dimensions:',
            processedData.imageData.width,
            'x',
            processedData.imageData.height,
          );

          // Process the image with Sharp
          const width = processedData.imageData.width;
          const height = processedData.imageData.height;
          const rgba = Buffer.from(
            processedData.imageData.data.buffer,
          );

          console.log(
            'DepthStreamHandler: Processing depth frame with Sharp, buffer size:',
            rgba.length,
            'dimensions:',
            width,
            'x',
            height,
          );

          // Use Sharp to compress the image (keeping full resolution)
          sharp(rgba, {
            raw: {
              width: width,
              height: height,
              channels: 4, // RGBA
            },
          })
            .webp({ quality: 90 }) // Convert to WebP with 90% quality
            .toBuffer()
            .then((compressedBuffer) => {
              console.log(
                'DepthStreamHandler: Successfully compressed depth frame, buffer size:',
                compressedBuffer.length,
              );

              // Convert to data URL
              const dataUrl = `data:image/webp;base64,${compressedBuffer.toString(
                'base64',
              )}`;
              console.log(
                'DepthStreamHandler: Created data URL for depth frame, length:',
                dataUrl.length,
                'starts with:',
                dataUrl.substring(0, 50) + '...',
              );

              // Create a properly structured frame package with compressed data
              const frameData = {
                name: 'depth',
                imagedata: {
                  data: dataUrl,
                  width: width,
                  height: height,
                },
                timestamp: Date.now(),
              };

              // Send the frame data to renderer
              console.log(
                'DepthStreamHandler: Sending depth frame to renderer via IPC',
              );
              event.sender.send('depth-frame', frameData);

              // Broadcast to peers with the same compressed data
              console.log(
                'DepthStreamHandler: Broadcasting depth frame to peers via broadcastFrame',
              );
              const framePackage = this.createDataPackage(
                'frame',
                frameData,
              );
              console.log(
                'DepthStreamHandler: Frame package created:',
                'name:',
                framePackage.name,
                'has data:',
                !!framePackage.data,
                'timestamp:',
                framePackage.timestamp,
              );

              this.broadcastFrame('frame', framePackage, true);
            })
            .catch((err) => {
              console.error(
                'DepthStreamHandler: Error processing image with Sharp:',
                err,
              );
            });
        } else {
          console.error(
            'DepthStreamHandler: Failed to process depth frame, processedData is null or missing imageData',
          );
          if (processedData) {
            console.error(
              'DepthStreamHandler: processedData:',
              processedData,
            );
          }
        }
      } else {
        console.warn(
          'DepthStreamHandler: Received frame callback without depthImageFrame',
        );
        console.warn('DepthStreamHandler: Data received:', data);
      }
    };
  }

  /**
   * Set up IPC handlers for depth stream
   */
  setupHandler() {
    // Check if handler is already registered
    if (ipcMain.listenerCount('start-depth-stream') > 0) {
      console.log(
        'Handler for start-depth-stream already registered',
      );
      return;
    }

    ipcMain.handle('start-depth-stream', async (event) => {
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
