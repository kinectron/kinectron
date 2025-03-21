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
              ? `width=${processedData.width}, height=${processedData.height}`
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

            // Create a metadata package for the binary data
            const metadataPackage = {
              width: processedData.width,
              height: processedData.height,
              timestamp: Date.now(),
              frameId: frameCount,
              stats: processedData.stats,
              isBinary: true,
            };

            console.log(
              'RawDepthHandler: Created metadata package for frame #' +
                frameCount +
                ':',
              `width=${metadataPackage.width}, height=${metadataPackage.height}, timestamp=${metadataPackage.timestamp}`,
            );

            // First broadcast the metadata
            console.log(
              'RawDepthHandler: Broadcasting rawDepthMetadata event to peers for frame #' +
                frameCount,
            );

            this.peerManager.broadcast(
              'rawDepthMetadata',
              metadataPackage,
              false,
            );

            // Then broadcast the binary data
            console.log(
              'RawDepthHandler: Broadcasting binary rawDepthData for frame #' +
                frameCount +
                ', buffer size:',
              processedData.depthData.buffer.byteLength,
            );

            // Create a copy of the buffer to ensure it's detached
            const depthBuffer =
              processedData.depthData.buffer.slice(0);

            // Create a simplified version of the depth data for JSON transmission
            // Instead of sending the full array, send a downsampled version
            const downsampledData = [];
            const downsampleFactor = 4; // Only send 1/4 of the pixels

            for (
              let y = 0;
              y < processedData.height;
              y += downsampleFactor
            ) {
              for (
                let x = 0;
                x < processedData.width;
                x += downsampleFactor
              ) {
                const index = y * processedData.width + x;
                downsampledData.push(processedData.depthData[index]);
              }
            }

            // Create a simplified metadata package with downsampled data
            const simplifiedPackage = {
              width: Math.ceil(
                processedData.width / downsampleFactor,
              ),
              height: Math.ceil(
                processedData.height / downsampleFactor,
              ),
              timestamp: metadataPackage.timestamp,
              frameId: metadataPackage.frameId,
              stats: metadataPackage.stats,
              downsampleFactor: downsampleFactor,
              rawDepthData: downsampledData,
            };

            // Broadcast the simplified package
            console.log(
              'RawDepthHandler: Broadcasting simplified depth data package',
              `original size: ${processedData.depthData.length}, downsampled size: ${downsampledData.length}`,
            );

            this.peerManager.broadcast(
              'rawDepth',
              simplifiedPackage,
              false,
            );

            // Also broadcast the binary data separately for clients that support it
            this.peerManager.broadcast(
              'rawDepthData',
              depthBuffer,
              true, // Use lossy=true to skip if buffer is full
            );

            // Also broadcast to the renderer process for IPC-based peer connections
            try {
              console.log(
                'RawDepthHandler: Broadcasting via IPC to renderer process',
              );
              // Import BrowserWindow using ES modules
              import('electron')
                .then(({ BrowserWindow }) => {
                  const windows = BrowserWindow.getAllWindows();
                  windows.forEach((window) => {
                    if (!window.isDestroyed()) {
                      // Send metadata
                      window.webContents.send('broadcast-to-peers', {
                        event: 'rawDepthMetadata',
                        data: metadataPackage,
                        lossy: false,
                      });

                      // Send binary data
                      window.webContents.send(
                        'broadcast-binary-to-peers',
                        {
                          event: 'rawDepthData',
                          data: depthBuffer,
                          lossy: true,
                        },
                      );
                    }
                  });
                  console.log(
                    'RawDepthHandler: Successfully sent to renderer process',
                  );
                })
                .catch((error) => {
                  console.error(
                    'RawDepthHandler: Error importing electron:',
                    error,
                  );
                });
            } catch (error) {
              console.error(
                'RawDepthHandler: Error sending to renderer:',
                error,
              );
            }

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
