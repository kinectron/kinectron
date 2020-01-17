// Copyright (c) 2020 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// example name:
// skeletonimages
// description:
// example where a skeleton follows your body
// this example runs by default with pre-recorded data,
// and it can be switched to use live data from a kinectron server
//
//

// set to true if using live kinectron data
const liveData = false;
let debugKinectJoints = false;
let debugRotations = false;

// ip address is a string containing four numbers
// each number is between 0 and 255 and separated with periods
// since it is a string, it goes between double quotes
// we put as example here "127.0.0.1"
// replace it with the kinectron server ip address
// remember to keep the double quotes
const kinectronServerIPAddress = "127.0.0.1";

const skelWidth = 0.25;
const skelHeight = 0.28;

// variables for images
let headImg;
let torsoImg;
let hipImg;
let boneImg;
let boneSmall;
let legLeftImg;
let legRightImg;

// recorded data variables
const recorded_data_file = "../shared/azure_recorded_skeleton.json";
// initialize time variables
let sentTime = Date.now();
let currentFrame = 0;
let recorded_skeleton;

function preload() {
  if (!liveData) {
    recorded_skeleton = loadJSON(recorded_data_file);
  }

  // images should be double desired display size to account for retina screens
  headImg = loadImage("images/skull.png");
  torsoImg = loadImage("images/torso.png");
  hipImg = loadImage("images/hips.png");
  boneImg = loadImage("images/bone.png");
  boneSmallImg = loadImage("images/boneSmall.png");
  legLeftImg = loadImage("images/leftLeg.png");
  legRightImg = loadImage("images/rightLeg.png");
}

function setup() {
  // create canvas to draw on
  createCanvas(800, 800);
  // black background
  background(0);

  // print on console info about live data and pre-recorded data
  if (liveData == false) {
    console.log(`this example is currently using pre-recorded data
if you want to use live data, switch the value of variable liveData
from false to true, setup the ip address, save the changes,
and refresh the browser.`);
  } else {
    console.log(`this example is currently using live data
if you want to use pre-recorded data, switch the value of variable liveData
from true to false, save the changes, and refresh the browser.`);
  }

  const jointsCheckbox = createCheckbox("Show Kinect Joints", false);
  jointsCheckbox.changed(jointsChecked);

  const rotationsCheckbox = createCheckbox("Show Joint Rotations", false);
  rotationsCheckbox.changed(rotationsChecked);

  if (liveData) {
    initKinectron();
  }
}

function jointsChecked() {
  if (this.checked()) {
    debugKinectJoints = true;
  } else {
    debugKinectJoints = false;
  }
}

function rotationsChecked() {
  if (this.checked()) {
    debugRotations = true;
  } else {
    debugRotations = false;
  }
}

function draw() {
  if (!liveData) {
    loopRecordedData();
  }
}

function loopRecordedData() {
  // send recorded data every 20 seconds
  if (Date.now() > sentTime + 20) {
    bodyTracked(recorded_skeleton[currentFrame]);
    sentTime = Date.now();

    if (currentFrame < Object.keys(recorded_skeleton).length - 1) {
      currentFrame++;
    } else {
      currentFrame = 0;
    }
  }
}

function initKinectron() {
  // define and create an instance of kinectron
  const kinectron = new Kinectron(kinectronServerIPAddress);

  // connect with application over peer
  kinectron.makeConnection();

  // Set Kinect type to "windows" or "azure"
  kinectron.setKinectType("azure");

  // request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);
}

function bodyTracked(body) {
  background(0);

  // get joints
  // see https://docs.microsoft.com/en-us/azure/kinect-dk/body-joints
  let head = calculateJointPosition(body.skeleton.joints[26]);
  let spineShoulder = calculateJointPosition(body.skeleton.joints[3]);
  let hip = calculateJointPosition(body.skeleton.joints[0]);
  let hipLeft = calculateJointPosition(body.skeleton.joints[18]);
  let hipRight = calculateJointPosition(body.skeleton.joints[22]);
  let shoulderLeft = calculateJointPosition(body.skeleton.joints[5]);
  let shoulderRight = calculateJointPosition(body.skeleton.joints[12]);
  let elbowLeft = calculateJointPosition(body.skeleton.joints[6]);
  let elbowRight = calculateJointPosition(body.skeleton.joints[13]);
  let handLeft = calculateJointPosition(body.skeleton.joints[8]);
  let handRight = calculateJointPosition(body.skeleton.joints[15]);
  let ankleLeft = calculateJointPosition(body.skeleton.joints[20]);
  let ankleRight = calculateJointPosition(body.skeleton.joints[24]);

  // torso
  rotateBone(torsoImg, spineShoulder, hip, 0, 5);

  // head
  placeBone(headImg, head, 0, -30);

  // hips
  placeBone(hipImg, hip, 0, -35);

  // upper arms
  rotateBone(boneSmallImg, shoulderLeft, elbowLeft, 0, 0);
  rotateBone(boneSmallImg, shoulderRight, elbowRight, 0, 0);

  // lower arms
  rotateBone(boneImg, elbowLeft, handLeft, 0, 0);
  rotateBone(boneImg, elbowRight, handRight, 0, 0);

  // legs
  rotateBone(legLeftImg, hipLeft, ankleLeft, -20, 0);
  rotateBone(legRightImg, hipRight, ankleRight, 20, 0);

  if (debugKinectJoints) {
    showKinectJoints(body);
  }
}

