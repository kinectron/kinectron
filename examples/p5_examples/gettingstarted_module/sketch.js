// Copyright (c) 2019-2025 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Getting Started Example (Module Version)
Kinect Azure camera feeds example using p5.js with ES modules

This example demonstrates how to:
1. Import Kinectron using ES modules
2. Use p5.js in instance mode (required for ES modules)
3. Connect to a Kinectron server
4. Start and stop different camera feeds
5. Process and display the incoming frames
=== */

// Import Kinectron from the npm package
import Kinectron from 'kinectron-client';

// Create a p5 instance - this is required when using ES modules with p5.js
const sketch = (p) => {
  // --- VARIABLES ---
  let kinectron = null; // Kinectron instance
  let statusDiv; // Status display element
  let framerateDiv; // Framerate display element
  let canvasContainer; // Container for the p5 canvas
  let activeStream = null; // Current active stream type

  // Canvas dimensions - will be updated when we receive frames
  let canvasWidth = 640;
  let canvasHeight = 480;

  // --- SETUP ---
  p.setup = function () {
    // Create canvas and place it in the container
    canvasContainer = p.select('#canvas-container');
    let canvas = p.createCanvas(canvasWidth, canvasHeight);
    canvas.parent(canvasContainer);
    p.background(0);

    // Get reference to status and framerate divs
    statusDiv = p.select('#status');
    framerateDiv = p.select('#framerate');

    // Initialize Kinectron with local server address
    // Replace with your Kinectron server IP address if not running locally
    const serverIP = '127.0.0.1';
    kinectron = new Kinectron(serverIP);

    // Set up connection event handlers
    setupConnectionEvents();

    // Connect to the server
    kinectron.peer.connect();
    statusDiv.html(
      'Connection status: <strong>Connecting...</strong>',
    );
  };

  // --- DRAW LOOP ---
  p.draw = function () {
    // Display the framerate
    let fps = p.frameRate();
    framerateDiv.html('FPS: ' + fps.toFixed(0));
  };

  // --- KEY CONTROLS ---
  p.keyPressed = function () {
    if (p.keyCode === p.ENTER) {
      startColorStream();
    } else if (p.keyCode === p.UP_ARROW) {
      startDepthStream();
    } else if (p.keyCode === p.RIGHT_ARROW) {
      stopAllStreams();
    }
  };

  // --- CONNECTION SETUP ---
  function setupConnectionEvents() {
    // When connection is ready
    kinectron.on('ready', () => {
      statusDiv.html('Connection status: <strong>Connected</strong>');

      // Set kinect type to azure after connection is established
      kinectron.setKinectType('azure');

      // Initialize the Kinect hardware
      initializeKinect();
    });

    // When connection has an error
    kinectron.on('error', (error) => {
      statusDiv.html(
        'Connection status: <strong>Error</strong> - ' +
          error.message,
      );
    });

    // When connection state changes
    kinectron.on('stateChange', (data) => {
      statusDiv.html(
        'Connection status: <strong>' + data.to + '</strong>',
      );
    });
  }

  // --- STREAM CONTROLS ---

  // Start the color stream
  function startColorStream() {
    statusDiv.html(
      'Connection status: <strong>Connected</strong> - Color stream active',
    );
    activeStream = 'color';
    kinectron.startColor(drawFeed);
  }

  // Start the depth stream
  function startDepthStream() {
    statusDiv.html(
      'Connection status: <strong>Connected</strong> - Depth stream active',
    );
    activeStream = 'depth';
    kinectron.startDepth(drawFeed);
  }

  // Stop all streams
  function stopAllStreams() {
    statusDiv.html(
      'Connection status: <strong>Connected</strong> - No active streams',
    );
    activeStream = null;
    kinectron.stopAll();
    p.background(0);
  }

  // --- KINECT INITIALIZATION ---
  function initializeKinect() {
    statusDiv.html(
      'Connection status: <strong>Connected</strong> - Initializing Kinect...',
    );

    kinectron
      .initKinect()
      .then((result) => {
        if (result.success || result.alreadyInitialized) {
          statusDiv.html(
            'Connection status: <strong>Connected</strong> - Kinect initialized',
          );
        } else {
          statusDiv.html(
            'Connection status: <strong>Error</strong> - Failed to initialize Kinect',
          );
        }
      })
      .catch((error) => {
        statusDiv.html(
          'Connection status: <strong>Error</strong> - ' +
            error.message,
        );
      });
  }

  // --- FRAME PROCESSING ---
  function drawFeed(frame) {
    // Load the image from the data URL in the frame
    p.loadImage(frame.src, function (loadedImage) {
      // Resize canvas if needed to match the frame dimensions
      if (
        loadedImage.width !== canvasWidth ||
        loadedImage.height !== canvasHeight
      ) {
        canvasWidth = loadedImage.width;
        canvasHeight = loadedImage.height;
        p.resizeCanvas(canvasWidth, canvasHeight);
      }

      // Display the image
      p.background(0);
      p.image(loadedImage, 0, 0);

      // Add an info overlay
      p.fill(0, 0, 0, 180);
      p.noStroke();
      p.rect(10, 10, 250, 60);
      p.fill(255);
      p.textSize(16);
      p.text('Stream: ' + activeStream, 20, 30);
      p.text(`Resolution: ${canvasWidth}x${canvasHeight}`, 20, 55);
    });
  }
};

// Start the sketch with the p5 instance
new p5(sketch);
