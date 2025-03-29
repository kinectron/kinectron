// renderer/js/app.js

const BUTTON_INACTIVE_COLOR = '#fff';
const BUTTON_ACTIVE_COLOR = '#1daad8';

import { PeerController } from './peer/peerController.js';
import { stopAllStreamsForDebug } from './utils/frameDebugger.js';

class KinectronApp {
  constructor() {
    this.cleanupFunctions = new Map();
    this.currentStream = null;

    // Create a local ipc interface for peer controller to use
    this.ipc = {
      send: (channel, data) => {
        if (window.electron && window.electron.ipcRenderer) {
          window.electron.ipcRenderer.send(channel, data);
        } else {
          console.error('IPC renderer not available');
        }
      },
    };

    // Set up direct event listeners for frames from main process
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.on(
        'rgbd-frame',
        (event, frameData) => {
          console.log(
            'Received RGBD frame from main process:',
            frameData.name,
          );
          this.processRGBDFrame(frameData);
        },
      );
    }

    // Create and initialize peer controller
    this.peerController = new PeerController();
    this.peerController.ipc = this.ipc;
    this.peerController.initialize();

    // Listen for feed change events
    this.peerController.on(
      'feed-change',
      this.handleFeedChange.bind(this),
    );

    this.setupUIListeners();
    this.setupPeerListeners();
    this.setupNgrokListeners();
  }

  /**
   * Handle feed change events from peer connections
   * @private
   * @param {Object} data - Feed change data
   */
  handleFeedChange(data) {
    try {
      // Extract only the necessary data to avoid circular references
      const feedType = data.feed;
      const connectionId = data.connection?.peer || 'unknown';

      console.log(
        `Feed changed to ${feedType} for connection ${connectionId}`,
      );
      console.log(
        'handleFeedChange data:',
        JSON.stringify({
          feed: feedType,
          connectionId: connectionId,
          timestamp: data.timestamp,
        }),
      );

      // Update UI to reflect active feed
      if (feedType === 'stop-all') {
        console.log('Handling stop-all feed request');
        // Reset all button states
        const feedButtons = [
          'color',
          'depth',
          'raw-depth',
          'skeleton',
          'key',
          'depth-key',
          'rgbd',
        ];
        feedButtons.forEach((btn) => {
          console.log(`Resetting button state for ${btn}`);
          this.updateButtonState(btn, false);
        });

        // Stop current stream if any
        if (this.currentStream) {
          console.log(
            `Stopping current stream: ${this.currentStream}`,
          );
          this.stopCurrentStream();
        }
      } else {
        // Update button state for the active feed
        const buttonId = feedType === 'body' ? 'skeleton' : feedType;
        console.log(
          `Updating button state for ${buttonId} to active`,
        );
        this.updateButtonState(buttonId, true);

        // Start the stream if it's not already active
        if (this.currentStream !== feedType) {
          console.log(`Starting ${feedType} stream via API`);

          // Stop current stream if any
          if (this.currentStream) {
            console.log(
              `Stopping current stream ${this.currentStream} before starting ${feedType}`,
            );
            this.stopCurrentStream().then(() => {
              // Wait 500ms to avoid ThreadSafeFunction error when switching feeds
              console.log(
                `Waiting 500ms before starting ${feedType}`,
              );
              setTimeout(() => {
                console.log(`Now starting ${feedType} after delay`);
                this.startStreamFromFeed(feedType);
              }, 500);
            });
          } else {
            console.log(
              `No current stream active, starting ${feedType} immediately`,
            );
            this.startStreamFromFeed(feedType);
          }
        } else {
          console.log(
            `Stream ${feedType} is already active, not starting again`,
          );
        }
      }
    } catch (error) {
      console.error('Error in handleFeedChange:', error);
      // Try to continue with the feed change even if logging failed
      const feedType = data.feed;
      if (feedType && feedType !== 'stop-all') {
        this.startStreamFromFeed(feedType);
      }
    }
  }

  /**
   * Start a stream based on the feed type
   * @private
   * @param {string} feedType - The type of feed to start
   */
  async startStreamFromFeed(feedType) {
    try {
      let success = false;
      switch (feedType) {
        case 'color':
          success = await this.startColorStream();
          break;
        case 'depth':
          success = await this.startDepthStream();
          break;
        case 'raw-depth':
          success = await this.startRawDepthStream();
          break;
        case 'body':
          success = await this.startBodyTracking();
          break;
        case 'skeleton':
          success = await this.startBodyTracking();
          break;
        case 'key':
          success = await this.startKeyStream();
          break;
        case 'depth-key':
          success = await this.startDepthKeyStream();
          break;
        case 'rgbd':
          success = await this.startRGBDStream();
          break;
      }

      if (success) {
        this.currentStream =
          feedType === 'body' ? 'skeleton' : feedType;
        this.toggleFeedDiv(this.currentStream, 'block');
        console.log(
          `Successfully started ${feedType} stream via API`,
        );
      } else {
        console.error(`Failed to start ${feedType} stream via API`);
      }
    } catch (error) {
      console.error(
        `Error starting ${feedType} stream via API:`,
        error,
      );
    }
  }

  /**
   * Set up ngrok event listeners and UI handlers
   * @private
   */
  setupNgrokListeners() {
    // Listen for ngrok status changes
    window.kinectron.onNgrokStatusChange((status) => {
      this.updateNgrokUI(status);
    });

    // Add click listener to ngrok button
    const ngrokButton = document.getElementById('startngrok');
    if (ngrokButton) {
      ngrokButton.addEventListener('click', () => this.handleNgrok());
    }

    // Get initial ngrok status
    this.updateNgrokStatus();
  }

  /**
   * Handle ngrok connection/disconnection
   * @private
   */
  async handleNgrok() {
    const ngrokButton = document.getElementById('startngrok');
    const authTokenInput = document.getElementById('ngrokAuthToken');
    const ngrokAddress = document.getElementById('ngrokaddress');

    try {
      const status = await window.kinectron.getNgrokStatus();

      if (!status.isConnected) {
        const authToken = authTokenInput.value.trim();
        if (!authToken) {
          alert(
            'You need to add an ngrok auth token to create a public address. See ngrok.com or Kinectron documentation for more information.',
          );
          return;
        }

        if (
          confirm(
            'Creating a public address will open a secure public tunnel to your computer at port 9001 over https using ngrok. ' +
              'Learn more at ngrok.com. While this developer thinks this is a pretty nifty solution to getting your Kinectron ' +
              'server up on the internet, it could open you up to security threats. The risks are probably relatively low, but ' +
              'proceed at your own risk (and/or consider contributing to Kinectron to make it more secure (・ω・)b).',
          )
        ) {
          try {
            const url = await window.kinectron.startNgrok(authToken);
            console.log('Created public address at', url);
            authTokenInput.value = ''; // Clear token for security
          } catch (error) {
            console.error('Failed to start ngrok:', error);
            alert(
              'Failed to create public address. Please check your auth token and try again.',
            );
          }
        } else {
          console.log('No public address created.');
        }
      } else {
        try {
          await window.kinectron.stopNgrok();
          console.log('Stopped ngrok connection');
        } catch (error) {
          console.error('Failed to stop ngrok:', error);
          alert('Failed to stop public address.');
        }
      }
    } catch (error) {
      console.error('Error handling ngrok:', error);
    }
  }

  /**
   * Update ngrok UI elements based on connection status
   * @private
   */
  updateNgrokUI(status) {
    const ngrokButton = document.getElementById('startngrok');
    const ngrokAddress = document.getElementById('ngrokaddress');
    const authTokenInput = document.getElementById('ngrokAuthToken');

    if (status.isConnected) {
      ngrokButton.style.display = 'none';
      ngrokAddress.style.display = 'inline';
      ngrokAddress.textContent = status.url.replace('https://', '');
      authTokenInput.value = ''; // Clear token for security
    } else {
      ngrokButton.style.display = 'inline';
      ngrokButton.value = 'Create Public Address';
      ngrokAddress.style.display = 'none';
      ngrokAddress.textContent = 'xxxx';
    }
  }

  /**
   * Get and display current ngrok status
   * @private
   */
  async updateNgrokStatus() {
    try {
      const status = await window.kinectron.getNgrokStatus();
      this.updateNgrokUI(status);
    } catch (error) {
      console.error('Failed to get ngrok status:', error);
    }
  }

  /**
   * Set up peer connection event listeners
   * @private
   */
  setupPeerListeners() {
    // Update UI when peer server is ready
    this.peerController.on(
      this.peerController.EVENTS.READY,
      (data) => {
        document.getElementById('server-status').textContent =
          'Connected';
        document.getElementById('peerid').textContent = data.peer.id;
        document.getElementById('port').textContent =
          data.peer.options.port;
        this.updatePeerCount();
      },
    );

    // Update UI when a peer connects
    this.peerController.on(
      this.peerController.EVENTS.CONNECTION,
      () => {
        this.updatePeerCount();
      },
    );

    // Update UI when a peer disconnects
    this.peerController.on(
      this.peerController.EVENTS.DISCONNECTION,
      () => {
        this.updatePeerCount();
      },
    );

    // Handle peer errors
    this.peerController.on(
      this.peerController.EVENTS.ERROR,
      (error) => {
        document.getElementById('server-status').textContent =
          'Error';
        console.error('Peer error:', error);
      },
    );

    // Listen for Kinect initialization events from API
    this.peerController.on(
      this.peerController.EVENTS.KINECT_INITIALIZED,
      (data) => {
        console.log(
          'Received Kinect initialization event from API:',
          data,
        );
        if (data.success) {
          console.log('Kinect initialized successfully via API');
          this.enableStreamControls(true);
          this.updateButtonState('start-kinect-azure', true);
        } else {
          console.error(
            'Failed to initialize Kinect via API:',
            data.error,
          );
        }
      },
    );

    // Get initial peer status
    this.updatePeerStatus();
  }

  /**
   * Update the peer connection count display
   * @private
   */
  updatePeerCount() {
    const count = this.peerController.connections.size;
    document.getElementById('peer-count').textContent =
      count.toString();
  }

  /**
   * Update the peer status display
   * @private
   */
  async updatePeerStatus() {
    try {
      const status = await window.kinectron.getPeerStatus();
      document.getElementById('ipaddress').textContent =
        status.address || 'Not available';
      document.getElementById('server-status').textContent =
        status.connected ? 'Connected' : 'Disconnected';
    } catch (error) {
      console.error('Failed to get peer status:', error);
      document.getElementById('server-status').textContent = 'Error';
    }
  }

  setupUIListeners() {
    // Kinect initialization
    const initButton = document.getElementById('start-kinect-azure');
    if (initButton) {
      initButton.addEventListener('click', () =>
        this.initializeKinect(),
      );
    }

    // Stream controls
    const streamButtons = {
      color: document.getElementById('color'),
      depth: document.getElementById('depth'),
      'raw-depth': document.getElementById('raw-depth'),
      skeleton: document.getElementById('skeleton'),
      key: document.getElementById('key'),
      'depth-key': document.getElementById('depth-key'),
      rgbd: document.getElementById('rgbd'),
      'stop-all': document.getElementById('stop-all'),
    };

    // Add click listeners to all stream buttons
    Object.entries(streamButtons).forEach(([type, button]) => {
      if (button) {
        button.addEventListener('click', (event) =>
          this.handleStreamButton(event, type),
        );
      }
    });

    // Multiframe controls
    const multiButton = document.getElementById('multi');
    if (multiButton) {
      multiButton.addEventListener('click', () =>
        this.handleMultiFrame(),
      );
    }

    // Recording control
    const recordButton = document.getElementById('record');
    if (recordButton) {
      recordButton.addEventListener('click', () =>
        this.toggleRecording(),
      );
    }

    // API blocker
    const apiBlockerButton = document.getElementById('api-blocker');
    if (apiBlockerButton) {
      apiBlockerButton.addEventListener('click', () =>
        this.toggleAPIBlocker(),
      );
    }
  }

  async initializeKinect() {
    try {
      const initialized = await window.kinectron.initializeKinect();
      if (initialized) {
        console.log('Kinect initialized successfully');
        this.enableStreamControls(true);
        this.updateButtonState('start-kinect-azure', true);
      } else {
        console.error('Failed to initialize Kinect');
      }
    } catch (error) {
      console.error('Error initializing Kinect:', error);
    }
  }

  async handleMultiFrame() {
    // Get all checked checkboxes
    const checkboxes = document.querySelectorAll('.cb-multi:checked');
    const selectedStreams = Array.from(checkboxes).map(
      (cb) => cb.value,
    );

    if (selectedStreams.length === 0) {
      console.log('No streams selected for multiframe');
      return;
    }

    // Stop current stream if any
    if (this.currentStream) {
      await this.stopCurrentStream();
      // Wait 500ms to avoid ThreadSafeFunction error when switching feeds
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    try {
      // Initialize canvas dimensions for each stream
      selectedStreams.forEach((streamType) => {
        const canvas = document.getElementById(
          `${streamType === 'body' ? 'skeleton' : streamType}-canvas`,
        );
        if (canvas) {
          switch (streamType) {
            case 'color':
              canvas.width = 1280 / 2;
              canvas.height = 720 / 2;
              break;
            case 'depth':
            case 'body':
              canvas.width = 640;
              canvas.height = 576;
              break;
            case 'raw-depth':
              canvas.width = 320;
              canvas.height = 288;
              break;
          }
        }
      });

      const success = await window.kinectron.startMultiStream(
        selectedStreams,
      );
      if (success) {
        // Show all selected stream canvases
        selectedStreams.forEach((streamType) => {
          this.toggleFeedDiv(
            streamType === 'body' ? 'skeleton' : streamType,
            'block',
          );
        });

        this.currentStream = 'multi';
        this.updateButtonState('multi', true);

        // Set up cleanup functions for each stream
        selectedStreams.forEach((streamType) => {
          const cleanupName =
            streamType === 'body' ? 'skeleton' : streamType;
          const frameType =
            streamType === 'body'
              ? 'Body'
              : streamType.charAt(0).toUpperCase() +
                streamType.slice(1);
          const eventName = `on${frameType}Frame`;

          const cleanup = window.kinectron[eventName]((frameData) => {
            const processMethod = `process${frameType}Frame`;
            this[processMethod](frameData);
          });

          this.cleanupFunctions.set(cleanupName, cleanup);
        });
      }
    } catch (error) {
      console.error('Error starting multi-stream:', error);
    }
  }

  async handleStreamButton(event, streamType) {
    event.preventDefault();

    // If stop-all button is clicked
    if (streamType === 'stop-all') {
      if (this.currentStream) {
        await this.stopCurrentStream();
      }
      return;
    }

    // If there's an active stream, stop it first
    if (this.currentStream && this.currentStream !== streamType) {
      await this.stopCurrentStream();
      // Wait 500ms to avoid ThreadSafeFunction error when switching feeds
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Start the new stream
    try {
      let success = false;
      switch (streamType) {
        case 'color':
          success = await this.startColorStream();
          break;
        case 'depth':
          success = await this.startDepthStream();
          break;
        case 'raw-depth':
          success = await this.startRawDepthStream();
          break;
        case 'skeleton':
          success = await this.startBodyTracking();
          break;
        case 'key':
          success = await this.startKeyStream();
          break;
        case 'depth-key':
          success = await this.startDepthKeyStream();
          break;
        case 'rgbd':
          success = await this.startRGBDStream();
          break;
      }

      if (success) {
        this.currentStream = streamType;
        this.updateButtonState(streamType, true);
        this.toggleFeedDiv(streamType, 'block');
      }
    } catch (error) {
      console.error(`Error starting ${streamType} stream:`, error);
    }
  }

  async stopCurrentStream() {
    if (!this.currentStream) return;

    try {
      await window.kinectron.stopStream(this.currentStream);
      this.updateButtonState(this.currentStream, false);
      this.toggleFeedDiv(this.currentStream, 'none');
      const cleanup = this.cleanupFunctions.get(this.currentStream);
      if (cleanup) {
        cleanup();
        this.cleanupFunctions.delete(this.currentStream);
      }
      this.currentStream = null;
    } catch (error) {
      console.error('Error stopping stream:', error);
    }
  }

  async startColorStream() {
    console.log('startColorStream called');
    try {
      // Set up canvas with correct dimensions before starting stream
      const canvas = document.getElementById('color-canvas');
      if (canvas) {
        // Color image is reduced by half for efficiency
        canvas.width = 1280 / 2; // Azure Kinect color width
        canvas.height = 720 / 2; // Azure Kinect color height
        console.log(
          'Canvas dimensions set:',
          canvas.width,
          'x',
          canvas.height,
        );
      } else {
        console.error('Color canvas element not found!');
      }

      console.log('Calling window.kinectron.startColorStream()');
      const success = await window.kinectron.startColorStream();
      console.log(
        'window.kinectron.startColorStream() returned:',
        success,
      );

      if (success) {
        console.log('Setting up onColorFrame callback');
        const cleanup = window.kinectron.onColorFrame((frameData) => {
          console.log('onColorFrame callback received frame data');
          this.processColorFrame(frameData);
        });
        console.log('Callback registered, storing cleanup function');
        this.cleanupFunctions.set('color', cleanup);
      } else {
        console.error('Failed to start color stream');
      }
      return success;
    } catch (error) {
      console.error('Error starting color stream:', error);
      return false;
    }
  }

  processColorFrame(frameData) {
    const canvas = document.getElementById('color-canvas');
    if (!canvas) {
      console.error('Color canvas not found');
      return;
    }

    const context = canvas.getContext('2d');

    // Check for the new frame data structure (from peer connection)
    const imageData = frameData.imagedata || frameData.imageData;

    if (imageData) {
      try {
        // Check if data is a string (data URL)
        if (typeof imageData.data === 'string') {
          // Create an image from the data URL
          const img = new Image();
          img.onload = () => {
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the image to the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = imageData.data;
        } else {
          // Original code for handling raw pixel data
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = imageData.width;
          tempCanvas.height = imageData.height;
          const tempContext = tempCanvas.getContext('2d');

          // Draw the full-size image to the temporary canvas
          const imgData = new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height,
          );
          tempContext.putImageData(imgData, 0, 0);

          // Clear the target canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the scaled image from the temporary canvas to the target canvas
          context.drawImage(
            tempCanvas,
            0,
            0,
            imageData.width,
            imageData.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );
        }
      } catch (error) {
        console.error('Error drawing color frame:', error);
      }
    } else {
      console.error('Color frame missing image data:', frameData);
    }
  }

  async startDepthStream() {
    console.log('startDepthStream called');
    try {
      const canvas = document.getElementById('depth-canvas');
      if (canvas) {
        canvas.width = 640; // Azure Kinect depth width
        canvas.height = 576; // Azure Kinect depth height
        console.log(
          'Depth canvas dimensions set:',
          canvas.width,
          'x',
          canvas.height,
        );
      } else {
        console.error('Depth canvas element not found!');
      }

      console.log('Calling window.kinectron.startDepthStream()');
      const success = await window.kinectron.startDepthStream();
      console.log(
        'window.kinectron.startDepthStream() returned:',
        success,
      );

      if (success) {
        console.log('Setting up onDepthFrame callback');
        const cleanup = window.kinectron.onDepthFrame((frameData) => {
          console.log('onDepthFrame callback received frame data');
          this.processDepthFrame(frameData);
        });
        console.log('Callback registered, storing cleanup function');
        this.cleanupFunctions.set('depth', cleanup);
      } else {
        console.error('Failed to start depth stream');
      }
      return success;
    } catch (error) {
      console.error('Error starting depth stream:', error);
      return false;
    }
  }

  processDepthFrame(frameData) {
    console.log(
      'APP: processDepthFrame called with data:',
      frameData,
    );
    console.log(
      'APP: Frame data structure:',
      frameData
        ? `name=${frameData.name}, has imagedata=${
            !!frameData.imagedata || !!frameData.imageData
          }`
        : 'null',
    );

    const canvas = document.getElementById('depth-canvas');
    if (!canvas) {
      console.error('APP: Depth canvas not found');
      return;
    }
    console.log(
      'APP: Found depth canvas with dimensions:',
      canvas.width,
      'x',
      canvas.height,
    );

    const context = canvas.getContext('2d');
    if (!context) {
      console.error(
        'APP: Could not get 2D context from depth canvas',
      );
      return;
    }

    // Check for the new frame data structure (from peer connection)
    const imageData = frameData.imagedata || frameData.imageData;

    if (imageData) {
      console.log(
        'APP: Depth frame has imageData, dimensions:',
        imageData.width,
        'x',
        imageData.height,
        'data type:',
        typeof imageData.data,
        'data length:',
        typeof imageData.data === 'string'
          ? imageData.data.substring(0, 50) + '...'
          : imageData.data
          ? imageData.data.length
          : 'null',
      );

      try {
        // Check if data is a string (data URL)
        if (typeof imageData.data === 'string') {
          console.log('APP: Depth frame data is a string (data URL)');
          // Create an image from the data URL
          const img = new Image();

          img.onload = () => {
            console.log(
              'APP: Depth image loaded successfully, drawing to canvas',
              img.width,
              'x',
              img.height,
            );
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the image to the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('APP: Image drawn to canvas');
          };

          img.onerror = (err) => {
            console.error('APP: Error loading depth image:', err);
            console.error(
              'APP: Data URL starts with:',
              imageData.data.substring(0, 50) + '...',
            );
          };

          console.log('APP: Setting image src to data URL');
          img.src = imageData.data;
          console.log('APP: Image src set');
        } else {
          console.log(
            'APP: Processing raw pixel data for depth frame',
          );
          // Original code for handling raw pixel data
          const imgData = new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height,
          );
          context.putImageData(imgData, 0, 0);
          console.log('APP: Raw pixel data drawn to canvas');
        }
      } catch (error) {
        console.error('APP: Error drawing depth frame:', error);
        console.error('APP: Frame data type:', typeof imageData.data);
        if (typeof imageData.data === 'string') {
          console.error(
            'APP: Data URL starts with:',
            imageData.data.substring(0, 50) + '...',
          );
        }
      }
    } else {
      console.error(
        'APP: Depth frame missing image data:',
        frameData,
      );
    }
  }

  async startRawDepthStream() {
    try {
      const canvas = document.getElementById('raw-depth-canvas');
      if (canvas) {
        canvas.width = 320; // Azure Kinect raw depth width
        canvas.height = 288; // Azure Kinect raw depth height
      }

      const success = await window.kinectron.startRawDepthStream();
      if (success) {
        const cleanup = window.kinectron.onRawDepthFrame(
          (frameData) => {
            this.processRawDepthFrame(frameData);
          },
        );
        this.cleanupFunctions.set('raw-depth', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting raw depth stream:', error);
      return false;
    }
  }

  processRawDepthFrame(frameData) {
    const canvas = document.getElementById('raw-depth-canvas');
    if (!canvas) {
      console.error('Raw depth canvas not found');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get 2D context from raw depth canvas');
      return;
    }

    // Get the image data (directly a string data URL)
    const imageDataUrl = frameData.imagedata;

    if (imageDataUrl) {
      try {
        // Create an image from the data URL
        const img = new Image();

        img.onload = () => {
          // Set canvas dimensions to match the image
          canvas.width = frameData.width;
          canvas.height = frameData.height;

          // Create a temporary canvas to extract the pixel data
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = frameData.width;
          tempCanvas.height = frameData.height;
          const tempContext = tempCanvas.getContext('2d');

          // Draw the image to the temporary canvas
          tempContext.drawImage(img, 0, 0);

          // Get the pixel data
          const imageData = tempContext.getImageData(
            0,
            0,
            frameData.width,
            frameData.height,
          );

          // Process the raw depth data exactly like the legacy client code
          const processedData = [];

          for (let i = 0; i < imageData.data.length; i += 4) {
            // Extract depth value from R and G channels
            const depth =
              (imageData.data[i + 1] << 8) | imageData.data[i]; // Get uint16 data from buffer
            processedData.push(depth);
          }

          // Create a visualization of the depth data
          const depthImageData = context.createImageData(
            frameData.width,
            frameData.height,
          );

          // Copy the original image data for visualization
          for (let i = 0; i < imageData.data.length; i++) {
            depthImageData.data[i] = imageData.data[i];
          }

          // Verify test values if they are included in the frame data
          if (frameData.testValues) {
            const testValues = frameData.testValues;
            const unpackedValue1000 = processedData[1000];
            const unpackedValue2000 = processedData[2000];
            const unpackedValue3000 = processedData[3000];

            console.log('APP TEST VALUES COMPARISON:');
            console.table({
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

            // Log the raw data for the test indices
            const getPixelIndex = (index) => index * 4;

            const idx1000 = getPixelIndex(1000);
            const idx2000 = getPixelIndex(2000);
            const idx3000 = getPixelIndex(3000);

            console.log('RAW PIXEL DATA FOR TEST INDICES:');
            console.table({
              'Index 1000': {
                'R Channel': imageData.data[idx1000],
                'G Channel': imageData.data[idx1000 + 1],
                'B Channel': imageData.data[idx1000 + 2],
                'A Channel': imageData.data[idx1000 + 3],
                'Reconstructed Value': processedData[1000],
              },
              'Index 2000': {
                'R Channel': imageData.data[idx2000],
                'G Channel': imageData.data[idx2000 + 1],
                'B Channel': imageData.data[idx2000 + 2],
                'A Channel': imageData.data[idx2000 + 3],
                'Reconstructed Value': processedData[2000],
              },
              'Index 3000': {
                'R Channel': imageData.data[idx3000],
                'G Channel': imageData.data[idx3000 + 1],
                'B Channel': imageData.data[idx3000 + 2],
                'A Channel': imageData.data[idx3000 + 3],
                'Reconstructed Value': processedData[3000],
              },
            });
          }

          // Draw the depth data
          context.putImageData(depthImageData, 0, 0);
          console.log('Raw depth data processed and drawn to canvas');
        };

        img.onerror = (err) => {
          console.error('Error loading raw depth image:', err);
        };

        img.src = imageDataUrl;
      } catch (error) {
        console.error('Error drawing raw depth frame:', error);
      }
    } else {
      console.error('Raw depth frame missing image data:', frameData);
    }
  }

  async startBodyTracking() {
    try {
      const canvas = document.getElementById('skeleton-canvas');
      if (canvas) {
        canvas.width = 640; // Azure Kinect depth width
        canvas.height = 576; // Azure Kinect depth height
      }

      const success = await window.kinectron.startBodyTracking();
      if (success) {
        const cleanup = window.kinectron.onBodyFrame((frameData) => {
          this.processBodyFrame(frameData);
        });
        this.cleanupFunctions.set('skeleton', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting body tracking:', error);
      return false;
    }
  }

  processBodyFrame(frameData) {
    const canvas = document.getElementById('skeleton-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!frameData.bodies || frameData.bodies.length === 0) return;

    const colors = [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#ffff00',
      '#00ffff',
      '#ff00ff',
    ];

    frameData.bodies.forEach((body, index) => {
      if (body.skeleton && body.skeleton.joints) {
        this.drawSkeleton(
          context,
          body.skeleton.joints,
          colors[index % colors.length],
        );
      }
    });
  }

  drawSkeleton(context, joints, color) {
    // Draw joints
    joints.forEach((joint) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(
        joint.depthX * context.canvas.width,
        joint.depthY * context.canvas.height,
        5,
        0,
        2 * Math.PI,
      );
      context.fill();
    });
  }

  async startKeyStream() {
    try {
      const canvas = document.getElementById('key-canvas');
      if (canvas) {
        // Key uses color resolution but reduced by half for efficiency
        canvas.width = 1280 / 2; // Azure Kinect color width
        canvas.height = 720 / 2; // Azure Kinect color height
      }

      const success = await window.kinectron.startKeyStream();
      if (success) {
        const cleanup = window.kinectron.onKeyFrame((frameData) => {
          this.processKeyFrame(frameData);
        });
        this.cleanupFunctions.set('key', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting key stream:', error);
      return false;
    }
  }

  processKeyFrame(frameData) {
    console.log('Processing key frame:', frameData);
    const canvas = document.getElementById('key-canvas');
    if (!canvas) {
      console.error('Key canvas not found');
      return;
    }

    const context = canvas.getContext('2d');
    // Check for both imageData and imagedata formats
    const imageData = frameData.imageData || frameData.imagedata;

    console.log('Key frame image data:', imageData);

    if (imageData && imageData.data) {
      try {
        // Check if data is a string (data URL)
        if (typeof imageData.data === 'string') {
          console.log('Key frame data is a data URL');
          // Create an image from the data URL
          const img = new Image();
          img.onload = () => {
            console.log(
              'Key image loaded successfully, dimensions:',
              img.width,
              'x',
              img.height,
            );
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the image to the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('Key image drawn to canvas');
          };
          img.onerror = (err) => {
            console.error('Error loading key image:', err);
            console.error(
              'Data URL starts with:',
              imageData.data.substring(0, 50) + '...',
            );
          };
          img.src = imageData.data;
        } else {
          console.log('Key frame data is raw pixel data');
          // Create a temporary canvas to hold the full-size image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = imageData.width;
          tempCanvas.height = imageData.height;
          const tempContext = tempCanvas.getContext('2d');

          // Draw the full-size image to the temporary canvas
          const imgData = new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height,
          );
          tempContext.putImageData(imgData, 0, 0);

          // Clear the target canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the scaled image from the temporary canvas to the target canvas
          context.drawImage(
            tempCanvas,
            0,
            0,
            imageData.width,
            imageData.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );
          console.log(
            'Key image drawn to canvas from raw pixel data',
          );
        }
      } catch (error) {
        console.error('Error drawing key frame:', error);
        console.error('Frame data type:', typeof imageData.data);
        if (typeof imageData.data === 'string') {
          console.error(
            'Data URL starts with:',
            imageData.data.substring(0, 50) + '...',
          );
        }
      }
    } else {
      console.error('Key frame missing image data:', frameData);
    }
  }

  async startDepthKeyStream() {
    try {
      const canvas = document.getElementById('depth-key-canvas');
      if (canvas) {
        canvas.width = 320; // Azure Kinect raw depth width
        canvas.height = 288; // Azure Kinect raw depth height
      }

      const success = await window.kinectron.startDepthKeyStream();
      if (success) {
        const cleanup = window.kinectron.onDepthKeyFrame(
          (frameData) => {
            this.processDepthKeyFrame(frameData);
          },
        );
        this.cleanupFunctions.set('depth-key', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting depth key stream:', error);
      return false;
    }
  }

  processDepthKeyFrame(frameData) {
    console.log('Processing depth key frame:', frameData);
    const canvas = document.getElementById('depth-key-canvas');
    if (!canvas) {
      console.error('Depth key canvas not found');
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error('Could not get 2D context from depth key canvas');
      return;
    }

    // Check for the imageData property
    if (frameData.imageData && frameData.imageData.data) {
      try {
        // Check if data is a string (data URL)
        if (typeof frameData.imageData.data === 'string') {
          console.log('Depth key frame data is a data URL');
          // Create an image from the data URL
          const img = new Image();
          img.onload = () => {
            console.log(
              'Depth key image loaded successfully, dimensions:',
              img.width,
              'x',
              img.height,
            );
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the image to the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('Depth key image drawn to canvas');
          };
          img.onerror = (err) => {
            console.error('Error loading depth key image:', err);
            console.error(
              'Data URL starts with:',
              frameData.imageData.data.substring(0, 50) + '...',
            );
          };
          img.src = frameData.imageData.data;
        } else {
          console.log('Depth key frame data is raw pixel data');
          // Create a temporary canvas to hold the full-size image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = frameData.imageData.width;
          tempCanvas.height = frameData.imageData.height;
          const tempContext = tempCanvas.getContext('2d');

          // Draw the full-size image to the temporary canvas
          const imageData = new ImageData(
            new Uint8ClampedArray(frameData.imageData.data),
            frameData.imageData.width,
            frameData.imageData.height,
          );
          tempContext.putImageData(imageData, 0, 0);

          // Clear the target canvas
          context.clearRect(0, 0, canvas.width, canvas.height);

          // Draw the scaled image from the temporary canvas to the target canvas
          context.drawImage(
            tempCanvas,
            0,
            0,
            frameData.imageData.width,
            frameData.imageData.height,
            0,
            0,
            canvas.width,
            canvas.height,
          );
          console.log(
            'Depth key image drawn to canvas from raw pixel data',
          );
        }
      } catch (error) {
        console.error('Error drawing depth key frame:', error);
        console.error(
          'Frame data type:',
          typeof frameData.imageData.data,
        );
        if (typeof frameData.imageData.data === 'string') {
          console.error(
            'Data URL starts with:',
            frameData.imageData.data.substring(0, 50) + '...',
          );
        }
      }
    } else {
      console.error('Depth key frame missing image data:', frameData);
    }
  }

  async startRGBDStream() {
    try {
      const canvas = document.getElementById('rgbd-canvas');
      if (canvas) {
        canvas.width = 512; // Azure Kinect RGBD width
        canvas.height = 512; // Azure Kinect RGBD height
      }

      const success = await window.kinectron.startRGBDStream();
      if (success) {
        const cleanup = window.kinectron.onRGBDFrame((frameData) => {
          this.processRGBDFrame(frameData);
        });
        this.cleanupFunctions.set('rgbd', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting RGBD stream:', error);
      return false;
    }
  }

  processRGBDFrame(frameData) {
    console.log('Processing RGBD frame:', frameData);
    const canvas = document.getElementById('rgbd-canvas');
    if (!canvas) {
      console.error('RGBD canvas not found');
      return;
    }

    const context = canvas.getContext('2d');
    // Check for both imageData and imagedata formats
    const imageData = frameData.imageData || frameData.imagedata;

    console.log(
      'RGBD frame image data:',
      imageData
        ? {
            width: imageData.width,
            height: imageData.height,
            dataType: typeof imageData.data,
            hasData: !!imageData.data,
          }
        : 'null',
    );

    if (imageData && imageData.data) {
      try {
        // Check if data is a string (data URL)
        if (typeof imageData.data === 'string') {
          console.log('RGBD frame data is a data URL');
          // Create an image from the data URL
          const img = new Image();
          img.onload = () => {
            console.log(
              'RGBD image loaded successfully, dimensions:',
              img.width,
              'x',
              img.height,
            );
            // Clear the canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            // Draw the image to the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            console.log('RGBD image drawn to canvas');
          };
          img.onerror = (err) => {
            console.error('Error loading RGBD image:', err);
            console.error(
              'Data URL starts with:',
              imageData.data.substring(0, 50) + '...',
            );
          };
          img.src = imageData.data;
        } else {
          console.log('RGBD frame data is raw pixel data');
          // For RGBD, we want to preserve the alpha channel exactly as it comes from the backend
          // so we'll draw directly to the canvas without scaling
          const imgData = new ImageData(
            new Uint8ClampedArray(imageData.data),
            imageData.width,
            imageData.height,
          );
          context.putImageData(imgData, 0, 0);
          console.log('RGBD raw pixel data drawn to canvas');
        }
      } catch (error) {
        console.error('Error drawing RGBD frame:', error);
        console.error('Frame data type:', typeof imageData.data);
        if (typeof imageData.data === 'string') {
          console.error(
            'Data URL starts with:',
            imageData.data.substring(0, 50) + '...',
          );
        }
      }
    } else {
      console.error('RGBD frame missing image data:', frameData);
    }
  }

  setupCanvas(canvasId, width, height) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
      return canvas;
    }
    return null;
  }

  updateButtonState(buttonId, active) {
    const button = document.getElementById(buttonId);
    if (button) {
      if (active) {
        button.style.background = BUTTON_ACTIVE_COLOR;
        button.style.color = '#fff';
      } else {
        button.style.background = BUTTON_INACTIVE_COLOR;
        button.style.color = BUTTON_ACTIVE_COLOR;
      }
    }
  }

  toggleFeedDiv(streamType, display) {
    console.log(
      `toggleFeedDiv called for ${streamType} with display=${display}`,
    );
    const divId = streamType === 'skeleton' ? 'skeleton' : streamType;
    const feedDiv = document.getElementById(`${divId}-div`);
    console.log(`Looking for element with ID: ${divId}-div`);

    if (feedDiv) {
      console.log(
        `Found feed div for ${streamType}, setting display to ${display}`,
      );
      feedDiv.style.display = display;

      // Also check if the canvas exists
      const canvas = document.getElementById(`${divId}-canvas`);
      if (canvas) {
        console.log(
          `Found canvas for ${streamType}, dimensions: ${canvas.width}x${canvas.height}`,
        );
      } else {
        console.error(`Canvas not found for ${streamType}`);
      }
    } else {
      console.error(`Feed div not found for ${streamType}`);
    }
  }

  enableStreamControls(enabled) {
    const controls = document.getElementById('additional-controls');
    if (controls) {
      controls.style.display = enabled ? 'block' : 'none';
    }
  }

  async cleanup() {
    await this.stopCurrentStream();
    for (const [_, cleanup] of this.cleanupFunctions) {
      cleanup();
    }
    this.cleanupFunctions.clear();

    try {
      // Stop ngrok if it's running
      const ngrokStatus = await window.kinectron.getNgrokStatus();
      if (ngrokStatus.isConnected) {
        await window.kinectron.stopNgrok();
      }

      await window.kinectron.closeKinect();
      this.peerController.cleanup();
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}

// Export the initialization function
export function initializeUI() {
  const app = new KinectronApp();

  // Clean up when the window is closed
  window.addEventListener('beforeunload', () => {
    app.cleanup();
  });

  return app;
}
