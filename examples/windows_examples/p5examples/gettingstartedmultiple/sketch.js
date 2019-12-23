// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows connecting multiple Kinects examples using p5.js
=== */
//

// Declare canvas
let myCanvas = null;

// Declare kinectron
let kinectron1 = null;
let kinectron2 = null;

// Declare element for framerate
let frameP;

function setup() {
  // Create p5 canvas
  myCanvas = createCanvas(600, 600);
  background(0);

  // Create paragraph element for framerate
  frameP = createP("");

  // Define and create first instance of kinectron
  let kinectronIpAddress1 = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron1 = new Kinectron(kinectronIpAddress1);

  // Define and create second instance of kinectron
  let kinectronIpAddress2 = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron2 = new Kinectron(kinectronIpAddress2);

  // Set kinect type to windows
  kinectron1.setKinectType("windows");
  kinectron2.setKinectType("windows");

  // Connect with application over peer
  kinectron1.makeConnection();
  kinectron2.makeConnection();

  // Set callbacks for Kinect 1
  kinectron1.setRGBCallback(drawFeed1);
  kinectron2.setRGBCallback(drawFeed2);
  kinectron1.setDepthCallback(drawFeed1);

  // Set callbacks for Kinect 2
  kinectron2.setDepthCallback(drawFeed2);
  kinectron1.setInfraredCallback(drawFeed1);
  kinectron2.setInfraredCallback(drawFeed2);
}

function draw() {
  // Display framerate
  let fps = frameRate();
  fill(0);
  stroke(0);
  text("FPS: " + fps.toFixed(0), 10, height);
  frameP.html(fps.toFixed(0));
}

// Choose camera to start based on key pressed
function keyTyped() {
  // Controls for Kinect 1
  if (key === "1") kinectron1.startRGB();
  if (key === "2") kinectron1.startDepth();
  if (key === "3") kinectron1.startInfrared();
  if (key === "4") kinectron1.stopAll();

  // Controls for Kinect 2
  if (key === "5") kinectron2.startRGB();
  if (key === "6") kinectron2.startDepth();
  if (key === "7") kinectron2.startInfrared();
  if (key === "8") kinectron2.stopAll();
}

// Callback for Kinect 1 Feed
function drawFeed1(img) {
  // Draws feed using p5 load and display image functions
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0, 300, 169);
  });
}

// Callback for Kinect 2 Feed
function drawFeed2(img) {
  // Draws feed using p5 load and display image functions
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 300, 0, 300, 169);
  });
}
