import { PeerConnection } from './peer/peerConnection.js';
import { NgrokClientState } from './peer/ngrokState.js';

export class Kinectron {
  constructor(networkConfig) {
    this.peer = new PeerConnection(networkConfig);
    this.messageHandlers = new Map();
    this.state = null;

    // Set up event handlers
    this.peer.on('ready', (data) => {
      this.state = data.state;
      const handler = this.messageHandlers.get('ready');
      if (handler) handler(data);
    });

    this.peer.on('error', (error) => {
      const handler = this.messageHandlers.get('error');
      if (handler) handler(error);
    });

    // Handle state changes
    this.peer.on('stateChange', (data) => {
      this.state = data.to;
      const handler = this.messageHandlers.get('stateChange');
      if (handler) handler(data);
    });

    // Handle metrics updates
    this.peer.on('metrics', (data) => {
      const handler = this.messageHandlers.get('metrics');
      if (handler) handler(data);
    });

    // Handle incoming data
    this.peer.on('data', (data) => {
      console.log('Kinectron: Received data event:', data);
      const { event, data: eventData } = data;
      const handler = this.messageHandlers.get(event);

      if (handler) {
        console.log('Kinectron: Found handler for event:', event);
        handler(eventData);
      } else {
        console.warn('Kinectron: No handler found for event:', event);

        // Special handling for rawDepth events
        if (event === 'rawDepth') {
          console.log(
            'Kinectron: Handling rawDepth event without registered handler',
          );
          const rawDepthHandler =
            this.messageHandlers.get('rawDepth');
          if (rawDepthHandler) {
            console.log(
              'Kinectron: Found rawDepth handler, calling it',
            );
            rawDepthHandler(eventData);
          } else {
            console.error(
              'Kinectron: No rawDepth handler registered',
            );
          }
        }
      }
    });

    // Forward rawDepthMetadata events from peer to Kinectron handlers
    this.peer.on('rawDepthMetadata', (metadata) => {
      console.log(
        'Kinectron: Forwarding rawDepthMetadata event from peer',
      );
      const handler = this.messageHandlers.get('rawDepthMetadata');
      if (handler) {
        console.log(
          'Kinectron: Found rawDepthMetadata handler, calling it',
        );
        handler(metadata);
      } else {
        console.warn(
          'Kinectron: No rawDepthMetadata handler registered',
        );
      }
    });

    // Forward rawDepthData events from peer to Kinectron handlers
    this.peer.on('rawDepthData', (binaryData) => {
      console.log(
        'Kinectron: Forwarding rawDepthData event from peer',
      );
      const handler = this.messageHandlers.get('rawDepthData');
      if (handler) {
        console.log(
          'Kinectron: Found rawDepthData handler, calling it',
        );
        handler(binaryData);
      } else {
        console.warn('Kinectron: No rawDepthData handler registered');
      }
    });
  }

  // Event registration
  on(event, callback) {
    console.log('Kinectron: Registering handler for event:', event);
    this.messageHandlers.set(event, callback);
  }

  // Get current state
  getState() {
    return this.peer.getState();
  }

  // Check if connected
  isConnected() {
    return this.state === NgrokClientState.STATES.CONNECTED;
  }

  // Set Kinect type (azure or windows)
  setKinectType(kinectType) {
    if (!this.isConnected()) {
      console.warn('Cannot set Kinect type: not connected');
      return;
    }
    this.send('setkinect', kinectType);
  }

