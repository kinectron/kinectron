// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Azure joint methods example using p5.js
=== */
//

let myCanvas = null;

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
  myCanvas = createCanvas(640, 576); // Canvas is the same size as the Kinect depth image
  background(0);
  noStroke();

  // Define and create an instance of kinectron
  let kinectronIpAddress = "127.0.0.1"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to azure
  kinectron.setKinectType("azure");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);
  // kinectron.startBodies(bodiesTracked);
}

function bodyTracked(body) {
  background(0, 20);

  // Get all the joints off the tracked body and do something with them
  kinectron.getJoints(drawJoint);

  // Get the hands off the tracked body and do something with them
  kinectron.getHands(drawHands);
}

// Draw skeleton
function drawJoint(joint) {
  fill(100);

  // Kinect joint location needs to be normalized to canvas size
  ellipse(
    joint.depthX * myCanvas.width,
    joint.depthY * myCanvas.height,
    15,
    15
  );

  fill(200);

  // Kinect joint location needs to be normalized to canvas size
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 3, 3);
}

// Draw hands
function drawHands(hands) {
  //check if hands are touching
  if (
    Math.abs(hands.leftHand.depthX - hands.rightHand.depthX) < 0.1 &&
    Math.abs(hands.leftHand.depthY - hands.rightHand.depthY) < 0.1
  ) {
    hands.leftHandState = "clapping";
    hands.rightHandState = "clapping";
  } else {
    hands.leftHandState = "notclapping";
    hands.rightHandState = "notclapping";
  }

  // draw hand states
  updateHandState(hands.leftHandState, hands.leftHand);
  updateHandState(hands.rightHandState, hands.rightHand);
}

// Find out state of hands
function updateHandState(handState, hand) {
  switch (handState) {
    case "notclapping":
      drawHand(hand, 0, 255);
      break;

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

  // Kinect joint location needs to be normalized to canvas size
  ellipse(
    hand.depthX * myCanvas.width,
    hand.depthY * myCanvas.height,
    diameter,
    diameter
  );
}
