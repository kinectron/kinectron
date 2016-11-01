var myCanvas = null;

// Declare Kinectron
var kinectron = null;

var characterWidth = 250;
var characterHeight = 400;

var backgroundColor = 255;
var ballColor = 150;
var characterColor = 0;

var leftHandState = 0;
var rightHandState = 0;

// **********************************
var handJoint = 23;
var x = 100;
var y = 100;
var xdir = 2;
var ydir = 1;
var caught = false;
// **********************************

var processing = false;

// Initialized joints array 
var joints = [];
for (var a = 0; a < 23; a++) {
  joints[a] = {};
  joints[a].x = 0;
  joints[a].y = 0;
}

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight - 100);
  background(0);

  // Define and create an instance of kinectron
  kinectron = new Kinectron("192.168.1.7");

  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect remote to application
  kinectron.makeConnection();

  // Start the tracked bodies feed over API
  kinectron.startTrackedBodies(playCatch);
}

function draw() {

}

// Start and stop game 
function keyPressed() {
  if (keyCode === ENTER) {
    kinectron.stopAll();
  } else if (keyCode === UP_ARROW) {
    kinectron.startTrackedBodies();
  }
}


function playCatch(body) {
  background(backgroundColor);

  fill(characterColor);
  ellipseMode(CENTER);

  if (processing === false) {
    processing = true;

    caught = false;

    // Get hand states from the tracked body object
    leftHandState = body.leftHandState;
    rightHandState = body.rightHandState;

    for (var j = 0; j < body.joints.length; j++) {
      // Put joints into array
      joints[j] = {
        x: (body.joints[j].cameraX) * characterWidth / 2 + width / 2,
        y: (body.joints[j].cameraY * -1) * characterHeight / 2 + height / 2 + 50
      };
    }

    // Catch the ball!
    if (dist(joints[handJoint].x, joints[handJoint].y, x, y) < 50) {
      caught = true;
      ballColor = color(random(255), random(255), random(255));
    }

    // Loop through and draw joints
    fill(characterColor);
    for (var d = 0; d < joints.length; d++) {
      ellipse(joints[d].x, joints[d].y, 25, 25);
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
    processing = false;
  }
}