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

    // Constants
    this.AZURE_COLOR_WIDTH = 1280;
    this.AZURE_COLOR_HEIGHT = 720;
    this.AZURE_DEPTH_WIDTH = 640;
    this.AZURE_DEPTH_HEIGHT = 576;
    this.DISPLAY_SCALE = 0.5;

    // Bind methods to maintain 'this' context
    this.initKinect = this.initKinect.bind(this);
    this.startColorStream = this.startColorStream.bind(this);
    this.startDepthStream = this.startDepthStream.bind(this);
    this.startRawDepthStream = this.startRawDepthStream.bind(this);
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
      stopStream: this.stopStream,
      forceEnableButtons: () => this.ui.forceEnableButtons(),
      clearDebugInfo: () => this.debug.clearDebugInfo(),
      toggleDebug: (enabled) => this.debug.toggleDebug(enabled),
      togglePerformanceDebug: (enabled) =>
        this.debug.togglePerformanceDebug(enabled),
      toggleDataDebug: (enabled) =>
        this.debug.toggleDataDebug(enabled),
      togglePeerDebug: (enabled) =>
        this.debug.togglePeerDebug(enabled),
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

      if (window.DEBUG.RAW_DEPTH) {
        console.log('Kinect initialization result:', result);
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
      if (window.DEBUG.RAW_DEPTH) {
        console.log('Raw data event received:', data);
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

        if (window.DEBUG.RAW_DEPTH && window.DEBUG.DATA) {
          this._logDepthStatistics(frame.depthValues);
        }
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

    console.group('Raw Depth Frame Data');
    console.log(
      `Depth values: ${depthValues.length} points, ${validCount} valid points`,
    );
    console.log(
      `Depth range: min=${min}, max=${max}, avg=${avg.toFixed(2)}`,
    );
    console.groupEnd();
  }
}
