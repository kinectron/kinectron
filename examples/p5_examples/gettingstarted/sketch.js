// Copyright (c) 2019-2025 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Getting Started Example (UMD Version)
Kinect Azure camera feeds example using p5.js

This example demonstrates how to:
1. Connect to a Kinectron server
2. Start and stop different camera feeds
3. Process and display the incoming frames
=== */

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
function setup() {
  // Create canvas and place it in the container
  canvasContainer = select('#canvas-container');
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(canvasContainer);
  background(0);

  // Get reference to status and framerate divs
  statusDiv = select('#status');
  framerateDiv = select('#framerate');

  // Initialize Kinectron with local server address
  // Replace with your Kinectron server IP address if not running locally
  const serverIP = '127.0.0.1';
  kinectron = new Kinectron(serverIP);

  // Set up connection event handlers
  setupConnectionEvents();

  // Update status
  statusDiv.html('Connection status: <strong>Connecting...</strong>');
}

// --- DRAW LOOP ---
function draw() {
  // Display the framerate
  let fps = frameRate();
  framerateDiv.html('FPS: ' + fps.toFixed(0));
}

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
      'Connection status: <strong>Error</strong> - ' + error.message,
    );
  });

  // When connection state changes
  kinectron.on('stateChange', (data) => {
    statusDiv.html(
      'Connection status: <strong>' + data.to + '</strong>',
    );
  });
}

// --- KEY CONTROLS ---
function keyPressed() {
  if (keyCode === ENTER) {
    startColorStream();
  } else if (keyCode === UP_ARROW) {
    startDepthStream();
  } else if (keyCode === RIGHT_ARROW) {
    stopAllStreams();
  }
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
  background(0);
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
  loadImage(frame.src, function (loadedImage) {
    // Resize canvas if needed to match the frame dimensions
    if (
      loadedImage.width !== canvasWidth ||
      loadedImage.height !== canvasHeight
    ) {
      canvasWidth = loadedImage.width;
      canvasHeight = loadedImage.height;
      resizeCanvas(canvasWidth, canvasHeight);
    }

    // Display the image
    background(0);
    image(loadedImage, 0, 0);

    // Add an info overlay
    fill(0, 0, 0, 180);
    noStroke();
    rect(10, 10, 250, 60);
    fill(255);
    textSize(16);
    text('Stream: ' + activeStream, 20, 30);
    text(`Resolution: ${canvasWidth}x${canvasHeight}`, 20, 55);
  });
}
