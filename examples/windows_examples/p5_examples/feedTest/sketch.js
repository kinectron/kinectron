// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows feed test using p5.js
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
let kinectronServerIPAddress = '192.168.68.111';

// declare new HTML elements for displaying text
let textKinectronServerIP;
let textCurrentFeed;
let textFramerate;

let busy = false;

// variable for storing current
let currentFeed = 'none';

// setup() is a p5.js function
// setup() runs once, at the beginning
function setup() {
  // create canvas the size of kinect2 depth image
  createCanvas(512, 424);
  pixelDensity(1);
  // white background
  background(255);

  // create new HTML <p> elements for displaying text
  textKinectronServerIP = createP('');
  textCurrentFeed = createP('');
  textFramerate = createP('');

  // create an instance of kinectron
  kinectron = new Kinectron(kinectronServerIPAddress);

  // Set kinect type to windows
  kinectron.setKinectType('windows');

  // Connect with application over peer
  kinectron.makeConnection();

  // define callbacks for color, depth and infrared

  kinectron.setColorCallback(drawImage);
  kinectron.setDepthCallback(drawImage);
  kinectron.setRawDepthCallback(drawRawDepth);
  kinectron.setTrackedBodiesCallback(drawBody);
  kinectron.setBodiesCallback(getBodies);
  kinectron.setInfraredCallback(drawImage);
  kinectron.setLeInfraredCallback(drawImage);
  kinectron.setKeyCallback(drawImage);
  kinectron.setRGBDCallback(drawImage);
}

// draw() is a p5.js function
// after setup() runs once, draw() runs on a loop
function draw() {
  // p5.js drawing settings
  // black fill() and stroke()
  fill(0);
  stroke(0);

  // update text of HTML <p> elements with current parameters
  textKinectronServerIP.html(
    'Kinectron server IP address: ' + kinectronServerIPAddress,
  );
  textCurrentFeed.html('Current feed: ' + currentFeed);
  textFramerate.html('frame rate: ' + frameRate().toFixed(0));
}

// keyPressed() is a p5.js function
// choose camera to start based on key pressed
function keyPressed() {
  console.log('key, ', key);

  switch (key) {
    case '1':
      kinectron.startColor();
      currentFeed = 'color';
      break;

    case '2':
      kinectron.startDepth();
      currentFeed = 'depth';
      break;

    case '3':
      kinectron.startRawDepth();
      currentFeed = 'raw depth';
      break;

    case '4':
      kinectron.startTrackedBodies();
      currentFeed = 'tracked bodies';
      break;

    case '5':
      kinectron.startBodies();
      currentFeed = 'bodies';
      break;

    case '6':
      kinectron.startInfrared();
      currentFeed = 'infrared';
      break;

    case '7':
      kinectron.startLEInfrared();
      currentFeed = 'le infrared';
      break;

    case '8':
      kinectron.startKey();
      currentFeed = 'key';
      break;

    case '9':
      kinectron.startRGBD();
      currentFeed = 'rgbd';
      break;

    case '0':
      kinectron.stopAll();
      currentFeed = 'none';
      break;
  }
}

// callback function when feed sends a new frame
function drawImage(newFrame) {
  // loadImage() is a p5.js function
  // load new frame from feed and then place it on p5.js canvas
  loadImage(newFrame.src, function (loadedFrame) {
    // white background
    background(255);
    // place the frame from kinectron at (0,0)
    image(loadedFrame, 0, 0);
  });
}

function drawRawDepth(depthBuffer) {
  if (busy === true) return;

  busy = true;

  loadPixels();
  let j = 0;
  for (let i = 0; i < pixels.length; i++) {
    let imgColor = map(depthBuffer[i], 0, 8191, 0, 255);
    // let imgColor = 100;
    pixels[j + 0] = imgColor;
    pixels[j + 1] = imgColor;
    pixels[j + 2] = imgColor;
    pixels[j + 3] = 255;
    j += 4;
  }
  updatePixels();

  busy = false;
}

function getBodies(allBodies) {
  background(0, 20);

  for (let i = 0; i < allBodies.bodies.length; i++) {
    let body = allBodies.bodies[i];

    if (body.tracked === true) {
      for (let j = 0; j < body.joints.length; j++) {
        let joint = body.joints[j];
        drawJoint(joint);
      }
    }
  }
}

function drawBody(body) {
  background(0, 20);

  // Get all the joints off the tracked body and do something with them
  kinectron.getJoints(drawJoint);

  // Get the hands off the tracked body and do somethign with them
  // kinectron.getHands(drawHands);
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
