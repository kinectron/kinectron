// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows camera feeds example using p5.js
=== */
//

// declare variable for kinectron
let kinectron = null;

// ip address is a string containing four numbers
// each number is between 0 and 255 and separated with periods
// since it is a string, it goes between double quotes
// we put as example here "1.2.3.4"
// replace it with the kinectron server ip address
// remember to keep the double quotes
let kinectronServerIPAddress = "1.2.3.4";

// declare new HTML elements for displaying text
let textKinectronServerIP;
let textCurrentFeed;
let textFramerate;

// variable for storing current 
let currentFeed = "none";

// setup() is a p5.js function
// setup() runs once, at the beginning
function setup() {

  // create canvas 500px wide x 500px high
  createCanvas(500, 500);

  // white background
  background(255);

  // create new HTML <p> elements for displaying text
  textKinectronServerIP = createP("");
  textCurrentFeed = createP("");
  textFramerate = createP("");

  // create an instance of kinectron
  kinectron = new Kinectron(kinectronServerIPAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Connect with application over peer
  kinectron.makeConnection();

  // define callbacks for color, depth and infrared
  kinectron.setColorCallback(drawFeed);
  kinectron.setDepthCallback(drawFeed);
  kinectron.setInfraredCallback(drawFeed);
}

// draw() is a p5.js function
// after setup() runs once, draw() runs on a loop
function draw() {

  // p5.js drawing settings
  // black fill() and stroke()
  fill(0);
  stroke(0);

  // update text of HTML <p> elements with current parameters
  textKinectronServerIP.html("Kinectron server IP address: " + kinectronServerIPAddress);
  textCurrentFeed.html("Current feed: " + currentFeed);
  textFramerate.html("frame rate: " + frameRate().toFixed(0));
}

// keyPressed() is a p5.js function
// choose camera to start based on key pressed
function keyPressed() {
  // if user presses ENTER, change feed to color
  if (keyCode === ENTER) {
    kinectron.startColor();
    currentFeed = "color";
    // if user presses UP_ARROW, change feed to depth
  } else if (keyCode === UP_ARROW) {
    kinectron.startDepth();
    currentFeed = "depth";
    // if user presses DOWN_ARROW, change feed to infrared
  } else if (keyCode === DOWN_ARROW) {
    kinectron.startInfrared();
    currentFeed = "infrared";
    // if user presses RIGHT_ARROW, change feed to none
  } else if (keyCode === RIGHT_ARROW) {
    kinectron.stopAll();
    currentFeed = "none";
  }
}

// callback function when feed sends a new frame
function drawFeed(newFrame) {
  // loadImage() is a p5.js function
  // load new frame from feed and then place it on p5.js canvas
  loadImage(newFrame.src, function(loadedFrame) {
    // white background
    background(255);
    // place the frame from kinectron at (0,0)
    image(loadedFrame, 0, 0);
  });
}