  // Initialize Kinect
  initKinect(callback) {
    if (!this.isConnected()) {
      console.warn('Cannot initialize Kinect: not connected');
      return Promise.reject(
        new Error('Cannot initialize Kinect: not connected'),
      );
    }

    // Create a promise that resolves when we get the kinectInitialized event
    const initPromise = new Promise((resolve, reject) => {
      // Set up a one-time handler for the initialization response
      const handler = (data) => {
        // Normalize the success value to handle nested structure
        let isSuccess = false;
        if (
          data.success &&
          typeof data.success === 'object' &&
          data.success.success === true
        ) {
          isSuccess = true;
        } else if (
          typeof data.success === 'boolean' &&
          data.success === true
        ) {
          isSuccess = true;
        }

        // Create a normalized result object
        const normalizedResult = {
          success: isSuccess,
          alreadyInitialized: !!data.alreadyInitialized,
          error: data.error || null,
          rawData: data, // Include the original data for debugging
        };

        if (isSuccess || data.alreadyInitialized) {
          resolve(normalizedResult);
        } else {
          reject(
            new Error(data.error || 'Failed to initialize Kinect'),
          );
        }

        // Remove the handler after it's been called
        this.messageHandlers.delete('kinectInitialized');
      };

      this.messageHandlers.set('kinectInitialized', handler);

      // Send initialization request to server
      this.send('initkinect', {});
    });

    // For backward compatibility, if a callback is provided, use it
    if (callback) {
      initPromise
        .then((data) => callback(data))
        .catch((error) =>
          callback({ success: false, error: error.message }),
        );
    }

    // Return the promise for modern Promise-based usage
    return initPromise;
  }

  // Send data to peer
  send(event, data) {
    if (!this.isConnected()) {
      console.warn('Cannot send data: not connected');
      return;
    }
    this.peer.send(event, data);
  }

  // Start feed methods
  startColor(callback) {
    if (callback) {
      // Set up frame handler to process color frames
      this.messageHandlers.set('frame', (data) => {
        // Extract the actual frame data
        const frameData = data.data || data;

        // Only process frames with name 'color'
        if (frameData.name === 'color' && frameData.imagedata) {
          // Create a canvas to convert image data to a data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = frameData.imagedata;

          canvas.width = width;
          canvas.height = height;

          try {
            // Check if data is a string (data URL)
            if (typeof frameData.imagedata.data === 'string') {
              // Create an image from the data URL
              const img = new Image();
              img.onload = () => {
                // Draw the image to the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Use the original data URL
                const src = frameData.imagedata.data;

                // Call the user callback with processed frame
                callback({
                  src,
                  width,
                  height,
                  raw: frameData.imagedata,
                  timestamp: frameData.timestamp || Date.now(),
                });
              };

              // Set error handler
              img.onerror = (err) => {
                console.error(
                  'Kinectron: Error loading image from data URL:',
                  err,
                );
                // Try to call callback anyway with the raw data
                callback({
                  src: frameData.imagedata.data,
                  width,
                  height,
                  raw: frameData.imagedata,
                  timestamp: frameData.timestamp || Date.now(),
                });
              };

              // Start loading the image
              img.src = frameData.imagedata.data;

              // Return early - callback will be called from onload handler
              return;
            } else {
              // Original code for handling raw pixel data
              // Ensure we have a Uint8ClampedArray
              let pixelData;
              if (
                frameData.imagedata.data instanceof Uint8ClampedArray
              ) {
                pixelData = frameData.imagedata.data;
              } else if (
                frameData.imagedata.data instanceof Uint8Array
              ) {
                pixelData = new Uint8ClampedArray(
                  frameData.imagedata.data,
                );
              } else if (Array.isArray(frameData.imagedata.data)) {
                pixelData = new Uint8ClampedArray(
                  frameData.imagedata.data,
                );
              } else {
                // Handle case where data is an object (e.g., from JSON)
                pixelData = new Uint8ClampedArray(
                  Object.values(frameData.imagedata.data),
                );
              }

              const imgData = new ImageData(pixelData, width, height);

              // Put the image data on the canvas
              ctx.putImageData(imgData, 0, 0);

              // Convert to data URL for easy display
              const src = canvas.toDataURL('image/jpeg');

              // Call the user callback with processed frame
              callback({
                src,
                width,
                height,
                raw: frameData.imagedata,
                timestamp: frameData.timestamp || Date.now(),
              });
            }
          } catch (error) {
            console.error(
              'Kinectron: Error processing color frame:',
              error,
            );
            console.error(
              'Kinectron: Frame data:',
              frameData.imagedata,
            );
          }
        } else {
          console.warn(
            "Kinectron: Received frame event but it's not a valid color frame:",
            'name=',
            frameData.name,
            'has imagedata=',
            !!frameData.imagedata,
          );
        }
      });
    }
    this.send('feed', { feed: 'color' });
  }

