// main/handlers/rawDepthHandler.js
import { ipcMain } from 'electron';
import { BaseStreamHandler } from './baseHandler.js';
import { RawDepthFrameProcessor } from '../processors/rawDepthProcessor.js';
import { KinectOptions } from '../kinectController.js';
import { testPackUnpack } from '../utils/dataTestUtils.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');

// Function to estimate the size of an object in memory
function roughSizeOfObject(object) {
  const objectList = [];
  const stack = [object];
  let bytes = 0;

  while (stack.length) {
    const value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (
      typeof value === 'object' &&
      value !== null &&
      objectList.indexOf(value) === -1
    ) {
      objectList.push(value);

      for (const i in value) {
        if (Object.prototype.hasOwnProperty.call(value, i)) {
          stack.push(value[i]);
        }
      }
    }
  }
  return bytes;
}

// Function to calculate various size metrics for data
function calculateDataSize(data) {
  // Get the in-memory size estimate
  const inMemorySize = roughSizeOfObject(data);

  // Get the serialized size (what actually gets transmitted)
  const serializedSize = JSON.stringify(data).length;

  // If there's binary data (like a Buffer), get its size too
  let binarySize = 0;
  if (data.imagedata && typeof data.imagedata === 'string') {
    // For data URLs, count the length of the string
    binarySize = data.imagedata.length;
  } else if (
    data.imagedata &&
    data.imagedata.data instanceof Buffer
  ) {
    binarySize = data.imagedata.data.length;
  }

  return {
    inMemorySize,
    serializedSize,
    binarySize,
    totalSize: serializedSize, // This is what matters for transmission
  };
}

// Flags to enable/disable tests
const ENABLE_WEBP_TEST = false;
const ENABLE_COMPRESSION_COMPARISON = false;

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
            .webp({
              quality: 100, // Use highest quality for WebP
              lossless: true, // Force lossless WebP mode
            })
            .toBuffer()
            .then((compressedBuffer) => {
              // Log the size of the compressed buffer
              console.log(
                `Compressed buffer size: ${compressedBuffer.length} bytes`,
              );

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
                // Include test values if they exist
                ...(processedData.imageData.testValues && {
                  testValues: processedData.imageData.testValues,
                }),
              };

              // Calculate and log the size information
              const sizeInfo = calculateDataSize(frameData);
              console.log('Raw Depth Frame Size Information:');
              console.log(
                `  In-memory estimate: ${sizeInfo.inMemorySize} bytes`,
              );
              console.log(
                `  Serialized size: ${sizeInfo.serializedSize} bytes`,
              );
              console.log(
                `  Binary data size: ${sizeInfo.binarySize} bytes`,
              );
              console.log(
                `  Total transmission size: ${sizeInfo.totalSize} bytes`,
              );

              // Log the size of the JSON message
              const jsonSize = JSON.stringify(frameData).length;
              console.log(`JSON message size: ${jsonSize} bytes`);

              // Run compression comparison test if enabled
              if (ENABLE_COMPRESSION_COMPARISON) {
                console.log(
                  'Running WebP lossless vs lossy comparison...',
                );

                // Create promises for both compression methods
                const losslessWebpPromise = sharp(rgba, {
                  raw: {
                    width: width,
                    height: height,
                    channels: 4,
                  },
                })
                  .webp({
                    quality: 100,
                    lossless: true,
                  })
                  .toBuffer();

                const lossyWebpPromise = sharp(rgba, {
                  raw: {
                    width: width,
                    height: height,
                    channels: 4,
                  },
                })
                  .webp({
                    quality: 100,
                    lossless: false,
                  })
                  .toBuffer();

                // Wait for both to complete
                Promise.all([losslessWebpPromise, lossyWebpPromise])
                  .then(([losslessBuffer, lossyBuffer]) => {
                    // Calculate sizes
                    const losslessSize = losslessBuffer.length;
                    const lossySize = lossyBuffer.length;
                    const sizeDiff = losslessSize - lossySize;
                    const percentDiff = (
                      (sizeDiff / losslessSize) *
                      100
                    ).toFixed(2);

                    console.log(
                      'WebP Compression Comparison Results:',
                    );
                    console.log(
                      `WebP (lossless) size: ${losslessSize} bytes`,
                    );
                    console.log(
                      `WebP (lossy, quality 100) size: ${lossySize} bytes`,
                    );
                    console.log(
                      `Difference: ${sizeDiff} bytes (${percentDiff}% ${
                        lossySize < losslessSize
                          ? 'smaller'
                          : 'larger'
                      })`,
                    );
                  })
                  .catch((err) => {
                    console.error(
                      'Error in WebP compression comparison test:',
                      err,
                    );
                  });
              }

              // Test WebP compression if enabled
              if (
                ENABLE_WEBP_TEST &&
                processedData.imageData.testValues
              ) {
                console.log('Running WebP compression test...');

                // Decode the WebP buffer back to raw pixels
                sharp(compressedBuffer)
                  .raw()
                  .toBuffer({ resolveWithObject: true })
                  .then(({ data, info }) => {
                    // Create test indices object from the test values
                    const testIndices = {
                      1000: processedData.imageData.testValues
                        .index1000,
                      2000: processedData.imageData.testValues
                        .index2000,
                      3000: processedData.imageData.testValues
                        .index3000,
                    };

                    const dimensions = {
                      originalWidth:
                        processedData.imageData.originalWidth,
                      packedWidth: width,
                      height: height,
                    };

                    // We need to create a mock "original data" array with just the test values
                    // since we don't have the full original array
                    const mockOriginalData = new Uint16Array(
                      processedData.imageData.originalWidth * height,
                    );
                    mockOriginalData[1000] = testIndices[1000];
                    mockOriginalData[2000] = testIndices[2000];
                    mockOriginalData[3000] = testIndices[3000];

                    console.log(
                      'WebP compression test - testing values:',
                      testIndices,
                    );

                    // Test unpacking the WebP-compressed data
                    const results = testPackUnpack(
                      mockOriginalData,
                      new Uint8ClampedArray(data),
                      dimensions,
                      testIndices,
                      true, // log results
                    );

                    console.log('WebP compression test complete');
                  })
                  .catch((err) => {
                    console.error(
                      'Error in WebP compression test:',
                      err,
                    );
                  });
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
