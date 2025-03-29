// main/handlers/rgbdHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { RGBDFrameProcessor } from '../processors/rgbdProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

/**
 * Handles RGBD stream operations and IPC communication
 */
export class RGBDStreamHandler extends BaseStreamHandler {
  constructor(kinectController, peerManager) {
    super(kinectController, peerManager);
    this.processor = new RGBDFrameProcessor();
    this.frameCallback = null;
    this.depthRange = null;
  }

  /**
   * Create frame callback for processing RGBD frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    this.frameCallback = (data) => {
      if (data.depthImageFrame && data.colorToDepthImageFrame) {
        const processedData = this.processFrame(
          data.depthImageFrame,
          data.colorToDepthImageFrame,
        );

        if (processedData && processedData.imageData) {
          // Process the image with Sharp
          // First, create a raw RGBA buffer from the RGBA data
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
            .resize(width, height) // Keep original dimensions
            .webp({ quality: 100, lossless: true }) // Preserve alpha channel with lossless compression
            .toBuffer()
            .then((compressedBuffer) => {
              // Convert to data URL
              const dataUrl = `data:image/webp;base64,${compressedBuffer.toString(
                'base64',
              )}`;

              // Create a properly structured frame package with compressed data
              const frameData = {
                name: 'rgbd',
                imageData: {
                  data: dataUrl,
                  width: width,
                  height: height,
                },
                timestamp: Date.now(),
              };

              console.log(
                'RGBDStreamHandler: Sending frame to renderer with data:',
                {
                  name: frameData.name,
                  width: frameData.imageData.width,
                  height: frameData.imageData.height,
                  dataType: typeof frameData.imageData.data,
                  dataLength:
                    frameData.imageData.data.substring(0, 50) + '...',
                  timestamp: frameData.timestamp,
                },
              );

              // Send the frame data to renderer with the correct event name
              event.sender.send('rgbd-frame', frameData);

              // Log the frame data being sent to the renderer
              console.log(
                'RGBDStreamHandler: Sending frame to renderer with event name: rgbd-frame',
              );

              // Broadcast to peers with the same compressed data
              const framePackage = this.createDataPackage(
                'frame',
                frameData,
              );
              this.broadcastFrame('frame', framePackage, true);
            })
            .catch((err) => {
              console.error(
                'RGBDStreamHandler: Error processing image with Sharp:',
                err,
              );
            });
        } else {
          console.error(
            'RGBDStreamHandler: Failed to process RGBD frame, processedData is null or missing imageData',
          );
        }
      } else {
        console.warn(
          'RGBDStreamHandler: Received frame callback without required data',
        );
      }
    };
  }

  /**
   * Set up IPC handlers for RGBD stream
   */
  setupHandler() {
    // Check if handler is already registered
    if (ipcMain.listenerCount('start-rgbd-stream') > 0) {
      console.log('Handler for start-rgbd-stream already registered');
      return;
    }

    ipcMain.handle('start-rgbd-stream', async (event) => {
      try {
        console.log(
          'RGBDStreamHandler: Received start-rgbd-stream request',
        );

        // First, ensure any previous tracking is stopped
        if (this.isActive) {
          console.log(
            'RGBDStreamHandler: Stopping previous RGBD stream session',
          );
          await this.stopStream();

          // Wait a bit to avoid ThreadSafeFunction error when switching feeds
          console.log(
            'RGBDStreamHandler: Waiting for resources to be released',
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Start the RGBD stream with a simpler approach based on legacy code
        console.log(
          'RGBDStreamHandler: Starting RGBD stream with options:',
          KinectOptions.RGBD,
        );

        // Start cameras with the right options
        const success = this.kinectController.startRGBDCamera({
          ...KinectOptions.RGBD,
        });

        if (success) {
          console.log(
            'RGBDStreamHandler: RGBD stream started successfully',
          );
          this.isActive = true;

          // Get depth range for processing
          this.depthRange = this.kinectController.getDepthModeRange(
            KinectOptions.RGBD.depth_mode,
          );
          console.log(
            'RGBDStreamHandler: Depth range for current mode:',
            this.depthRange,
          );

          // Create the frame callback
          console.log('RGBDStreamHandler: Creating frame callback');
          this.createFrameCallback(event);

          // Start listening for frames
          if (!this.isMultiFrame) {
            console.log(
              'RGBDStreamHandler: Starting to listen for Kinect frames',
            );
            this.kinectController.startListening(this.frameCallback);
            console.log(
              'RGBDStreamHandler: Successfully started listening for Kinect frames',
            );
          }
        } else {
          console.error(
            'RGBDStreamHandler: Failed to start RGBD stream',
          );
        }

        return success;
      } catch (error) {
        console.error(
          'RGBDStreamHandler: Error in start-rgbd-stream:',
          error,
        );
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
      console.log('RGBDStreamHandler: Stopping RGBD stream');

      // Only try to stop listening if we have a callback
      if (this.frameCallback) {
        try {
          console.log('RGBDStreamHandler: Stopping frame listening');
          await this.kinectController.stopListening();
        } catch (error) {
          console.warn(
            'RGBDStreamHandler: Error stopping listening (may be normal):',
            error.message,
          );
        }
        this.frameCallback = null;
      }

      // Stop cameras
      try {
        console.log('RGBDStreamHandler: Stopping cameras');
        await this.kinectController.stopCameras();
      } catch (error) {
        console.warn(
          'RGBDStreamHandler: Error stopping cameras:',
          error.message,
        );
      }

      this.isActive = false;
      this.depthRange = null;

      // Notify peers that stream has stopped
      if (this.peerManager && this.peerManager.isConnected) {
        console.log(
          'RGBDStreamHandler: Notifying peers that stream has stopped',
        );
        this.peerManager.broadcast('feed', {
          feed: 'stop',
          type: 'rgbd',
        });
      }

      console.log('RGBDStreamHandler: RGBD stream stopped');
    } catch (error) {
      console.error('RGBDStreamHandler: Error in stopStream:', error);
      this.handleError(error, 'stopping RGBD stream');
    }
  }
}
