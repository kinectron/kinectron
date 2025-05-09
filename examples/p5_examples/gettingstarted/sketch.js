// Copyright (c) 2019-2025 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Getting Started Example
Kinect Azure camera feeds example using p5.js

This example demonstrates how to:
1. Connect to a Kinectron server
2. Start and stop different camera feeds
3. Process and display the incoming frames
=== */

// Declare variables
let kinectron = null;
let statusDiv;
let framerateDiv;
let canvasContainer;
let activeStream = null;

// Default canvas dimensions - will be updated when we receive frames
let canvasWidth = 640;
let canvasHeight = 480;
let canvasInitialized = false;

function setup() {
  // Create canvas and place it in the container
  canvasContainer = select('#canvas-container');
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(canvasContainer);
  background(0);

  // Get reference to status and framerate divs
  statusDiv = select('#status');
  framerateDiv = select('#framerate');

  // Initialize Kinectron
  // Replace with your Kinectron server IP address if not running locally
  const kinectronServerIPAddress = '127.0.0.1';

  // Create a new Kinectron instance
  // This automatically initiates the connection to the server
  kinectron = new Kinectron(kinectronServerIPAddress);

  // Set up event handlers for connection events

  // When connection is ready
  kinectron.on('ready', () => {
    console.log('Connected to Kinectron server!');
    statusDiv.html('Connection status: <strong>Connected</strong>');

    // Set kinect type to azure after connection is established
    kinectron.setKinectType('azure');

    // Initialize the Kinect hardware
    initializeKinect();
  });

  // When connection has an error
  kinectron.on('error', (error) => {
    console.error('Connection error:', error);
    statusDiv.html(
      'Connection status: <strong>Error</strong> - ' + error.message,
    );
  });

  // When connection state changes
  kinectron.on('stateChange', (data) => {
    console.log(
      'Connection state changed from',
      data.from,
      'to',
      data.to,
    );
    statusDiv.html(
      'Connection status: <strong>' + data.to + '</strong>',
    );
  });

  // Log connection attempt
  console.log('Connecting to Kinectron server...');
  statusDiv.html('Connection status: <strong>Connecting...</strong>');
}

function draw() {
  // Display the framerate
  let fps = frameRate();
  framerateDiv.html('FPS: ' + fps.toFixed(0));
}

// Choose camera to start based on key pressed
function keyPressed() {
  if (keyCode === ENTER) {
    startColorStream();
  } else if (keyCode === UP_ARROW) {
    startDepthStream();
  } else if (keyCode === RIGHT_ARROW) {
    stopAllStreams();
  }
}

// Start the color stream
function startColorStream() {
  // Update status
  console.log('Starting color stream...');
  statusDiv.html(
    'Connection status: <strong>Connected</strong> - Color stream active',
  );
  activeStream = 'color';

  // Start the color stream with a callback function
  kinectron.startColor(drawFeed);
}

// Start the depth stream
function startDepthStream() {
  // Update status
  console.log('Starting depth stream...');
  statusDiv.html(
    'Connection status: <strong>Connected</strong> - Depth stream active',
  );
  activeStream = 'depth';

  // Start the depth stream with a callback function
  kinectron.startDepth(drawFeed);
}

// Stop all streams
function stopAllStreams() {
  // Update status
  console.log('Stopping all streams...');
  statusDiv.html(
    'Connection status: <strong>Connected</strong> - No active streams',
  );
  activeStream = null;

  // Stop all active streams
  kinectron.stopAll();

  // Clear the canvas
  background(0);
}

// Initialize the Kinect hardware on the server
function initializeKinect() {
  // Update status
  console.log('Initializing Kinect...');
  statusDiv.html(
    'Connection status: <strong>Connected</strong> - Initializing Kinect...',
  );

  // Call the initKinect method
  kinectron
    .initKinect()
    .then((result) => {
      console.log('Kinect initialized:', result);
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
      console.error('Failed to initialize Kinect:', error);
      statusDiv.html(
        'Connection status: <strong>Error</strong> - ' +
          error.message,
      );
    });
}

// Callback function for processing incoming frames
function drawFeed(frame) {
  // The frame object contains the image data URL in the src property
  loadImage(frame.src, function (loadedImage) {
    // Resize canvas if needed to match the frame dimensions
    if (
      loadedImage.width !== canvasWidth ||
      loadedImage.height !== canvasHeight
    ) {
      console.log(
        `Resizing canvas to ${loadedImage.width}x${loadedImage.height}`,
      );
      canvasWidth = loadedImage.width;
      canvasHeight = loadedImage.height;
      resizeCanvas(canvasWidth, canvasHeight);
      canvasInitialized = true;
    }

    // Clear the background
    background(0);

    // Display the image
    image(loadedImage, 0, 0);

    // Add a label to show which stream is active and its dimensions
    fill(0, 0, 0, 180);
    noStroke();
    rect(10, 10, 250, 60);
    fill(255);
    textSize(16);
    text('Stream: ' + activeStream, 20, 30);
    text(`Resolution: ${canvasWidth}x${canvasHeight}`, 20, 55);
  });
}
