/**
 * KinectController
 * Handles Kinectron initialization, connection, and stream management
 */
class KinectController {
  constructor(dependencies) {
    this.debug = dependencies.debug;
    this.metrics = dependencies.metrics;
    this.ui = dependencies.ui;
    this.visualization = dependencies.visualization;

    this.isStreamActive = false;
    this.currentStreamType = null;
    this.bodyFrameCallback = null;

    // Constants
    this.AZURE_COLOR_WIDTH = 1280;
    this.AZURE_COLOR_HEIGHT = 720;
    this.AZURE_DEPTH_WIDTH = 640;
    this.AZURE_DEPTH_HEIGHT = 576;
    this.AZURE_RGBD_WIDTH = 512;
    this.AZURE_RGBD_HEIGHT = 512;
    this.DISPLAY_SCALE = 0.5;

    // Bind methods to maintain 'this' context
    this.initKinect = this.initKinect.bind(this);
    this.startColorStream = this.startColorStream.bind(this);
    this.startDepthStream = this.startDepthStream.bind(this);
    this.startRawDepthStream = this.startRawDepthStream.bind(this);
    this.startSkeletonStream = this.startSkeletonStream.bind(this);
    this.startKeyStream = this.startKeyStream.bind(this);
    this.startRGBDStream = this.startRGBDStream.bind(this);
    this.startDepthKeyStream = this.startDepthKeyStream.bind(this);
    this.stopStream = this.stopStream.bind(this);

    // Set up UI event handlers
    this._setupUIEventHandlers();

    // Create Kinectron instance and connect to peer server
    this.debug.addDebugInfo(
      'Creating Kinectron instance and connecting to peer server...',
      true,
    );
    this.kinectron = new Kinectron({
      host: '127.0.0.1',
      port: 9001,
      path: '/',
    });

    // Set up Kinectron event handlers
    this._setupKinectronEvents();

    // Connect to server
    this.kinectron.peer.connect();
    this.ui.updateConnectionStatus(
      'Connecting to peer server...',
      false,
    );
  }

  /**
   * Initialize the controller
   * @param {Object} dependencies - Controller dependencies
   * @returns {KinectController} - The initialized controller instance
   */
  static initialize(dependencies) {
    const controller = new KinectController(dependencies);
    return controller;
  }

  /**
   * Set up UI event handlers
   * @private
   */
  _setupUIEventHandlers() {
    // Set up event handlers for UI elements
    this.ui.setupEventHandlers({
      initializeKinect: this.initKinect,
      startColorStream: this.startColorStream,
      startDepthStream: this.startDepthStream,
      startRawDepthStream: this.startRawDepthStream,
      startSkeletonStream: this.startSkeletonStream,
      startKeyStream: this.startKeyStream,
      startRGBDStream: this.startRGBDStream,
      startDepthKeyStream: this.startDepthKeyStream,
      stopStream: this.stopStream,
      forceEnableButtons: () => this.ui.forceEnableButtons(),
      clearDebugInfo: () => this.debug.clearDebugInfo(),
      toggleDebug: (enabled) => this.debug.toggleDebug(enabled),
      toggleFramesDebug: (enabled) =>
        this.debug.toggleFramesDebug(enabled),
      toggleHandlersDebug: (enabled) =>
        this.debug.toggleHandlersDebug(enabled),
      togglePerformanceDebug: (enabled) =>
        this.debug.togglePerformanceDebug(enabled),
      toggleDataDebug: (enabled) =>
        this.debug.toggleDataDebug(enabled),
      togglePeerDebug: (enabled) =>
        this.debug.togglePeerDebug(enabled),
      toggleNetworkDebug: (enabled) =>
        this.debug.toggleNetworkDebug(enabled),
    });
  }

