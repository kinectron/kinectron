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
    console.log('RawDepthHandler: Creating frame callback');
    console.log(
      'RawDepthHandler: Event sender:',
      event.sender ? 'available' : 'null',
    );

    // Track frame statistics
    let frameCount = 0;
    let lastLogTime = Date.now();
    let processedFrameCount = 0;
    let broadcastFrameCount = 0;
    let errorFrameCount = 0;

    this.frameCallback = async (data) => {
      // Increment frame counter
      frameCount++;

      console.log(
        'RawDepthHandler: Frame callback received data:',
        data
          ? `has depthImageFrame=${!!data.depthImageFrame}, frame #${frameCount}`
          : 'null',
      );

      if (data.depthImageFrame) {
        console.log(
          'RawDepthHandler: Processing depth image frame #' +
            frameCount,
        );
        console.log(
          'RawDepthHandler: Depth frame dimensions:',
          data.depthImageFrame.width_pixels,
          'x',
          data.depthImageFrame.height_pixels,
        );
        console.log(
          'RawDepthHandler: Depth frame buffer size:',
          data.depthImageFrame.imageData?.buffer?.byteLength ||
            'unknown',
        );
        console.log(
          'RawDepthHandler: Depth frame format:',
          data.depthImageFrame.format,
        );

        // Check if this is a raw depth frame (DEPTH16 format)
        if (data.depthImageFrame.format === 1) {
          // DEPTH16
          console.log(
            'RawDepthHandler: Raw depth frame detected (DEPTH16 format)',
          );

          // Log sample depth values for debugging
          if (data.depthImageFrame.imageData?.buffer) {
            const depthData = new Uint16Array(
              data.depthImageFrame.imageData.buffer,
            );
            const sampleValues = [];
            for (let i = 0; i < Math.min(5, depthData.length); i++) {
              sampleValues.push(depthData[i]);
            }
            console.log(
              'RawDepthHandler: Sample depth values:',
              sampleValues,
            );
          }
        }

        try {
          console.log(
            'RawDepthHandler: Calling processFrame on frame #' +
              frameCount,
          );
          const processedData = this.processFrame(
            data.depthImageFrame,
          );
          processedFrameCount++;

          console.log(
            'RawDepthHandler: Processed data for frame #' +
              frameCount +
              ':',
            processedData
              ? `width=${processedData.imageData.width}, height=${processedData.imageData.height}`
              : 'null',
          );

          if (processedData && processedData.imageData) {
            // Send to renderer process
            console.log(
              'RawDepthHandler: Sending raw-depth-frame to renderer process for frame #' +
                frameCount,
            );

            if (event.sender) {
              event.sender.send('raw-depth-frame', processedData);
              console.log(
                'RawDepthHandler: Successfully sent to renderer process',
              );
            } else {
              console.error(
                'RawDepthHandler: No event sender available',
              );
            }

            // Process the image with Sharp
            const width = processedData.imageData.width;
            const height = processedData.imageData.height;
            const rgba = Buffer.from(
              processedData.imageData.data.buffer,
            );

            console.log(
              'RawDepthHandler: Processing raw depth frame with Sharp, buffer size:',
              rgba.length,
              'dimensions:',
              width,
              'x',
              height,
            );

            // Use Sharp to compress the image
            sharp(rgba, {
              raw: {
                width: width,
                height: height,
                channels: 4, // RGBA
              },
            })
              .webp({ quality: 100 }) // Use high quality to preserve depth data
              .toBuffer()
              .then((compressedBuffer) => {
                console.log(
                  'RawDepthHandler: Successfully compressed raw depth frame, buffer size:',
                  compressedBuffer.length,
                );

                // Convert to data URL
                const dataUrl = `data:image/webp;base64,${compressedBuffer.toString(
                  'base64',
                )}`;
                console.log(
                  'RawDepthHandler: Created data URL for raw depth frame, length:',
                  dataUrl.length,
                  'starts with:',
                  dataUrl.substring(0, 50) + '...',
                );

                // Create a properly structured frame package with compressed data for renderer
                const rendererFrameData = {
                  name: 'rawDepth',
                  imagedata: {
                    data: dataUrl,
                    width: width,
                    height: height,
                  },
                  timestamp: Date.now(),
                  stats: processedData.stats,
                };

                // Send the frame data to renderer
                console.log(
                  'RawDepthHandler: Sending raw depth frame to renderer via IPC',
                );
                event.sender.send(
                  'raw-depth-frame-image',
                  rendererFrameData,
                );

                // Create a different structure for broadcasting to peers
                // This structure should match what baseHandler.js expects
                const broadcastData = {
                  imagedata: dataUrl, // Direct string, not an object
                  width: width,
                  height: height,
                  stats: processedData.stats,
                };

                // Broadcast to peers with the same compressed data
                console.log(
                  'RawDepthHandler: Broadcasting raw depth frame to peers',
                );
                const framePackage = this.createDataPackage(
                  'rawDepth',
                  broadcastData,
                );
                console.log(
                  'RawDepthHandler: Frame package created:',
                  'name:',
                  framePackage.name,
                  'has data:',
                  !!framePackage.data,
                  'timestamp:',
                  framePackage.timestamp,
                );

                this.broadcastFrame('rawDepth', framePackage, true);

                broadcastFrameCount++;
                console.log(
                  'RawDepthHandler: Broadcast complete for frame #' +
                    frameCount,
                );
              })
              .catch((err) => {
                console.error(
                  'RawDepthHandler: Error processing image with Sharp:',
                  err,
                );
                errorFrameCount++;
              });
          } else {
            console.error(
              'RawDepthHandler: Failed to process depth frame #' +
                frameCount,
            );
            errorFrameCount++;
          }
        } catch (error) {
          console.error(
            'RawDepthHandler: Error processing frame #' +
              frameCount +
              ':',
            error,
          );
          errorFrameCount++;
        }
      } else {
        console.warn(
          'RawDepthHandler: Received frame #' +
            frameCount +
            ' without depth image data',
        );
        errorFrameCount++;
      }

      // Log statistics every 5 seconds
      const now = Date.now();
      if (now - lastLogTime >= 5000) {
        console.log(
          `RawDepthHandler: Frame stats (5s): ${frameCount} total, ${processedFrameCount} processed, ${broadcastFrameCount} broadcast, ${errorFrameCount} errors`,
        );

        // Reset counters
        frameCount = 0;
        processedFrameCount = 0;
        broadcastFrameCount = 0;
        errorFrameCount = 0;
        lastLogTime = now;
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
