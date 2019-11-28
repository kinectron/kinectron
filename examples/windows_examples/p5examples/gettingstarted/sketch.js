// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows camera feeds example using p5.js
=== */
//

// Declare kinectron
let kinectron = null;
let frameP;

function setup() {
  createCanvas(500, 500);
  background(0);

  frameP = createP("");

  // Define and create an instance of kinectron
  let kinectronIpAddress = "10.0.1.16"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Connect with application over peer
  kinectron.makeConnection();

  // Set callbacks
  kinectron.setColorCallback(drawFeed);
  kinectron.setDepthCallback(drawFeed);
  kinectron.setInfraredCallback(drawFeed);
}

function draw() {
  let fps = frameRate();
  fill(0);
  stroke(0);
  frameP.html(fps.toFixed(0));
}

// Choose camera to start based on key pressed
function keyPressed() {
  if (keyCode === ENTER) {
    kinectron.startColor();
  } else if (keyCode === UP_ARROW) {
    kinectron.startDepth();
  } else if (keyCode === DOWN_ARROW) {
    kinectron.startInfrared();
  } else if (keyCode === RIGHT_ARROW) {
    kinectron.stopAll();
  }
}

function drawFeed(img) {
  // Draws feed using p5 load and display image functions
  loadImage(img.src, function(loadedImage) {
    background(255);
    image(loadedImage, 0, 0);
  });
}
