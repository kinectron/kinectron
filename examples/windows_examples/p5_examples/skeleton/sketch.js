// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows skeleton example using p5.js
=== */
//

// Declare kinectron
let kinectron = null;

// drawHand variables
let start = 30;
let target = 100;
let diameter = start;
let light = 255;
let dark = 100;
let hueValue = light;
let lerpAmt = 0.3;
let state = "ascending";

function setup() {
  createCanvas(500, 500);
  background(0);
  noStroke();

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);
}

function draw() {}

function bodyTracked(body) {
  background(0, 20);

  // Get all the joints off the tracked body and do something with them
  kinectron.getJoints(drawJoint);

  // Get the hands off the tracked body and do somethign with them
  kinectron.getHands(drawHands);
}

// Draw skeleton
function drawJoint(joint) {
  fill(100);

  // Kinect location data needs to be normalized to canvas size
  ellipse(joint.depthX * width, joint.depthY * height, 15, 15);

  fill(200);

  // Kinect location data needs to be normalized to canvas size
  ellipse(joint.depthX * width, joint.depthY * height, 3, 3);
}

// Draw hands
function drawHands(hands) {
  //check if hands are touching
  if (
    Math.abs(hands.leftHand.depthX - hands.rightHand.depthX) < 0.01 &&
    Math.abs(hands.leftHand.depthY - hands.rightHand.depthY) < 0.01
  ) {
    hands.leftHandState = "clapping";
    hands.rightHandState = "clapping";
  }

  // draw hand states
  updateHandState(hands.leftHandState, hands.leftHand);
  updateHandState(hands.rightHandState, hands.rightHand);
}

// Find out state of hands
function updateHandState(handState, hand) {
  switch (handState) {
    case "closed":
      drawHand(hand, 1, 255);
      break;

    case "open":
      drawHand(hand, 0, 255);
      break;

    case "lasso":
      drawHand(hand, 0, 255);
      break;

    // Created new state for clapping
    case "clapping":
      drawHand(hand, 1, "red");
  }
}

// Draw the hands based on their state
function drawHand(hand, handState, color) {
  if (handState === 1) {
    state = "ascending";
  }

  if (handState === 0) {
    state = "descending";
  }

  if (state == "ascending") {
    diameter = lerp(diameter, target, lerpAmt);
    hueValue = lerp(hueValue, dark, lerpAmt);
  }

  if (state == "descending") {
    diameter = lerp(diameter, start, lerpAmt);
    hueValue = lerp(hueValue, light, lerpAmt);
  }

  fill(color);

  // Kinect location needs to be normalized to canvas size
  ellipse(hand.depthX * width, hand.depthY * height, diameter, diameter);
}
