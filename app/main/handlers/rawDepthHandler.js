// main/handlers/rawDepthHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { RawDepthFrameProcessor } from '../processors/rawDepthProcessor.js';
import { KinectOptions } from '../kinectController.js';

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
  /**
   * Helper function to convert a Blob to a data URL
   * @param {Blob} blob - The blob to convert
   * @returns {Promise<string>} A promise that resolves to the data URL
   */
  blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

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

          if (processedData) {
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

            // Create a canvas to render the depth data for WebP compression
            console.log(
              'RawDepthHandler: Creating canvas for WebP compression for frame #' +
                frameCount,
            );

            // Create a canvas in memory
            const canvas = new OffscreenCanvas(
              processedData.imageData.width,
              processedData.imageData.height,
            );
            const ctx = canvas.getContext('2d');

            // Create ImageData from the processed data
            const imgData = new ImageData(
              processedData.imageData.data,
              processedData.imageData.width,
              processedData.imageData.height,
            );

            // Put the image data on the canvas
            ctx.putImageData(imgData, 0, 0);

            // Convert to WebP data URL with lossless compression (quality=1.0)
            const blob = await canvas.convertToBlob({
              type: 'image/webp',
              quality: 1.0,
            });
            const dataUrl = await this.blobToDataURL(blob);

            console.log(
              'RawDepthHandler: WebP data URL created for frame #' +
                frameCount,
              'length:',
              dataUrl.length,
            );

            // Create a data package for broadcasting
            console.log(
              'RawDepthHandler: Creating data package for broadcasting frame #' +
                frameCount,
            );

            // Package the data for transmission
            const dataPackage = this.createDataPackage('rawDepth', {
              // Send the WebP data URL
              imagedata: dataUrl,
              width: processedData.imageData.width,
              height: processedData.imageData.height,
              timestamp: Date.now(),
            });

            console.log(
              'RawDepthHandler: Data package created for frame #' +
                frameCount +
                ':',
              `name=${
                dataPackage.name
              }, has data=${!!dataPackage.data}, timestamp=${
                dataPackage.timestamp
              }`,
            );
            console.log(
              'RawDepthHandler: Data dimensions:',
              `width=${dataPackage.data.width}, height=${dataPackage.data.height}`,
            );

            // Log data URL length for debugging
            console.log(
              'RawDepthHandler: Data URL length:',
              dataUrl.length,
            );

            // Broadcast to peers with lossy=true (like in legacy code)
            console.log(
              'RawDepthHandler: Broadcasting rawDepth event to peers for frame #' +
                frameCount,
            );
            this.broadcastFrame('rawDepth', dataPackage, true);
            broadcastFrameCount++;
            console.log(
              'RawDepthHandler: Broadcast complete for frame #' +
                frameCount,
            );
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