  startDepth(callback) {
    console.log('Kinectron: startDepth called');
    if (callback) {
      console.log(
        'Kinectron: Setting up frame handler for depth frames',
      );
      // Set up frame handler to process depth frames
      this.messageHandlers.set('frame', (data) => {
        console.log('Kinectron: Received frame event:', data);

        // Extract the actual frame data
        const frameData = data.data || data;
        console.log(
          'Kinectron: Frame data extracted:',
          frameData
            ? `name=${
                frameData.name
              }, has imagedata=${!!frameData.imagedata}`
            : 'null',
        );

        // Only process frames with name 'depth'
        if (frameData.name === 'depth' && frameData.imagedata) {
          console.log(
            'Kinectron: Processing depth frame with dimensions:',
            frameData.imagedata.width,
            'x',
            frameData.imagedata.height,
          );

          // Create a canvas to convert image data to a data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = frameData.imagedata;

          canvas.width = width;
          canvas.height = height;

          try {
            // Check if data is a string (data URL)
            if (typeof frameData.imagedata.data === 'string') {
              console.log(
                'Kinectron: Received depth frame with data URL',
              );
              // Create an image from the data URL
              const img = new Image();
              img.onload = () => {
                console.log(
                  'Kinectron: Depth image loaded successfully',
                );
                // Draw the image to the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Use the original data URL
                const src = frameData.imagedata.data;

                // Call the user callback with processed frame
                console.log(
                  'Kinectron: Calling user callback with processed depth frame',
                );
                callback({
                  src,
                  width,
                  height,
                  raw: frameData.imagedata,
                  timestamp: frameData.timestamp || Date.now(),
                });
              };

              // Set error handler
              img.onerror = (err) => {
                console.error(
                  'Kinectron: Error loading depth image from data URL:',
                  err,
                );
                // Try to call callback anyway with the raw data
                console.log(
                  'Kinectron: Calling user callback with raw data due to image load error',
                );
                callback({
                  src: frameData.imagedata.data,
                  width,
                  height,
                  raw: frameData.imagedata,
                  timestamp: frameData.timestamp || Date.now(),
                });
              };

              // Start loading the image
              console.log('Kinectron: Setting image src to data URL');
              img.src = frameData.imagedata.data;

              // Return early - callback will be called from onload handler
              return;
            } else {
              console.log(
                'Kinectron: Received depth frame with raw pixel data',
              );
              // Original code for handling raw pixel data
              // Ensure we have a Uint8ClampedArray
              let pixelData;
              if (
                frameData.imagedata.data instanceof Uint8ClampedArray
              ) {
                pixelData = frameData.imagedata.data;
              } else if (
                frameData.imagedata.data instanceof Uint8Array
              ) {
                pixelData = new Uint8ClampedArray(
                  frameData.imagedata.data,
                );
              } else if (Array.isArray(frameData.imagedata.data)) {
                pixelData = new Uint8ClampedArray(
                  frameData.imagedata.data,
                );
              } else {
                // Handle case where data is an object (e.g., from JSON)
                pixelData = new Uint8ClampedArray(
                  Object.values(frameData.imagedata.data),
                );
              }

              const imgData = new ImageData(pixelData, width, height);

              // Put the image data on the canvas
              ctx.putImageData(imgData, 0, 0);

              // Convert to data URL for easy display
              const src = canvas.toDataURL('image/jpeg');

              // Call the user callback with processed frame
              callback({
                src,
                width,
                height,
                raw: frameData.imagedata,
                timestamp: frameData.timestamp || Date.now(),
              });
            }
          } catch (error) {
            console.error(
              'Kinectron: Error processing depth frame:',
              error,
            );
            console.error(
              'Kinectron: Frame data:',
              frameData.imagedata,
            );
          }
        } else {
          console.warn(
            "Kinectron: Received frame event but it's not a valid depth frame:",
            'name=',
            frameData.name,
            'has imagedata=',
            !!frameData.imagedata,
          );
        }
      });
    }
    this.send('feed', { feed: 'depth' });
  }

