// renderer/js/app.js

const BUTTON_INACTIVE_COLOR = '#fff';
const BUTTON_ACTIVE_COLOR = '#1daad8';

import { PeerConnectionController } from './peer/peerConnectionController.js';

class KinectronApp {
  constructor() {
    this.cleanupFunctions = new Map();
    this.currentStream = null;
    this.peerController = new PeerConnectionController();
    this.setupUIListeners();
    this.setupPeerListeners();
    this.setupNgrokListeners();
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
    try {
      // Set up canvas with correct dimensions before starting stream
      const canvas = document.getElementById('color-canvas');
      if (canvas) {
        // Color image is reduced by half for efficiency
        canvas.width = 1280 / 2; // Azure Kinect color width
        canvas.height = 720 / 2; // Azure Kinect color height
      }

      const success = await window.kinectron.startColorStream();
      if (success) {
        const cleanup = window.kinectron.onColorFrame((frameData) => {
          this.processColorFrame(frameData);
        });
        this.cleanupFunctions.set('color', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting color stream:', error);
      return false;
    }
  }

  processColorFrame(frameData) {
    const canvas = document.getElementById('color-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (frameData.imageData && frameData.imageData.data) {
      try {
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
      } catch (error) {
        console.error('Error drawing color frame:', error);
      }
    }
  }

  async startDepthStream() {
    try {
      const canvas = document.getElementById('depth-canvas');
      if (canvas) {
        canvas.width = 640; // Azure Kinect depth width
        canvas.height = 576; // Azure Kinect depth height
      }

      const success = await window.kinectron.startDepthStream();
      if (success) {
        const cleanup = window.kinectron.onDepthFrame((frameData) => {
          this.processDepthFrame(frameData);
        });
        this.cleanupFunctions.set('depth', cleanup);
      }
      return success;
    } catch (error) {
      console.error('Error starting depth stream:', error);
      return false;
    }
  }

  processDepthFrame(frameData) {
    const canvas = document.getElementById('depth-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (frameData.imageData && frameData.imageData.data) {
      const imageData = new ImageData(
        new Uint8ClampedArray(frameData.imageData.data),
        frameData.imageData.width,
        frameData.imageData.height,
      );
      context.putImageData(imageData, 0, 0);
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
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (frameData.imageData && frameData.imageData.data) {
      const imageData = new ImageData(
        new Uint8ClampedArray(frameData.imageData.data),
        frameData.imageData.width,
        frameData.imageData.height,
      );
      context.putImageData(imageData, 0, 0);
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
    const canvas = document.getElementById('key-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (frameData.imageData && frameData.imageData.data) {
      try {
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
      } catch (error) {
        console.error('Error drawing key frame:', error);
      }
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
    const canvas = document.getElementById('depth-key-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (frameData.imageData && frameData.imageData.data) {
      try {
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
      } catch (error) {
        console.error('Error drawing depth key frame:', error);
      }
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
    const canvas = document.getElementById('rgbd-canvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (frameData.imageData && frameData.imageData.data) {
      try {
        // For RGBD, we want to preserve the alpha channel exactly as it comes from the backend
        // so we'll draw directly to the canvas without scaling
        const imageData = new ImageData(
          new Uint8ClampedArray(frameData.imageData.data),
          frameData.imageData.width,
          frameData.imageData.height,
        );
        context.putImageData(imageData, 0, 0);
      } catch (error) {
        console.error('Error drawing RGBD frame:', error);
      }
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
    const divId = streamType === 'skeleton' ? 'skeleton' : streamType;
    const feedDiv = document.getElementById(`${divId}-div`);
    if (feedDiv) {
      feedDiv.style.display = display;
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
