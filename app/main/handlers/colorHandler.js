// main/handlers/colorHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { ColorFrameProcessor } from '../processors/colorProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

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
    // Check if handler is already registered
    if (ipcMain.listenerCount('start-color-stream') > 0) {
      console.log(
        'Handler for start-color-stream already registered',
      );
      return;
    }

    console.log(
      'ColorStreamHandler: Setting up IPC handler for start-color-stream',
    );

    ipcMain.handle('start-color-stream', async (event) => {
      console.log(
        'ColorStreamHandler: Received start-color-stream request',
      );
      try {
        console.log('ColorStreamHandler: Calling startStream()');
        const success = await this.startStream();
        console.log(
          'ColorStreamHandler: startStream() returned:',
          success,
        );

        if (success) {
          console.log('ColorStreamHandler: Creating frame callback');
          // Create frame callback
          this.createFrameCallback(event);
          console.log('ColorStreamHandler: Frame callback created');

          // Start listening if not in multiframe mode
          if (!this.isMultiFrame) {
            console.log(
              'ColorStreamHandler: Starting listening for frames',
            );
            this.kinectController.startListening(this.frameCallback);
            console.log('ColorStreamHandler: Listening started');
          }
        }
        return success;
      } catch (error) {
        console.error(
          'ColorStreamHandler: Error in start-color-stream handler:',
          error,
        );
        return this.handleError(error, 'starting color stream');
      }
    });
  }

  /**
   * Create frame callback for processing color frames
   * @param {Electron.IpcMainInvokeEvent} event
   */
  createFrameCallback(event) {
    console.log(
      'ColorStreamHandler: Creating frame callback with event:',
      event,
    );
    console.log('ColorStreamHandler: Event sender:', event.sender);

    this.frameCallback = (data) => {
      console.log(
        'ColorStreamHandler: Frame callback called with data:',
        'has data=',
        !!data,
        'has colorImageFrame=',
        data && !!data.colorImageFrame,
      );

      if (data && data.colorImageFrame) {
        console.log(
          'ColorStreamHandler: Received color frame from Kinect',
          'colorImageFrame size=',
          data.colorImageFrame.length || 'unknown',
        );

        const processedData = this.processFrame(data.colorImageFrame);
        console.log(
          'ColorStreamHandler: Process frame returned:',
          'processedData=',
          !!processedData,
          'has imageData=',
          processedData && !!processedData.imageData,
        );

        if (processedData && processedData.imageData) {
          console.log(
            'ColorStreamHandler: Processed color frame successfully',
            'data type=',
            typeof processedData.imageData.data,
            'is array=',
            Array.isArray(processedData.imageData.data),
            'is Uint8Array=',
            processedData.imageData.data instanceof Uint8Array,
            'is Uint8ClampedArray=',
            processedData.imageData.data instanceof Uint8ClampedArray,
          );
          console.log(
            'ColorStreamHandler: ImageData dimensions:',
            processedData.imageData.width,
            'x',
            processedData.imageData.height,
            'data length=',
            processedData.imageData.data.length,
          );

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

              console.log(
                'ColorStreamHandler: Converted image data to data URL, length:',
                dataUrl.length,
              );

              // Create a properly structured frame package with compressed data
              // Structure imagedata as an object with data property to match client expectations
              const frameData = {
                name: 'color',
                imagedata: {
                  data: dataUrl,
                  width: Math.floor(width / 2),
                  height: Math.floor(height / 2),
                },
                timestamp: Date.now(),
              };

              console.log(
                'ColorStreamHandler: Created frame data:',
                'name=',
                frameData.name,
                'width=',
                frameData.imagedata.width,
                'height=',
                frameData.imagedata.height,
                'data URL length=',
                dataUrl.length,
              );

              // Send to renderer process via IPC
              console.log(
                'ColorStreamHandler: Sending frame to renderer process via IPC with channel "color-frame"',
              );

              // Send the frame data to renderer
              event.sender.send('color-frame', frameData);
              console.log(
                'ColorStreamHandler: Sent frame to renderer process via IPC',
              );

              // Broadcast to peers with the same compressed data
              const framePackage = this.createDataPackage(
                'frame',
                frameData,
              );
              console.log(
                'ColorStreamHandler: Created frame package for peers:',
                'name=',
                framePackage.name,
                'has imagedata=',
                !!framePackage.data.imagedata,
                'timestamp=',
                framePackage.timestamp,
              );

              this.broadcastFrame('frame', framePackage, true);
              console.log(
                'ColorStreamHandler: Broadcasted frame to peers',
              );
            })
            .catch((err) => {
              console.error(
                'ColorStreamHandler: Error processing image with Sharp:',
                err,
              );
            });

          // Processing is now handled in the Sharp promise chain
        } else {
          console.error(
            'ColorStreamHandler: Failed to process color frame, processedData is null or missing imageData',
          );
        }
      } else {
        console.warn(
          'ColorStreamHandler: Received frame callback without colorImageFrame',
        );
      }
    };

    console.log(
      'ColorStreamHandler: Frame callback created successfully',
    );
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