  /**
   * Process raw depth data from a data URL
   * @param {string} dataUrl - The data URL containing the raw depth image
   * @param {number} width - The width of the depth image
   * @param {number} height - The height of the depth image
   * @returns {Promise<number[]>} - A promise that resolves to an array of depth values
   */
  async processRawDepth(dataUrl, width, height) {
    console.log('Kinectron: Processing raw depth data from data URL');

    try {
      // Create a blob from the data URL
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Create an ImageBitmap
      console.log('Kinectron: Creating ImageBitmap from blob');
      const imageBitmap = await createImageBitmap(blob);

      // Draw to an OffscreenCanvas
      console.log('Kinectron: Drawing to OffscreenCanvas');
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0);

      // Get the image data
      console.log('Kinectron: Getting image data');
      const imageData = ctx.getImageData(0, 0, width, height);
      const processedData = [];

      // Extract depth values from R and G channels
      console.log('Kinectron: Extracting depth values');
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Reconstruct 16-bit depth value from R and G channels
        const depth =
          (imageData.data[i + 1] << 8) | imageData.data[i];
        processedData.push(depth);
      }

      console.log(
        'Kinectron: Depth data extracted, length:',
        processedData.length,
      );

      // Log some sample depth values for debugging
      const sampleValues = [];
      for (let i = 0; i < Math.min(5, processedData.length); i++) {
        sampleValues.push(processedData[i]);
      }
      console.log('Kinectron: Sample depth values:', sampleValues);