  /**
   * Initialize Kinect hardware
   */
  async initKinect() {
    this.ui.updateStreamStatus('Initializing Kinect...');
    this.debug.addDebugInfo('Initializing Kinect...', true);

    try {
      // Initialize Kinect on the server
      this.debug.addDebugInfo('Calling kinectron.initKinect()', true);
      const result = await this.kinectron.initKinect();

      if (window.DEBUG.DATA) {
        window.log.data('Kinect initialization result:', result);
      }

      // Check for success in the normalized result
      if (result.success || result.alreadyInitialized) {
        this.debug.addDebugInfo(
          'Kinect initialized successfully - enabling buttons',
          true,
        );
        this.ui.updateStreamStatus(
          `Kinect ${
            result.alreadyInitialized ? 'Already' : ''
          } Initialized Successfully`,
          true,
        );
        // Set Kinect as initialized and enable buttons
        this.ui.setKinectInitialized(true);
        this.ui.enableStreamButtons();
      } else {
        this.debug.addDebugInfo(
          `Kinect initialization failed: ${
            result.error || 'Unknown error'
          }`,
          true,
        );
        this.ui.updateStreamStatus(
          `Kinect Initialization Failed: ${
            result.error || 'Unknown error'
          }`,
          false,
        );
      }

      // Try to force enable buttons if they're still disabled
      if (this.ui.areButtonsDisabled()) {
        this.debug.addDebugInfo(
          'Buttons still disabled after update, forcing enable...',
          true,
        );
        this.ui.forceEnableButtons();
      }
    } catch (error) {
      this.debug.addDebugInfo(
        `Error initializing Kinect: ${
          error.message || 'Unknown error'
        }`,
        true,
      );
      this.ui.updateStreamStatus(
        `Kinect Initialization Failed: ${
          error.message || 'Unknown error'
        }`,
        false,
      );
    }
  }

  /**
   * Set up Kinectron event handlers
   * @private
   */
  _setupKinectronEvents() {
    // Connection status handling
    this.kinectron.on('ready', () => {
      this.ui.updateConnectionStatus('Connected', true);
      this.debug.addDebugInfo('Peer connection ready', true);
      // Enable the Initialize Kinect button now that we're connected
      this.ui.enableInitializeKinectButton();
    });

    this.kinectron.on('error', (error) => {
      this.ui.updateConnectionStatus(
        `Error - ${error.error || error.message}`,
        false,
      );
      console.error('Connection error:', error);
      this.debug.addDebugInfo(
        `Connection error: ${error.error || error.message}`,
        true,
      );
    });

    // Direct event listener for kinectInitialized as a backup approach
    this.kinectron.on('kinectInitialized', (data) => {
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

      // Enable buttons if successful
      if (isSuccess || data.alreadyInitialized) {
        // Set Kinect as initialized and enable buttons
        this.ui.setKinectInitialized(true);
        this.ui.enableStreamButtons();
        this.ui.updateStreamStatus(
          'Kinect Initialized via Direct Event',
          true,
        );
        this.debug.addDebugInfo(
          'Kinect initialized successfully via direct event',
          true,
        );
      } else {
        this.debug.addDebugInfo(
          `Kinect initialization had issues: ${
            data.error || 'Unknown error'
          }`,
          true,
        );
      }
    });

    // Add a data event listener to capture all peer messages
    this.kinectron.on('data', (data) => {
      if (window.DEBUG.DATA) {
        window.log.data('Raw data event received:', data);
      }
    });
  }

  /**
   * Start color stream
   */
  startColorStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'color';

    // Show p5 canvas and hide Three.js canvas
    this.visualization.showP5Canvas();

    // Resize canvas for color stream
    this.visualization.resizeP5Canvas(
      this.AZURE_COLOR_WIDTH * this.DISPLAY_SCALE,
      this.AZURE_COLOR_HEIGHT * this.DISPLAY_SCALE,
    );

