// main/handlers/depthKeyHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { DepthKeyFrameProcessor } from '../processors/depthKeyProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { DEBUG } from '../utils/debug.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

/**
 * Handles depth key stream operations and IPC communication
 */
export class DepthKeyStreamHandler extends BaseStreamHandler {
  constructor(kinectController, peerManager) {
    super(kinectController, peerManager);
    this.processor = new DepthKeyFrameProcessor();
    this.frameCallback = null;
  }

  /**
   * Create frame callback for processing depth key frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    this.frameCallback = (data) => {
      if (
        data.depthImageFrame &&
        data.bodyFrame?.bodyIndexMapImageFrame
      ) {
        const processedData = this.processFrame(
          data.depthImageFrame,
          data.bodyFrame.bodyIndexMapImageFrame,
        );

        if (processedData && processedData.imageData) {
          // Process the image with Sharp using IDENTICAL settings to raw depth
          const width = processedData.imageData.width;
          const height = processedData.imageData.height;
          const rgba = Buffer.from(
            processedData.imageData.data.buffer,
          );

          // Use Sharp with the EXACT SAME settings as raw depth
          sharp(rgba, {
            raw: {
              width: width,
              height: height,
              channels: 4, // RGBA
            },
          })
            .webp({
              quality: 100, // Use highest quality for WebP
              lossless: true, // Force lossless WebP mode
              nearLossless: false, // Disable near lossless mode
              smartSubsample: false, // Disable smart subsampling
              reductionEffort: 6, // Maximum reduction effort (0-6)
            })
            .toBuffer()
            .then((compressedBuffer) => {
              if (DEBUG.RAW_DEPTH && DEBUG.PERFORMANCE) {
                console.log(
                  `DepthKeyStreamHandler: Compressed buffer size: ${compressedBuffer.length} bytes`,
                );
              }

              // Convert to data URL
              const dataUrl = `data:image/webp;base64,${compressedBuffer.toString(
                'base64',
              )}`;

              // Create a frame package with metadata
              const frameData = {
                name: 'depth-key', // Changed from 'depthKey' to 'depth-key' to match client expectations
                imageData: {
                  // Changed from imagedata to imageData to match app.js expectations
                  data: dataUrl,
                  width: width,
                  height: height,
                },
                width: width,
                height: height,
                timestamp: Date.now(),
              };

              // Send the frame data to renderer
              event.sender.send('depth-key-frame', frameData);

              // Broadcast to peers
              this.broadcastFrame('depth-key', frameData, true);
            })
            .catch((err) => {
              console.error(
                'DepthKeyStreamHandler: Error processing image with Sharp:',
                err,
              );
            });
        } else {
          console.error(
            'DepthKeyStreamHandler: Failed to process depth key frame, processedData is null or missing imageData',
          );
        }
      } else {
        console.warn(
          'DepthKeyStreamHandler: Received frame callback without required data',
        );
      }
    };
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
        console.log(
          'DepthKeyStreamHandler: Received start-depth-key-stream request',
        );

        // First, ensure any previous tracking is stopped
        if (this.isActive) {
          console.log(
            'DepthKeyStreamHandler: Stopping previous depth key stream session',
          );
          await this.stopStream();

          // Wait a bit to avoid ThreadSafeFunction error when switching feeds
          console.log(
            'DepthKeyStreamHandler: Waiting for resources to be released',
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        // Start cameras with the right options
        console.log(
          'DepthKeyStreamHandler: Starting depth key stream with options:',
          KinectOptions.DEPTH_KEY,
        );
        const success = this.kinectController.startDepthKeyCamera({
          ...KinectOptions.DEPTH_KEY,
        });

        if (success) {
          console.log(
            'DepthKeyStreamHandler: Depth key stream started successfully',
          );
          this.isActive = true;

          // Wait for body tracker to initialize
          console.log(
            'DepthKeyStreamHandler: Waiting for body tracker to initialize',
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Create the frame callback
          console.log(
            'DepthKeyStreamHandler: Creating frame callback',
          );
          this.createFrameCallback(event);

          // Start listening for frames
          if (!this.isMultiFrame) {
            console.log(
              'DepthKeyStreamHandler: Starting to listen for Kinect frames',
            );
            this.kinectController.startListening(this.frameCallback);
            console.log(
              'DepthKeyStreamHandler: Successfully started listening for Kinect frames',
            );
          }
        } else {
          console.error(
            'DepthKeyStreamHandler: Failed to start depth key stream',
          );
        }

        return success;
      } catch (error) {
        console.error(
          'DepthKeyStreamHandler: Error in start-depth-key-stream:',
          error,
        );
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
      console.log('DepthKeyStreamHandler: startStream called');

      // Start cameras with the right options
      const success = this.kinectController.startDepthKeyCamera({
        ...KinectOptions.DEPTH_KEY,
      });

      if (success) {
        console.log(
          'DepthKeyStreamHandler: Depth key camera started successfully',
        );
        this.isActive = true;
      } else {
        console.error(
          'DepthKeyStreamHandler: Failed to start depth key camera',
        );
      }

      return success;
    } catch (error) {
      console.error(
        'DepthKeyStreamHandler: Error in startStream:',
        error,
      );
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
      console.log('DepthKeyStreamHandler: Stopping depth key stream');

      // Only try to stop listening if we have a callback
      if (this.frameCallback) {
        try {
          console.log(
            'DepthKeyStreamHandler: Stopping frame listening',
          );
          await this.kinectController.stopListening();
        } catch (error) {
          console.warn(
            'DepthKeyStreamHandler: Error stopping listening (may be normal):',
            error.message,
          );
        }
        this.frameCallback = null;
      }

      // Stop cameras
      try {
        console.log('DepthKeyStreamHandler: Stopping cameras');
        await this.kinectController.stopCameras();
      } catch (error) {
        console.warn(
          'DepthKeyStreamHandler: Error stopping cameras:',
          error.message,
        );
      }

      this.isActive = false;

      // Notify peers that stream has stopped
      if (this.peerManager && this.peerManager.isConnected) {
        console.log(
          'DepthKeyStreamHandler: Notifying peers that stream has stopped',
        );
        this.peerManager.broadcast('feed', {
          feed: 'stop',
          type: 'depth-key',
        });
      }

      console.log('DepthKeyStreamHandler: Depth key stream stopped');
    } catch (error) {
      console.error(
        'DepthKeyStreamHandler: Error in stopStream:',
        error,
      );
      this.handleError(error, 'stopping depth key stream');
    }
  }
}
