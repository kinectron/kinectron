// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows key example using p5.js
=== */
//

// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

let beach;
let img;
let myDiv;

let processing = false;

// Declare Kinectron
let kinectron = null;

function preload() {
  beach = loadImage("images/beach.png");
}

function setup() {
  createCanvas(640, 426);
  background(255);

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Create connection between remote and application
  kinectron.makeConnection();

  // Start the greenscreen camera
  kinectron.startKey(goToBeach);
}

function draw() {}

function goToBeach(img) {
  loadImage(img.src, function(loadedImage) {
    image(beach, 0, 0);
    image(loadedImage, 0, 0);
  });
}
