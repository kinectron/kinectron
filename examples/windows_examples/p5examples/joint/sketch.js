// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows multiplayer joint example using p5.js
=== */
//

// Declare Kinectron
let kinectron = null;

// Create objects to store and access hands
let handColors = {};
let hands = {};

let ballWidth = 50;

function setup() {
  createCanvas(512, 424);
  background(0);
  noStroke();

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request right hand and set callback for received hand
  kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);
}

function draw() {}

function drawRightHand(hand) {
  // Use handColors object to store unique colors for each hand

  // If we already have a color for incoming hand
  if (hand.trackingId in handColors) {
    // Create color property and give the hand its assigned color
    hand.color = handColors[hand.trackingId];
  } else {
    // If we don't have a color for the hand yet
    // Create a random RGB color
    let randomColor = [random(255), random(255), random(255)];
    // Create color property on the hand and assign it a random color
    hand.color = randomColor;
    // Add it to an array for easy look up
    handColors[hand.trackingId] = hand.color;
  }

  // Use hands object to store hands for drawing

  // Update or create the hand in the hands object
  hands[hand.trackingId] = hand;

  // Clear background
  background(0);

  // Draw an ellipse at each hand's location in its designated color
  for (let key in hands) {
    let trackedHand = hands[key];
    fill(trackedHand.color[0], trackedHand.color[1], trackedHand.color[2]);

    // draw label with tracking id to player's hand location
    text(
      `
        Right hand of player
        with tracking Id:
        ` + trackedHand.trackingId,
      trackedHand.depthX * width - ballWidth * 3,
      trackedHand.depthY * height
    );

    // draw ellipse at player's hand location
    ellipse(
      trackedHand.depthX * width,
      trackedHand.depthY * height,
      ballWidth,
      ballWidth
    );
  }
}
