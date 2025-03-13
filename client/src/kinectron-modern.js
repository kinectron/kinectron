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
      if (handler) handler(eventData);
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
        if (data.success) {
          resolve(data);
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
        // Only process frames with name 'color'
        if (data.name === 'color' && data.imagedata) {
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
    this.send('feed', { feed: 'color' });
  }

  startDepth(callback) {
    if (callback) {
      // Set up frame handler to process depth frames
      this.messageHandlers.set('frame', (data) => {
        // Only process frames with name 'depth'
        if (data.name === 'depth' && data.imagedata) {
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
    this.send('feed', { feed: 'depth' });
  }

  startRawDepth(callback) {
    if (callback) {
      // Set up handler to process raw depth frames
      this.messageHandlers.set('rawDepth', (data) => {
        if (data && data.rawDepthData) {
          // Raw depth data is already in a usable format (array of depth values)
          // Just add timestamp and pass it through
          callback({
            ...data,
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
        // Only process frames with name 'key'
        if (data.name === 'key' && data.imagedata) {
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
