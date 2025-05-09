import { PeerConnection } from './peer/peerConnection.js';
import { NgrokClientState } from './peer/ngrokState.js';
import { DEBUG, log } from './utils/debug.js';
import {
  createFrameHandler,
  createRawDepthHandler,
  createBodyHandler,
  createMultiFrameHandler,
} from './streams/streamHandlers.js';

/**
 * Kinectron client for connecting to a Kinectron server and accessing Azure Kinect data streams
 *
 * @class
 */
export class Kinectron {
  /**
   * Creates a new Kinectron client instance for connecting to a Kinectron server
   *
   * @param {Object|string} [networkConfig] - Network configuration or server IP address
   * @param {string} [networkConfig.host='127.0.0.1'] - Host address for the peer server
   * @param {number|string} [networkConfig.port=9001] - Port number for the peer server
   * @param {string} [networkConfig.path='/'] - Path for the peer server
   * @param {boolean} [networkConfig.secure=false] - Whether to use secure connection
   * @param {string} [networkConfig.role='default'] - Role identifier for the connection
   * @example
   * // Connect to local server
   * const kinectron = new Kinectron();
   *
   * // Connect to specific IP
   * const kinectron = new Kinectron('192.168.0.1');
   *
   * // Connect to ngrok tunnel
   * const kinectron = new Kinectron('https://abcd1234.ngrok-free.app');
   *
   * // Connect with custom config
   * const kinectron = new Kinectron({
   *   host: '192.168.0.1',
   *   port: 9001,
   *   secure: false
   * });
   */
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
        log.warn('Kinectron: No handler found for event:', event);
      }
    });
  }

  /**
   * Register an event handler for a specific event type
   *
   * @param {string} event - Event type to handle
   * @param {Function} callback - Handler function for the event
   * @example
   * // Handle connection ready event
   * kinectron.on('ready', (data) => {
   *   console.log('Connected to Kinectron server!');
   * });
   *
   * // Handle connection errors
   * kinectron.on('error', (error) => {
   *   console.error('Connection error:', error);
   * });
   *
   * // Handle state changes
   * kinectron.on('stateChange', (data) => {
   *   console.log('Connection state changed from', data.from, 'to', data.to);
   * });
   */
  on(event, callback) {
    this.messageHandlers.set(event, callback);
  }

  /**
   * Get the current connection state and metadata
   *
   * @returns {Object} Current state information including connection status, metrics, and error history
   * @example
   * const state = kinectron.getState();
   * console.log('Connection state:', state.currentState);
   * console.log('Connection quality:', state.metrics.connectionQuality);
   * console.log('Latency:', state.metrics.latency.current, 'ms');
   */
  getState() {
    return this.peer.getState();
  }

  /**
   * Check if the client is currently connected to a Kinectron server
   *
   * @returns {boolean} True if connected, false otherwise
   * @example
   * if (kinectron.isConnected()) {
   *   console.log('Connected to Kinectron server');
   * } else {
   *   console.log('Not connected');
   * }
   */
  isConnected() {
    return this.state === NgrokClientState.STATES.CONNECTED;
  }

  /**
   * Set the Kinect hardware type to use
   *
   * @param {string} kinectType - The type of Kinect hardware ('azure' or 'windows')
   * @returns {void}
   * @example
   * // Set to Azure Kinect
   * kinectron.setKinectType('azure');
   *
   * // Set to Kinect for Windows v2
   * kinectron.setKinectType('windows');
   */
  setKinectType(kinectType) {
    if (!this.isConnected()) {
      log.warn('Cannot set Kinect type: not connected');
      return;
    }
    this.send('setkinect', kinectType);
  }

  /**
   * Initialize the Kinect hardware on the server
   *
   * @param {Function} [callback] - Optional callback for backward compatibility
   * @returns {Promise<Object>} Promise resolving to initialization result
   * @throws {Error} If not connected or initialization fails
   * @example
   * // Using Promise-based approach (recommended)
   * kinectron.initKinect()
   *   .then(result => {
   *     console.log('Kinect initialized:', result.success);
   *     // Start streams after successful initialization
   *     kinectron.startColor(handleColorFrame);
   *   })
   *   .catch(error => {
   *     console.error('Failed to initialize Kinect:', error);
   *   });
   *
   * // Using callback approach (legacy)
   * kinectron.initKinect((result) => {
   *   if (result.success) {
   *     console.log('Kinect initialized successfully');
   *     // Start streams after successful initialization
   *     kinectron.startColor(handleColorFrame);
   *   } else {
   *     console.error('Failed to initialize Kinect:', result.error);
   *   }
   * });
   */
  initKinect(callback) {
    if (!this.isConnected()) {
      log.warn('Cannot initialize Kinect: not connected');
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

  /**
   * Send data to the Kinectron server
   *
   * @param {string} event - Event type
   * @param {*} data - Data to send
   * @returns {void}
   * @example
   * // Send custom data to the server
   * kinectron.send('custom-event', { message: 'Hello from client' });
   */
  send(event, data) {
    if (!this.isConnected()) {
      log.warn('Cannot send data: not connected');
      return;
    }
    this.peer.send(event, data);
  }

  /**
   * Start the color camera stream
   *
   * @param {Function} [callback] - Callback function that receives color frames
   * @returns {void}
   * @example
   * kinectron.startColor((colorFrame) => {
   *   // colorFrame contains:
   *   // - src: Data URL of the color image
   *   // - width: Image width
   *   // - height: Image height
   *   // - raw: Raw image data
   *   // - timestamp: Frame timestamp
   *
   *   // Display the color image
   *   const img = document.getElementById('colorImage');
   *   img.src = colorFrame.src;
   * });
   */
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

  /**
   * Start the depth camera stream (processed depth image)
   *
   * @param {Function} [callback] - Callback function that receives depth frames
   * @returns {void}
   * @example
   * kinectron.startDepth((depthFrame) => {
   *   // depthFrame contains:
   *   // - src: Data URL of the depth image (colorized)
   *   // - width: Image width
   *   // - height: Image height
   *   // - raw: Raw image data
   *   // - timestamp: Frame timestamp
   *
   *   // Display the depth image
   *   const img = document.getElementById('depthImage');
   *   img.src = depthFrame.src;
   * });
   */
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
    // Log using the imported debug module
    if (DEBUG.DATA) {
      log.data(
        'Unpacking raw depth data with dimensions:',
        width,
        'x',
        height,
      );
    }
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
        if (testValues && DEBUG.DATA) {
          const unpackedValue1000 = depthValues[1000];
          const unpackedValue2000 = depthValues[2000];
          const unpackedValue3000 = depthValues[3000];

          log.data('Test values comparison:', {
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

  /**
   * Start the raw depth stream (16-bit depth values)
   *
   * @param {Function} [callback] - Callback function that receives raw depth frames
   * @returns {void}
   * @example
   * kinectron.startRawDepth((rawDepthFrame) => {
   *   // rawDepthFrame contains:
   *   // - depthValues: Uint16Array of 16-bit depth values
   *   // - width: Frame width
   *   // - height: Frame height
   *   // - timestamp: Frame timestamp
   *
   *   // Access raw depth values
   *   const depthValues = rawDepthFrame.depthValues;
   *
   *   // Example: Find minimum and maximum depth
   *   let min = Infinity;
   *   let max = 0;
   *   for (let i = 0; i < depthValues.length; i++) {
   *     if (depthValues[i] > 0) { // Ignore zero values (no data)
   *       min = Math.min(min, depthValues[i]);
   *       max = Math.max(max, depthValues[i]);
   *     }
   *   }
   *   console.log(`Depth range: ${min}mm to ${max}mm`);
   * });
   */
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

  /**
   * Start the body tracking stream
   *
   * @param {Function} [callback] - Callback function that receives body tracking frames
   * @returns {void}
   * @example
   * kinectron.startBodies((bodyFrame) => {
   *   // bodyFrame contains:
   *   // - bodies: Array of tracked bodies
   *   // - timestamp: Frame timestamp
   *   // - floorClipPlane: Floor plane data
   *   // - trackingId: Tracking session ID
   *
   *   // Process each tracked body
   *   bodyFrame.bodies.forEach(body => {
   *     // Each body contains joint positions and orientations
   *     const joints = body.joints;
   *
   *     // Example: Get head position
   *     const head = joints.find(joint => joint.name === 'head');
   *     if (head) {
   *       console.log('Head position:', head.position);
   *     }
   *   });
   * });
   */
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

  /**
   * Start the key (green screen) stream
   *
   * @param {Function} [callback] - Callback function that receives key frames
   * @returns {void}
   * @example
   * kinectron.startKey((keyFrame) => {
   *   // keyFrame contains:
   *   // - src: Data URL of the key image (color with background removed)
   *   // - width: Image width
   *   // - height: Image height
   *   // - raw: Raw image data
   *   // - timestamp: Frame timestamp
   *
   *   // Display the key image
   *   const img = document.getElementById('keyImage');
   *   img.src = keyFrame.src;
   * });
   */
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

  /**
   * Start the depth key stream (depth data with background removed)
   *
   * @param {Function} [callback] - Callback function that receives depth key frames
   * @returns {void}
   * @example
   * kinectron.startDepthKey((depthKeyFrame) => {
   *   // depthKeyFrame contains:
   *   // - src: Data URL of the depth key image
   *   // - width: Image width
   *   // - height: Image height
   *   // - raw: Raw image data
   *   // - timestamp: Frame timestamp
   *
   *   // Display the depth key image
   *   const img = document.getElementById('depthKeyImage');
   *   img.src = depthKeyFrame.src;
   * });
   */
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

  /**
   * Start the RGBD stream (aligned color and depth)
   *
   * @param {Function} [callback] - Callback function that receives RGBD frames
   * @returns {void}
   * @example
   * kinectron.startRGBD((rgbdFrame) => {
   *   // rgbdFrame contains:
   *   // - src: Data URL of the RGBD image
   *   // - width: Image width
   *   // - height: Image height
   *   // - raw: Raw image data
   *   // - timestamp: Frame timestamp
   *
   *   // Display the RGBD image
   *   const img = document.getElementById('rgbdImage');
   *   img.src = rgbdFrame.src;
   * });
   */
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

  /**
   * Start multiple streams simultaneously
   *
   * @param {string[]} frames - Array of stream types to start ('color', 'depth', 'body', etc.)
   * @param {Function} [callback] - Callback function that receives multi-frame data
   * @returns {void}
   * @example
   * // Start color and depth streams together
   * kinectron.startMultiFrame(['color', 'depth'], (multiFrame) => {
   *   // multiFrame contains:
   *   // - frames: Object with a property for each requested stream type
   *   // - timestamp: Frame timestamp
   *
   *   // Access individual frames
   *   const colorFrame = multiFrame.frames.color;
   *   const depthFrame = multiFrame.frames.depth;
   *
   *   // Display the images
   *   document.getElementById('colorImage').src = colorFrame.src;
   *   document.getElementById('depthImage').src = depthFrame.src;
   * });
   */
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

  /**
   * Stop all active streams
   *
   * @returns {void}
   * @example
   * // Stop all active streams
   * kinectron.stopAll();
   */
  stopAll() {
    this.send('feed', { feed: 'stop-all' });
  }

  /**
   * Close the connection and clean up resources
   *
   * @returns {void}
   * @example
   * // Close the connection when done
   * kinectron.close();
   */
  close() {
    this.peer.close();
    this.messageHandlers.clear();
    this.state = null;
  }
}
