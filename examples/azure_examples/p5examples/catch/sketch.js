// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Azure skeleton and joint methods example using p5.js
=== */
//

// Declare Kinectron
let kinectron = null;

let backgroundColor = 200;
let ballColor = 150;
let characterColor = 0;

let handJoint = 15; // Kinect azure right hand
let x = 100;
let y = 100;
let xdir = 1;
let ydir = 0.5;

let caught = false;
let gotFirstJoint = false;

// Initialize joints array
let joints = [];
for (let i = 0; i < 32; i++) {
  joints[i] = {};
  joints[i].x = 0;
  joints[i].y = 0;
}

function setup() {
  createCanvas(640, 576); // Same resolution as Kinect Azure Depth image
  ellipseMode(CENTER);

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to azure
  kinectron.setKinectType("azure");

  // Connect remote to application
  kinectron.makeConnection();

  // Start the tracked bodies feed over API
  kinectron.startTrackedBodies(getJoints);
}

function draw() {
  background(backgroundColor);

  if (!gotFirstJoint) {
    return;
  }

  caught = false;

  // Catch the ball!
  if (dist(joints[handJoint].x, joints[handJoint].y, x, y) < 50) {
    caught = true;
    ballColor = color(random(255), random(255), random(255));
  }

  // Draw the skeleton joints
  fill(characterColor);
  for (let d = 0; d < joints.length; d++) {
    ellipse(joints[d].x, joints[d].y, 15, 15);
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
}

// Start and stop game
function keyPressed() {
  if (keyCode === ENTER) {
    kinectron.stopAll();
  } else if (keyCode === UP_ARROW) {
    kinectron.startTrackedBodies();
  }
}

function getJoints(body) {
  if (!gotFirstJoint) {
    gotFirstJoint = true;
  }

  for (let i = 0; i < body.skeleton.joints.length; i++) {
    // Put joints into array
    joints[i] = {
      x: (body.skeleton.joints[i].depthX * width) / 2,
      y: (body.skeleton.joints[i].depthY * height) / 2 + height / 2
    };
  }
}