    this.kinectron.startColor((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (Color)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Use p5.js loadImage to handle the frame data
      this.visualization.displayColorFrame(frame);
    });
  }

  /**
   * Start depth stream
   */
  startDepthStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'depth';

    // Show p5 canvas and hide Three.js canvas
    this.visualization.showP5Canvas();

    // Resize canvas for depth stream
    this.visualization.resizeP5Canvas(
      this.AZURE_DEPTH_WIDTH * this.DISPLAY_SCALE,
      this.AZURE_DEPTH_HEIGHT * this.DISPLAY_SCALE,
    );

    this.debug.addDebugInfo('Starting depth stream...', true);
    this.kinectron.startDepth((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (Depth)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Display the depth frame
      this.visualization.displayDepthFrame(frame);
    });
  }

  /**
   * Start raw depth stream
   */
  startRawDepthStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'rawDepth';

    // Hide p5 canvas and show Three.js canvas
    this.visualization.showThreeCanvas();

    this.debug.addDebugInfo('Starting raw depth stream...', true);
    this.kinectron.startRawDepth((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (Raw Depth)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Update the point cloud with the depth values
      if (frame.depthValues) {
        this.visualization.updatePointCloud(frame.depthValues);

        // Update resolution info
        this.ui.updateResolution(
          `${frame.width}x${frame.height} | Depth Values: ${
            frame.depthValues.length
          } | Avg Latency: ${this.metrics.getAverageLatency()}ms`,
        );

        if (window.DEBUG.DATA) {
          this._logDepthStatistics(frame.depthValues);
        }
      }
    });
  }

  /**
   * Start skeleton stream
   */
  startSkeletonStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'skeleton';

    // Show p5 canvas and hide Three.js canvas
    this.visualization.showP5Canvas();

    // Resize canvas for skeleton stream (using depth dimensions)
    this.visualization.resizeP5Canvas(
      this.AZURE_DEPTH_WIDTH * this.DISPLAY_SCALE,
      this.AZURE_DEPTH_HEIGHT * this.DISPLAY_SCALE,
    );

    this.debug.addDebugInfo('Starting skeleton stream...', true);

    // Use the standard callback approach instead of direct event listeners
    this.kinectron.startBodies((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (Skeleton)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Log this with debug flags to help diagnose the issue
      if (window.DEBUG.FRAMES) {
        window.log.frame('KinectController: Received skeleton frame');
        window.log.frame('Frame type:', typeof frame);
        window.log.frame(
          'Frame has bodies:',
          frame && !!frame.bodies,
        );

        if (frame && frame.bodies) {
          window.log.frame('Bodies count:', frame.bodies.length);
        }
      }

      // Log the skeleton data to verify it's working
      if (window.DEBUG.DATA) {
        window.log.data('Skeleton Frame Data:');
        window.log.data(
          'Bodies:',
          frame.bodies ? frame.bodies.length : 0,
        );
        window.log.data('Frame data:', frame);
      }

      // Update resolution info
      this.ui.updateResolution(
        `Bodies: ${
          frame.bodies ? frame.bodies.length : 0
        } | Avg Latency: ${this.metrics.getAverageLatency()}ms`,
      );

      // Display the skeleton frame using the P5Visualizer
      if (window.DEBUG.FRAMES) {
        window.log.frame(
          'Calling visualization.displaySkeletonFrame',
        );
      }
      this.visualization.displaySkeletonFrame(frame);
    });

    // Debug info
    this.debug.addDebugInfo('Skeleton stream started', true);
  }

  /**
   * Start key stream
   */
  startKeyStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'key';

    // Show p5 canvas and hide Three.js canvas
    this.visualization.showP5Canvas();

    // Resize canvas for key stream (using color dimensions since key is based on color)
    this.visualization.resizeP5Canvas(
      this.AZURE_COLOR_WIDTH * this.DISPLAY_SCALE,
      this.AZURE_COLOR_HEIGHT * this.DISPLAY_SCALE,
    );

    this.debug.addDebugInfo('Starting key stream...', true);

    // Debug info
    this.debug.addDebugInfo('Key stream started', true);

    this.kinectron.startKey((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (Key)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Log the frame data to verify structure
      if (window.DEBUG.DATA) {
        window.log.data('Key Frame Data:');
        window.log.data('Frame received:', frame);
        window.log.data('Frame type:', typeof frame);
        window.log.data('Has src:', !!frame.src);
        window.log.data(
          'Dimensions:',
          frame.width,
          'x',
          frame.height,
        );
      }

      // Update resolution info
      this.ui.updateResolution(
        `${frame.width}x${
          frame.height
        } | Avg Latency: ${this.metrics.getAverageLatency()}ms`,
      );

      // Display the key frame (using the same method as color frame)
      this.visualization.displayColorFrame(frame);
    });
  }

  /**
   * Start RGBD stream
   */
  startRGBDStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'rgbd';

    // Show p5 canvas and hide Three.js canvas
    this.visualization.showP5Canvas();

    // Resize canvas for RGBD stream
    this.visualization.resizeP5Canvas(
      this.AZURE_RGBD_WIDTH,
      this.AZURE_RGBD_HEIGHT,
    );

    this.debug.addDebugInfo('Starting RGBD stream...', true);

    // Debug info
    this.debug.addDebugInfo('RGBD stream started', true);

    this.kinectron.startRGBD((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (RGBD)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Log the frame data to verify structure
      if (window.DEBUG.DATA) {
        window.log.data('RGBD Frame Data:');
        window.log.data('Frame received:', frame);
        window.log.data('Frame type:', typeof frame);
        window.log.data('Has src:', !!frame.src);
        window.log.data(
          'Dimensions:',
          frame.width,
          'x',
          frame.height,
        );
      }

      // Update resolution info
      this.ui.updateResolution(
        `${frame.width}x${
          frame.height
        } | Avg Latency: ${this.metrics.getAverageLatency()}ms`,
      );

      // Display the RGBD frame (using the same method as color frame)
      this.visualization.displayColorFrame(frame);
    });
  }

  /**
   * Start depth key stream
   */
  startDepthKeyStream() {
    this.ui.updateStreamStatus('Stream Status: Starting...');
    this.metrics.resetMetrics();
    this.isStreamActive = true;
    this.currentStreamType = 'depthKey';

    // Hide p5 canvas and show Three.js canvas (same as raw depth)
    this.visualization.showThreeCanvas();

    this.debug.addDebugInfo('Starting depth key stream...', true);

    // Debug info
    this.debug.addDebugInfo('Depth key stream started', true);

    this.kinectron.startDepthKey((frame) => {
      // Update stream status
      this.ui.updateStreamStatus('Active (Depth Key)', true);

      // Update metrics
      this.metrics.updateFrameMetrics(frame);

      // Log the frame data to verify structure
      if (window.DEBUG.DATA) {
        window.log.data('Depth Key Frame Data:');
        window.log.data('Frame received:', frame);
        window.log.data('Frame type:', typeof frame);
        window.log.data('Has src:', !!frame.src);
        window.log.data(
          'Dimensions:',
          frame.width,
          'x',
          frame.height,
        );
      }

      // Update resolution info
      this.ui.updateResolution(
        `${frame.width}x${
          frame.height
        } | Avg Latency: ${this.metrics.getAverageLatency()}ms`,
      );

      // Extract the depth values from the frame
      if (frame.src) {
        // Create an image to load the data URL
        const img = new Image();
        img.onload = () => {
          // Create a canvas to extract the pixel data
          const canvas = document.createElement('canvas');
          canvas.width = frame.width;
          canvas.height = frame.height;
          const ctx = canvas.getContext('2d');

          // Draw the image to the canvas
          ctx.drawImage(img, 0, 0);

          // Get the pixel data
          const imageData = ctx.getImageData(
            0,
            0,
            frame.width,
            frame.height,
          );
          const pixelData = imageData.data;

          // Create array for depth values
          const depthValues = new Uint16Array(
            frame.width * frame.height,
          );

          // Process the depth key data - only include pixels that belong to a body
          // (non-transparent pixels)
          let j = 0;
          for (let i = 0; i < pixelData.length; i += 4) {
            // Check if the pixel is not transparent (belongs to a body)
            if (pixelData[i + 3] > 0) {
              // Extract depth value from R and G channels (same as raw depth)
              const depth = (pixelData[i + 1] << 8) | pixelData[i];
              depthValues[j++] = depth;
            } else {
              // For transparent pixels (not part of a body), set depth to 0
              depthValues[j++] = 0;
            }
          }

          // Update the point cloud with the depth values
          this.visualization.updatePointCloud(depthValues, true); // true = filter out zero values
        };

        img.onerror = (err) => {
          window.log.error('Error loading depth key image:', err);
        };

        img.src = frame.src;
      }
    });
  }

  /**
   * Stop all streams
   */
  stopStream() {
    if (this.kinectron) {
      this.kinectron.stopAll();
    }

    this.ui.updateStreamStatus('Inactive');
    this.ui.updateFrameRate('0 fps');
    this.ui.updateResolution('-');
    this.debug.addDebugInfo('Stream stopped', true);

    // Show p5 canvas and hide Three.js canvas
    this.visualization.showP5Canvas();
    this.visualization.clearP5Canvas();

    this.isStreamActive = false;
    this.currentStreamType = null;
  }

  /**
   * Log depth statistics for debugging
   * @private
   * @param {Uint16Array} depthValues - Raw depth values
   */
  _logDepthStatistics(depthValues) {
    // Calculate min, max, and average depth for console logging
    let validCount = 0;
    let sum = 0;
    let min = Number.MAX_VALUE;
    let max = 0;

    for (let i = 0; i < depthValues.length; i++) {
      const depth = depthValues[i];
      if (depth >= 100 && depth <= 3000) {
        validCount++;
        sum += depth;
        min = Math.min(min, depth);
        max = Math.max(max, depth);
      }
    }

    const avg = validCount > 0 ? sum / validCount : 0;

    window.log.data('Raw Depth Frame Data:');
    window.log.data(
      `Depth values: ${depthValues.length} points, ${validCount} valid points`,
    );
    window.log.data(
      `Depth range: min=${min}, max=${max}, avg=${avg.toFixed(2)}`,
    );
  }
}
