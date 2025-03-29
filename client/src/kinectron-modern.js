import { PeerConnection } from './peer/peerConnection.js';
import { NgrokClientState } from './peer/ngrokState.js';
import {
  createFrameHandler,
  createRawDepthHandler,
  createBodyHandler,
  createMultiFrameHandler,
} from './streams/streamHandlers.js';

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
        // if (event === 'bodyFrame') debugger;

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
      this.messageHandlers.set(
        'frame',
        createFrameHandler('color', callback),
      );
    }
    this.send('feed', { feed: 'color' });
  }

  startDepth(callback) {
    if (callback) {
      // Set up frame handler to process depth frames
      this.messageHandlers.set(
        'frame',
        createFrameHandler('depth', callback),
      );
    }
    this.send('feed', { feed: 'depth' });
  }

  /**
   * Unpacks raw depth data from a WebP image
   * @private
   * @param {string} dataUrl - The data URL containing the depth data
   * @param {number} width - The width of the image
   * @param {number} height - The height of the image
   * @param {number} originalWidth - The original width of the depth data (not used in new implementation)
   * @param {Object} testValues - Test values to verify unpacking accuracy
   * @returns {Promise<Uint16Array>} - Promise resolving to the unpacked depth values
   */
  _unpackRawDepthData(
    dataUrl,
    width,
    height,
    originalWidth,
    testValues,
  ) {
    // Import the debug configuration
    import('./utils/debug.js')
      .then(({ DEBUG }) => {
        // Enable debug if needed
        if (DEBUG.RAW_DEPTH) {
          console.log(
            'Unpacking raw depth data with dimensions:',
            width,
            'x',
            height,
          );
        }
      })
      .catch((err) => {
        // Silently fail if debug module can't be loaded
      });
    return new Promise((resolve, reject) => {
      // Create image to load the data URL
      const img = new Image();
      img.onload = () => {
        // Use OffscreenCanvas for efficient processing
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Draw the image to the canvas
        ctx.drawImage(img, 0, 0);

        // Get the pixel data
        const imageData = ctx.getImageData(0, 0, width, height).data;

        // Create array for unpacked depth values
        const depthValues = new Uint16Array(width * height);

        // Process the raw depth data exactly like the app.js client code
        let j = 0;
        for (let i = 0; i < imageData.length; i += 4) {
          // Extract depth value from R and G channels
          const depth = (imageData[i + 1] << 8) | imageData[i]; // Get uint16 data from buffer
          depthValues[j++] = depth;
        }

        // Verify test values if provided
        if (testValues) {
          // Import the debug configuration
          import('./utils/debug.js')
            .then(({ DEBUG }) => {
              if (DEBUG.RAW_DEPTH && DEBUG.DATA) {
                const unpackedValue1000 = depthValues[1000];
                const unpackedValue2000 = depthValues[2000];
                const unpackedValue3000 = depthValues[3000];

                console.log('Test values comparison:', {
                  'Index 1000': {
                    Original: testValues.index1000,
                    Unpacked: unpackedValue1000,
                    Difference:
                      testValues.index1000 - unpackedValue1000,
                  },
                  'Index 2000': {
                    Original: testValues.index2000,
                    Unpacked: unpackedValue2000,
                    Difference:
                      testValues.index2000 - unpackedValue2000,
                  },
                  'Index 3000': {
                    Original: testValues.index3000,
                    Unpacked: unpackedValue3000,
                    Difference:
                      testValues.index3000 - unpackedValue3000,
                  },
                });
              }
            })
            .catch((err) => {
              // Silently fail if debug module can't be loaded
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
      this.messageHandlers.set(
        'rawDepth',
        createRawDepthHandler(
          callback,
          this._unpackRawDepthData.bind(this),
        ),
      );
    }
    this.send('feed', { feed: 'raw-depth' });
  }

  startBodies(callback) {
    if (callback) {
      // Set up handler to process body tracking frames
      this.messageHandlers.set(
        'bodyFrame',
        createBodyHandler(callback),
      );
    }
    this.send('feed', { feed: 'body' });
  }

  startKey(callback) {
    if (callback) {
      // Set up frame handler to process key frames
      this.messageHandlers.set(
        'frame',
        createFrameHandler('key', callback),
      );
    }
    this.send('feed', { feed: 'key' });
  }

  startDepthKey(callback) {
    if (callback) {
      // Set up handler to process depth key frames
      this.messageHandlers.set(
        'depth-key', // Changed from 'depthKey' to match server's broadcast event name
        createFrameHandler('depth-key', callback),
      );
    }
    this.send('feed', { feed: 'depth-key' });
  }

  startRGBD(callback) {
    if (callback) {
      // Set up frame handler to process RGBD frames
      this.messageHandlers.set(
        'frame',
        createFrameHandler('rgbd', callback),
      );
    }
    this.send('feed', { feed: 'rgbd' });
  }

  startMultiFrame(frames, callback) {
    if (callback) {
      // Set up handler to process multi-frame data
      this.messageHandlers.set(
        'multiFrame',
        createMultiFrameHandler(callback),
      );
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