function calculateJointPosition(joint) {
  let tempJoint = {};

  // cameraX and cameraY need to be scaled to the desired skeleton size with skelWidth and skelHeight
  // cameraX needs to be mirrored otherwise left and right appear opposite on screen
  // to mirror x, subtract x value from width over screen
  // in this case width/2 is far right edge of screen because drawing is translated to 0,0 later
  // then x needs to be brought back to center with -width/2
  tempJoint.cameraX = width / 2 - joint.cameraX * skelWidth - width / 2;
  tempJoint.cameraY = joint.cameraY * skelHeight;

  return tempJoint;
}

// for bones that don't use rotation
// ie. rotation for skull and hips may not be needed/desired
function placeBone(boneImg, joint, xOff, yOff) {
  // see https://p5js.org/reference/#/p5/push
  push();

  // move to center
  translate(width / 2, height / 2);

  // move to joint position
  // add x offset or y offset if needed for desired positioning
  translate(joint.cameraX + xOff, joint.cameraY + yOff);

  // draw bone image at joint position at half image size
  image(
    boneImg,
    -0.5 * (boneImg.width / 2),
    0,
    boneImg.width / 2,
    boneImg.height / 2
  );

  // see https://p5js.org/reference/#/p5/push
  pop();
}

// for bones that use rotation
function rotateBone(boneImg, joint1, joint2, xOff, yOff) {
  // use trigonometry to find the angle for the bone between two joints
  // https://www.mathsisfun.com/algebra/trig-finding-angle-right-triangle.html

  // all angles calculated in radians

  // create three points
  let v1 = createVector(joint1.cameraX, joint1.cameraY);
  let v2 = createVector(joint2.cameraX, joint2.cameraY);
  let v3 = createVector(v1.x, v2.y);

  // see https://p5js.org/reference/#/p5/push
  push();

  // move to sketch center plus desired offset if needed
  translate(width / 2 + xOff, height / 2 + yOff);

  // on debug show triangle between joints
  if (debugRotations) {
    fill(200);
    noStroke();
    triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
  }

  // Find the angle sin(θ) = Opposite / Hypotenuse
  let hypo = v1.dist(v2);
  let oppo = v1.dist(v3);
  let angle = asin(oppo / hypo);

  // adjust angle for each quadrant of the circle
  let adjAngle;

  // top left
  if (
    // add width/2, height/2 to each point to compare only positive values
    v2.y + height / 2 < v1.y + height / 2 &&
    v2.x + width / 2 < v1.x + width / 2
  ) {
    adjAngle = angle - (3 * PI) / 2;
  }

  // top right
  if (
    v2.y + height / 2 < v1.y + height / 2 &&
    v2.x + width / 2 > v1.x + width / 2
  ) {
    adjAngle = (3 * PI) / 2 - angle;
  }

  // bottom right
  if (
    v2.y + height / 2 > v1.y + height / 2 &&
    v2.x + width / 2 > v1.x + width / 2
  ) {
    adjAngle = angle - PI / 2;
  }

  // bottom left
  if (
    v2.y + height / 2 > v1.y + height / 2 &&
    v2.x + width / 2 < v1.x + width / 2
  ) {
    adjAngle = -1 * (angle - PI / 2);
  }

  // move to joint
  translate(v1.x, v1.y);

  // if debug draw line at θ = 0
  if (debugRotations) {
    stroke(255, 0, 0);
    strokeWeight(5);
    line(0, 0, 100, 0);
  }

  // rotate by adjusted angle, draw image
  rotate(adjAngle);
  image(
    boneImg,
    -0.5 * (boneImg.width / 2),
    0,
    boneImg.width / 2,
    boneImg.height / 2
  );

  // see https://p5js.org/reference/#/p5/push
  pop();
}

function showKinectJoints(body) {
  // get all the joints and draw them
  for (let jointType in body.skeleton.joints) {
    joint = calculateJointPosition(body.skeleton.joints[jointType]);
    drawKinectJoint(joint);
  }
}

// draw skeleton
function drawKinectJoint(joint) {
  noStroke();
  fill(100);

  push();
  translate(width / 2, height / 2);
  ellipse(joint.cameraX, joint.cameraY, 15, 15);
  pop();
}
