// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Windows multiple frames example using p5.js
=== */

// Not working with Kinectron release 0.3.0

let myCanvas = null;
let context = null;
let kinectron = null;
let frames = [];

function setup() {
  myCanvas = createCanvas(1000, 1000);
  context = myCanvas.drawingContext;

  //console.log(myCanvas.drawingContext);
  background(255);

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to windows
  kinectron.setKinectType("windows");

  // Connect with application over peer
  kinectron.makeConnection();

  // Set individual frame callbacks
  kinectron.setRGBCallback(rgbCallback);
  kinectron.setDepthCallback(depthCallback);
  kinectron.setBodiesCallback(bodyCallback);

  // Set frames wanted from Kinectron
  frames = ["color", "depth", "body"];
}

function keyPressed() {
  if (keyCode === ENTER) {
    // Start multiframe with a dedicated multiframe callback
    kinectron.startMultiFrame(frames, multiFrameCallback);
  }

  if (keyCode === UP_ARROW) {
    // Start multiframe using individual frame callbacks
    kinectron.startMultiFrame(frames);
  }
}

function rgbCallback(img) {
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 273.2, 660, 370);
  });
}

function depthCallback(img) {
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 330, 0, 330, 273.2);
  });
}

function bodyCallback(body) {
  //find tracked bodies
  for (let i = 0; i < body.length; i++) {
    if (body[i].tracked === true) {
      bodyTracked(body[i]);
    }
  }
}

function bodyTracked(body) {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, 330, 273.2);

  //draw joints in tracked bodies
  for (let jointType in body.joints) {
    let joint = body.joints[jointType];
    context.fillStyle = "#ff0000";
    context.fillRect(joint.depthX * 330, joint.depthY * 273.2, 10, 10);
  }
}

function multiFrameCallback(data) {
  console.log(data);
  debugger;
}