      return processedData;
    } catch (error) {
      console.error(
        'Kinectron: Error processing raw depth data:',
        error,
      );
      throw error;
    }
  }

  /**
   * Create a visualization of the depth data
   * @param {number[]} depthData - Array of depth values
   * @param {number} width - Width of the depth image
   * @param {number} height - Height of the depth image
   * @returns {string} - Data URL of the visualization
   */
  createDepthVisualization(depthData, width, height) {
    console.log('Kinectron: Creating depth visualization');

    // Create a canvas for visualization
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create image data
    const imgData = ctx.createImageData(width, height);

    // Find min/max depth for normalization
    let minDepth = Number.MAX_VALUE;
    let maxDepth = 0;

    for (let i = 0; i < depthData.length; i++) {
      if (depthData[i] > 0) {
        minDepth = Math.min(minDepth, depthData[i]);
        maxDepth = Math.max(maxDepth, depthData[i]);
      }
    }

    // Default range if no valid depths found
    if (minDepth === Number.MAX_VALUE) {
      minDepth = 0;
      maxDepth = 5000; // Typical max depth in mm
    }

    // Normalize and visualize
    for (let i = 0; i < depthData.length; i++) {
      const depth = depthData[i];
      const index = i * 4;

      if (depth > 0) {
        // Normalize to 0-255 range
        const normalizedDepth = Math.floor(
          255 * (1 - (depth - minDepth) / (maxDepth - minDepth)),
        );

        // Grayscale visualization
        imgData.data[index] = normalizedDepth;
        imgData.data[index + 1] = normalizedDepth;
        imgData.data[index + 2] = normalizedDepth;
        imgData.data[index + 3] = 255; // Alpha
      } else {
        // No depth data (black with alpha)
        imgData.data[index] = 0;
        imgData.data[index + 1] = 0;
        imgData.data[index + 2] = 0;
        imgData.data[index + 3] = 255;
      }
    }

    // Draw the image data
    ctx.putImageData(imgData, 0, 0);

    // Convert to data URL
    return canvas.toDataURL('image/jpeg');
  }

  startRawDepth(callback) {
    console.log('Kinectron: startRawDepth called');

    if (callback) {
      console.log(
        'Kinectron: Setting up handlers for raw depth data',
      );

      // Store pending metadata until binary data arrives
      let pendingMetadata = null;

      // Set up handler for metadata
      this.messageHandlers.set('rawDepthMetadata', (metadata) => {
        console.log(
          'Kinectron: Received rawDepthMetadata:',
          metadata
            ? `width=${metadata.width}, height=${metadata.height}, timestamp=${metadata.timestamp}, frameId=${metadata.frameId}`
            : 'null',
        );

        // Store metadata until binary data arrives
        pendingMetadata = metadata;
      });

      // Set up handler for binary data
      this.messageHandlers.set('rawDepthData', (binaryData) => {
        console.log('Kinectron: Received rawDepthData');

        if (!pendingMetadata) {
          console.warn(
            'Kinectron: Received binary data without metadata, discarding',
          );
          return;
        }

        if (!(binaryData instanceof ArrayBuffer)) {
          console.error(
            'Kinectron: Received non-binary data for rawDepthData event',
          );
          return;
        }

        try {
          // Convert ArrayBuffer to Uint16Array (16-bit depth values)
          const depthData = new Uint16Array(binaryData);

          console.log(
            'Kinectron: Binary depth data processed, length:',
            depthData.length,
            'expected:',
            pendingMetadata.width * pendingMetadata.height,
          );

          // Call the user callback with the raw depth data
          callback({
            width: pendingMetadata.width,
            height: pendingMetadata.height,
            rawDepthData: depthData,
            timestamp: pendingMetadata.timestamp,
            stats: pendingMetadata.stats,
            frameId: pendingMetadata.frameId,
          });

          // Clear pending metadata after processing
          pendingMetadata = null;
        } catch (error) {
          console.error(
            'Kinectron: Error processing binary depth data:',
            error,
          );

          // Still try to call the callback with basic information
          callback({
            width: pendingMetadata?.width,
            height: pendingMetadata?.height,
            timestamp: pendingMetadata?.timestamp || Date.now(),
            error: error.message,
          });

          // Clear pending metadata
          pendingMetadata = null;
        }
      });

      // Set up handler for combined rawDepth event (fallback)
      this.messageHandlers.set('rawDepth', (data) => {
        console.log(
          'Kinectron: Received combined rawDepth event:',
          data
            ? `width=${data.width}, height=${
                data.height
              }, has rawDepthData=${!!data.rawDepthData}, downsampleFactor=${
                data.downsampleFactor || 1
              }`
            : 'null',
        );

        if (data && data.rawDepthData) {
          try {
            // Convert Array to Uint16Array for the downsampled data
            const downsampledData = new Uint16Array(
              data.rawDepthData,
            );

            console.log(
              'Kinectron: Downsampled depth data processed, length:',
              downsampledData.length,
              'expected:',
              data.width * data.height,
            );

            // If the data is downsampled, we need to upsample it to the original dimensions
            if (data.downsampleFactor && data.downsampleFactor > 1) {
              console.log(
                'Kinectron: Upsampling depth data with factor:',
                data.downsampleFactor,
              );

              // Calculate original dimensions
              const originalWidth =
                data.width * data.downsampleFactor;
              const originalHeight =
                data.height * data.downsampleFactor;

              // Create a full-sized array filled with zeros
              const fullSizeData = new Uint16Array(
                originalWidth * originalHeight,
              );

              // Fill the array with the downsampled data, using nearest neighbor upsampling
              for (let y = 0; y < originalHeight; y++) {
                for (let x = 0; x < originalWidth; x++) {
                  // Find the corresponding pixel in the downsampled data
                  const dsX = Math.floor(x / data.downsampleFactor);
                  const dsY = Math.floor(y / data.downsampleFactor);
                  const dsIndex = dsY * data.width + dsX;

                  // Set the pixel in the full-sized array
                  const fullIndex = y * originalWidth + x;
                  fullSizeData[fullIndex] =
                    downsampledData[dsIndex] || 0;
                }
              }

              console.log(
                'Kinectron: Upsampled depth data, length:',
                fullSizeData.length,
                'expected:',
                originalWidth * originalHeight,
              );

              // Call the user callback with the upsampled data
              callback({
                width: originalWidth,
                height: originalHeight,
                rawDepthData: fullSizeData,
                timestamp: data.timestamp,
                stats: data.stats,
                frameId: data.frameId,
                isUpsampled: true,
                downsampleFactor: data.downsampleFactor,
              });
            } else {
              // No upsampling needed, just pass the data through
              callback({
                width: data.width,
                height: data.height,
                rawDepthData: downsampledData,
                timestamp: data.timestamp,
                stats: data.stats,
                frameId: data.frameId,
              });
            }
          } catch (error) {
            console.error(
              'Kinectron: Error processing combined depth data:',
              error,
            );

            // Still try to call the callback with basic information
            callback({
              width: data.width,
              height: data.height,
              timestamp: data.timestamp || Date.now(),
              error: error.message,
            });
          }
        } else {
          console.warn(
            'Kinectron: Received rawDepth event without depth data',
          );
        }
      });

      // For backward compatibility, also handle the old rawDepth event
      this.messageHandlers.set('rawDepth', (data) => {
        console.log(
          'Kinectron: Received legacy rawDepth event:',
          data ? 'has data' : 'null',
        );

        // If we receive the old format, just forward it to the callback
        if (data) {
          callback({
            width: data.width,
            height: data.height,
            timestamp: data.timestamp || Date.now(),
            legacyFormat: true,
            rawData: data,
          });
        }
      });

      console.log('Kinectron: Raw depth event handlers registered');
    } else {
      console.warn(
        'Kinectron: No callback provided for raw depth stream',
      );
    }

    console.log('Kinectron: Sending raw-depth feed request');
    this.send('feed', { feed: 'raw-depth' });
    console.log('Kinectron: Raw depth feed request sent');
  }

  startBodies(callback) {
    if (callback) {
      // Set up handler to process body tracking frames
      this.messageHandlers.set('bodyFrame', (data) => {
        if (data && data.bodies) {
          // Body data is already in a usable format (array of body objects)
          // Just add timestamp and pass it through
          callback({
            bodies: data.bodies,
            timestamp: data.timestamp || Date.now(),
            floorClipPlane: data.floorClipPlane,
            trackingId: data.trackingId,
          });
        }
      });
    }
    this.send('feed', { feed: 'body' });
  }

  startKey(callback) {
    if (callback) {
      // Set up frame handler to process key frames
      this.messageHandlers.set('frame', (data) => {
        // Extract the actual frame data
        const frameData = data.data || data;

        // Only process frames with name 'key'
        if (frameData.name === 'key' && frameData.imagedata) {
          // Create a canvas to convert image data to a data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = frameData.imagedata;

          canvas.width = width;
          canvas.height = height;

          try {
            // Check if data is a string (data URL)
            if (typeof frameData.imagedata.data === 'string') {
              // Create an image from the data URL
              const img = new Image();
              img.onload = () => {
                // Draw the image to the canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Use the original data URL
                const src = frameData.imagedata.data;

                // Call the user callback with processed frame
                callback({
                  src,
                  width,
                  height,
                  raw: frameData.imagedata,
                  timestamp: frameData.timestamp || Date.now(),
                });
              };

              // Set error handler
              img.onerror = (err) => {
                console.error(
                  'Kinectron: Error loading key image from data URL:',
                  err,
                );
                // Try to call callback anyway with the raw data
                callback({
                  src: frameData.imagedata.data,
                  width,
                  height,
                  raw: frameData.imagedata,
                  timestamp: frameData.timestamp || Date.now(),
                });
              };

              // Start loading the image
              img.src = frameData.imagedata.data;

              // Return early - callback will be called from onload handler
              return;
            } else {
              // Original code for handling raw pixel data
              // Ensure we have a Uint8ClampedArray
              let pixelData;
              if (
                frameData.imagedata.data instanceof Uint8ClampedArray
              ) {
                pixelData = frameData.imagedata.data;
              } else if (
                frameData.imagedata.data instanceof Uint8Array
              ) {
                pixelData = new Uint8ClampedArray(
                  frameData.imagedata.data,
                );
              } else if (Array.isArray(frameData.imagedata.data)) {
                pixelData = new Uint8ClampedArray(
                  frameData.imagedata.data,
                );
              } else {
                // Handle case where data is an object (e.g., from JSON)
                pixelData = new Uint8ClampedArray(
                  Object.values(frameData.imagedata.data),
                );
              }

              const imgData = new ImageData(pixelData, width, height);

              // Put the image data on the canvas
              ctx.putImageData(imgData, 0, 0);

              // Convert to data URL for easy display
              const src = canvas.toDataURL('image/jpeg');

              // Call the user callback with processed frame
              callback({
                src,
                width,
                height,
                raw: frameData.imagedata,
                timestamp: frameData.timestamp || Date.now(),
              });
            }
          } catch (error) {
            console.error(
              'Kinectron: Error processing key frame:',
              error,
            );
            console.error(
              'Kinectron: Frame data:',
              frameData.imagedata,
            );
          }
        } else {
          console.warn(
            "Kinectron: Received frame event but it's not a valid key frame:",
            'name=',
            frameData.name,
            'has imagedata=',
            !!frameData.imagedata,
          );
        }
      });
    }
    this.send('feed', { feed: 'key' });
  }

  startDepthKey(callback) {
    if (callback) {
      // Set up handler to process depth key frames
      this.messageHandlers.set('depthKey', (data) => {
        if (data && data.imagedata) {
          // Create a canvas to convert image data to a data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = data.imagedata;

          canvas.width = width;
          canvas.height = height;

          // Create ImageData object from the raw data
          const imgData = new ImageData(
            new Uint8ClampedArray(data.imagedata.data),
            width,
            height,
          );

          // Put the image data on the canvas
          ctx.putImageData(imgData, 0, 0);

          // Convert to data URL for easy display
          const src = canvas.toDataURL('image/jpeg');

          // Call the user callback with processed frame
          callback({
            src,
            width,
            height,
            raw: data.imagedata,
            timestamp: data.timestamp || Date.now(),
          });
        }
      });
    }
    this.send('feed', { feed: 'depth-key' });
  }

  startRGBD(callback) {
    if (callback) {
      // Set up frame handler to process RGBD frames
      this.messageHandlers.set('frame', (data) => {
        // Only process frames with name 'rgbd'
        if (data.name === 'rgbd' && data.imagedata) {
          // Create a canvas to convert image data to a data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const { width, height } = data.imagedata;

          canvas.width = width;
          canvas.height = height;

          // Create ImageData object from the raw data
          const imgData = new ImageData(
            new Uint8ClampedArray(data.imagedata.data),
            width,
            height,
          );

          // Put the image data on the canvas
          ctx.putImageData(imgData, 0, 0);

          // Convert to data URL for easy display
          const src = canvas.toDataURL('image/jpeg');

          // Call the user callback with processed frame
          callback({
            src,
            width,
            height,
            raw: data.imagedata,
            timestamp: data.timestamp || Date.now(),
          });
        }
      });
    }
    this.send('feed', { feed: 'rgbd' });
  }

  startMultiFrame(frames, callback) {
    if (callback) {
      // Set up handler to process multi-frame data
      this.messageHandlers.set('multiFrame', (data) => {
        if (data && data.frames) {
          // Process each frame based on its type
          const processedFrames = {};

          // Process each frame in the multiframe data
          Object.entries(data.frames).forEach(([type, frameData]) => {
            if (frameData.imagedata) {
              // For image-based frames, convert to data URL
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const { width, height } = frameData.imagedata;

              canvas.width = width;
              canvas.height = height;

              // Create ImageData object from the raw data
              const imgData = new ImageData(
                new Uint8ClampedArray(frameData.imagedata.data),
                width,
                height,
              );

              // Put the image data on the canvas
              ctx.putImageData(imgData, 0, 0);

              // Convert to data URL
              processedFrames[type] = {
                src: canvas.toDataURL('image/jpeg'),
                width,
                height,
                raw: frameData.imagedata,
              };
            } else {
              // For non-image data (like body tracking), pass through
              processedFrames[type] = frameData;
            }
          });

          // Call the user callback with processed frames
          callback({
            frames: processedFrames,
            timestamp: data.timestamp || Date.now(),
          });
        }
      });
    }
    this.send('multi', frames);
  }

  // Stop all feeds
  stopAll() {
    this.send('feed', { feed: 'stop-all' });
  }

  // Frame callback registration methods
  onColorFrame(callback) {
    console.log('Kinectron: Registering onColorFrame callback');
    const handler = (data) => {
      console.log('Kinectron: onColorFrame handler called with data');
      callback(data);
    };
    this.messageHandlers.set('frame', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onColorFrame handler');
      this.messageHandlers.delete('frame');
    };
  }

  onDepthFrame(callback) {
    console.log('Kinectron: Registering onDepthFrame callback');
    const handler = (data) => {
      console.log('Kinectron: onDepthFrame handler called with data');
      callback(data);
    };
    this.messageHandlers.set('frame', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onDepthFrame handler');
      this.messageHandlers.delete('frame');
    };
  }

  onRawDepthFrame(callback) {
    console.log('Kinectron: Registering onRawDepthFrame callback');
    const handler = (data) => {
      console.log(
        'Kinectron: onRawDepthFrame handler called with data:',
        data ? `has imagedata=${!!data.imagedata}` : 'null',
      );

      // Process the data to maintain backward compatibility
      if (data && data.imagedata) {
        // If we have imagedata, process it to extract rawDepthData
        this.processRawDepth(data.imagedata, data.width, data.height)
          .then((depthValues) => {
            // Add the rawDepthData property for backward compatibility
            data.rawDepthData = depthValues;
            callback(data);
          })
          .catch((error) => {
            console.error(
              'Kinectron: Error processing raw depth data:',
              error,
            );
            // Still call the callback with the original data
            callback(data);
          });
      } else {
        // If no imagedata, just pass through the data
        callback(data);
      }
    };
    this.messageHandlers.set('rawDepth', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onRawDepthFrame handler');
      this.messageHandlers.delete('rawDepth');
    };
  }

  onBodyFrame(callback) {
    console.log('Kinectron: Registering onBodyFrame callback');
    const handler = (data) => {
      console.log('Kinectron: onBodyFrame handler called with data');
      callback(data);
    };
    this.messageHandlers.set('bodyFrame', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onBodyFrame handler');
      this.messageHandlers.delete('bodyFrame');
    };
  }

  onKeyFrame(callback) {
    console.log('Kinectron: Registering onKeyFrame callback');
    const handler = (data) => {
      console.log('Kinectron: onKeyFrame handler called with data');
      callback(data);
    };
    this.messageHandlers.set('frame', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onKeyFrame handler');
      this.messageHandlers.delete('frame');
    };
  }

  onDepthKeyFrame(callback) {
    console.log('Kinectron: Registering onDepthKeyFrame callback');
    const handler = (data) => {
      console.log(
        'Kinectron: onDepthKeyFrame handler called with data',
      );
      callback(data);
    };
    this.messageHandlers.set('depthKey', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onDepthKeyFrame handler');
      this.messageHandlers.delete('depthKey');
    };
  }

  onRGBDFrame(callback) {
    console.log('Kinectron: Registering onRGBDFrame callback');
    const handler = (data) => {
      console.log('Kinectron: onRGBDFrame handler called with data');
      callback(data);
    };
    this.messageHandlers.set('frame', handler);

    // Return cleanup function
    return () => {
      console.log('Kinectron: Cleaning up onRGBDFrame handler');
      this.messageHandlers.delete('frame');
    };
  }

  // Ngrok status change callback
  onNgrokStatusChange(callback) {
    console.log(
      'Kinectron: Registering onNgrokStatusChange callback',
    );
    this.messageHandlers.set('ngrokStatus', callback);

    // Return cleanup function
    return () => {
      console.log(
        'Kinectron: Cleaning up onNgrokStatusChange handler',
      );
      this.messageHandlers.delete('ngrokStatus');
    };
  }

  // Clean up
  close() {
    console.log(
      'Kinectron: Closing connection and cleaning up resources',
    );
    this.peer.close();
    this.messageHandlers.clear();
    this.state = null;
  }
}
