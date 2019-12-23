// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows skeleton example using p5.js
=== */
//

// Declare Kinectron
let kinectron = null;

let characterWidth = 250;
let characterHeight = 400;

let backgroundColor = 255;
let ballColor = 150;
let characterColor = 0;

let leftHandState = 0;
let rightHandState = 0;

// **********************************
let handJoint = 23;
let x = 100;
let y = 100;
let xdir = 2;
let ydir = 1;
let caught = false;
// **********************************

let processing = false;

// Initialized joints array
let joints = [];
for (let a = 0; a < 23; a++) {
  joints[a] = {};
  joints[a].x = 0;
  joints[a].y = 0;
}

function setup() {
  createCanvas(windowWidth, windowHeight - 100);
  background(0);

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Connect remote to application
  kinectron.makeConnection();

  // Start the tracked bodies feed over API
  kinectron.startTrackedBodies(playCatch);
}

function draw() {}

// Start and stop game
function keyPressed() {
  if (keyCode === ENTER) {
    kinectron.stopAll();
  } else if (keyCode === UP_ARROW) {
    kinectron.startTrackedBodies();
  }
}

function playCatch(body) {
  background(backgroundColor);

  fill(characterColor);
  ellipseMode(CENTER);

  if (processing === false) {
    processing = true;

    caught = false;

    // Get hand states from the tracked body object
    leftHandState = body.leftHandState;
    rightHandState = body.rightHandState;

    for (let j = 0; j < body.joints.length; j++) {
      // Put joints into array
      joints[j] = {
        x: (body.joints[j].cameraX * characterWidth) / 2 + width / 2,
        y: (body.joints[j].cameraY * -1 * characterHeight) / 2 + height / 2 + 50
      };
    }

    // Catch the ball!
    if (dist(joints[handJoint].x, joints[handJoint].y, x, y) < 50) {
      caught = true;
      ballColor = color(random(255), random(255), random(255));
    }

    // Loop through and draw joints
    fill(characterColor);
    for (let d = 0; d < joints.length; d++) {
      ellipse(joints[d].x, joints[d].y, 25, 25);
    }

    // Keep ball moving
    if (!caught) {
      x += xdir * 2;
      y += ydir * 2;
      if (x >= width || x <= 0) xdir *= -1;
      if (y >= height || y <= 0) ydir *= -1;
    }

    // Draw ball
    fill(ballColor);
    ellipse(x, y, 50, 50);
    processing = false;
  }
}
