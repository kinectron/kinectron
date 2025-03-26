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
      const { event, data: eventData } = data;
      const handler = this.messageHandlers.get(event);

      if (handler) {
        handler(eventData);
      } else {
        console.warn('Kinectron: No handler found for event:', event);
      }
    });
  }

  // Event registration
  on(event, callback) {
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
   * Unpacks raw depth data from a packed WebP image
   * @private
   * @param {string} dataUrl - The data URL containing the packed depth data
   * @param {number} packedWidth - The width of the packed image
   * @param {number} packedHeight - The height of the packed image
   * @param {number} originalWidth - The original width of the depth data
   * @param {Object} testValues - Test values to verify unpacking accuracy
   * @returns {Promise<Uint16Array>} - Promise resolving to the unpacked depth values
   */
  _unpackRawDepthData(
    dataUrl,
    packedWidth,
    packedHeight,
    originalWidth,
    testValues,
  ) {
    return new Promise((resolve, reject) => {
      // Create image to load the data URL
      const img = new Image();
      img.onload = () => {
        // Use OffscreenCanvas for efficient processing
        const canvas = new OffscreenCanvas(packedWidth, packedHeight);
        const ctx = canvas.getContext('2d');

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0);

        // Get the packed pixel data
        const packedData = ctx.getImageData(
          0,
          0,
          packedWidth,
          packedHeight,
        ).data;

        // Create array for unpacked depth values
        const depthValues = new Uint16Array(
          originalWidth * packedHeight,
        );

        // Unpack the depth data
        for (let y = 0; y < packedHeight; y++) {
          for (let x = 0; x < packedWidth; x++) {
            const srcIdx = (y * packedWidth + x) * 4;

            // Extract first depth value from R and G channels
            const depth1 =
              packedData[srcIdx] | (packedData[srcIdx + 1] << 8);

            // Extract second depth value from B and A channels
            const depth2 =
              packedData[srcIdx + 2] | (packedData[srcIdx + 3] << 8);

            // Store in output array
            depthValues[y * originalWidth + x * 2] = depth1;

            // Only store second value if it's within bounds
            if (x * 2 + 1 < originalWidth) {
              depthValues[y * originalWidth + x * 2 + 1] = depth2;
            }
          }
        }

        // Verify test values if provided
        if (testValues) {
          const unpackedValue1000 = depthValues[1000];
          const unpackedValue2000 = depthValues[2000];
          const unpackedValue3000 = depthValues[3000];

          console.log('Test values comparison:', {
            'Index 1000': {
              Original: testValues.index1000,
              Unpacked: unpackedValue1000,
              Difference: testValues.index1000 - unpackedValue1000,
            },
            'Index 2000': {
              Original: testValues.index2000,
              Unpacked: unpackedValue2000,
              Difference: testValues.index2000 - unpackedValue2000,
            },
            'Index 3000': {
              Original: testValues.index3000,
              Unpacked: unpackedValue3000,
              Difference: testValues.index3000 - unpackedValue3000,
            },
          });
        }

        resolve(depthValues);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load depth image: ' + err));
      };

      img.src = dataUrl;
    });
  }

  startRawDepth(callback) {
    if (callback) {
      // Set up handler to process raw depth frames
      this.messageHandlers.set('rawDepth', (data) => {
        if (data && data.imagedata) {
          // Check if this is packed data that needs to be unpacked
          if (data.isPacked) {
            // Unpack the data
            this._unpackRawDepthData(
              data.imagedata,
              data.width,
              data.height,
              data.originalWidth,
              data.testValues, // Pass test values to unpacking function
            )
              .then((depthValues) => {
                // Call the callback with the unpacked data
                callback({
                  ...data,
                  depthValues: depthValues,
                  timestamp: data.timestamp || Date.now(),
                });
              })
              .catch((error) => {
                console.error(
                  'Error unpacking raw depth data:',
                  error,
                );
                // Still call the callback with the original data
                callback({
                  ...data,
                  error:
                    'Failed to unpack depth data: ' + error.message,
                  timestamp: data.timestamp || Date.now(),
                });
              });
          } else {
            // Data is not packed, pass it through
            callback({
              ...data,
              timestamp: data.timestamp || Date.now(),
            });
          }
        } else if (data && data.rawDepthData) {
          // Legacy format - raw depth data is already in a usable format
          callback({
            ...data,
            timestamp: data.timestamp || Date.now(),
          });
        } else {
          console.warn(
            'Received raw depth frame with invalid data format:',
            data,
          );
          callback({
            ...data,
            error: 'Invalid data format',
            timestamp: data.timestamp || Date.now(),
          });
        }
      });
    }
    this.send('feed', { feed: 'raw-depth' });
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

  // Clean up
  close() {
    this.peer.close();
    this.messageHandlers.clear();
    this.state = null;
  }
}
