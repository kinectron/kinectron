// Copyright (c) 2020 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// example name:
// azure record
// description:
// example to show how to record azure data on client in browser
//

let kinectron = null;

function setup() {
  // create p5 canvas to draw on
  createCanvas(1000, 1000);
  // set p5 canvas to white
  background(255);

  // ip address is a string containing four numbers
  // each number is between 0 and 255 and separated with periods
  // since it is a string, it goes between double quotes
  // we put as example here "127.0.0.1"
  // replace it with the kinectron server ip address
  // remember to keep the double quotes
  const kinectronServerIPAddress = "127.0.0.1";
  kinectron = new Kinectron(kinectronServerIPAddress);

  // connect with application over peer
  kinectron.makeConnection();

  // set Kinect type to "windows" or "azure"
  kinectron.setKinectType("azure");

  // set individual frame callbacks
  kinectron.setColorCallback(drawFeed);
  kinectron.setDepthCallback(drawFeed);
  kinectron.setBodiesCallback(bodyCallback);
}

// keyPressed() is a p5.js function
// use keys to control kinect and recording
function keyPressed() {
  // if user presses enter, stop all feeds
  if (keyCode === ENTER) {
    kinectron.stopAll();
    // if user presses up arrow, start recording
  } else if (keyCode === UP_ARROW) {
    kinectron.startRecord();
    // if user presses down arrow, stop recording
  } else if (keyCode === DOWN_ARROW) {
    kinectron.stopRecord();
    // if user presses 1, start color feed
  } else if (key === "1") {
    kinectron.startColor();
    // if user presses 2, start depth feed
  } else if (key === "2") {
    kinectron.startDepth();
    // if user presses 3, start all bodies feed
  } else if (key === "3") {
    kinectron.startBodies();
  }
}

function drawFeed(img) {
  // Draws kinect video feed using p5 load and display image functions
  loadImage(img.src, function(loadedImage) {
    // clear background
    background(255);

    // draw image
    image(loadedImage, 0, 0);
  });
}

function bodyCallback(data) {
  // get each body from body array and draw it
  for (let i = 0; i < data.bodies.length; i++) {
    drawBody(data.bodies[i]);
  }
}

function drawBody(body) {
  let joints = body.skeleton.joints;

  // clear background
  background(255);

  //draw all joints in tracked body
  for (let i = 0; i < joints.length; i++) {
    let joint = joints[i];
    noStroke();
    fill(255, 0, 0);
    rect(joint.depthX * width, joint.depthY * height, 10, 10);
  }
}
