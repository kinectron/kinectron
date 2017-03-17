var myCanvas = null;

// Declare kinectron 
var kinectron = null;

var frameP;

function setup() {
  myCanvas = createCanvas(500, 500);
  background(0);

  frameP = createP('');

  // Define and create an instance of kinectron
  var kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron();

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();

  // Set callbacks
  kinectron.setColorCallback(drawFeed);
  kinectron.setDepthCallback(drawFeed);
  kinectron.setInfraredCallback(drawFeed);
  kinectron.setKeyCallback(drawFeed);
  kinectron.setBodiesCallback(callback);
  kinectron.setTrackedBodiesCallback(callback);
  kinectron.setRawDepthCallback(callback);
}

function draw() {
  var fps = frameRate();
  fill(0);
  stroke(0);
  text("FPS: " + fps.toFixed(0), 10, height);
  frameP.html(fps.toFixed(0));
}

// Choose camera to start based on key pressed
function keyPressed() {
  if (keyCode === ENTER) {
    kinectron.stopAll();
  } else if (keyCode === UP_ARROW) {
    kinectron.startRecord();
  } else if (keyCode === DOWN_ARROW) {
    kinectron.stopRecord();
  } else if (key === '1') {
    kinectron.startColor();
  } else if (key === '2') {
    kinectron.startDepth();
  } else if (key === '3') {
    kinectron.startKey();
  } else if (key === '4') {
    kinectron.startBodies();
  } else if (key === '5') {
    kinectron.startTrackedBodies();
  } else if (key === '6') {
    kinectron.startTrackedJoint(kinectron.HANDRIGHT, callback); 
  } else if (key === '7') {
    kinectron.startInfrared();
  } else if (key === '8') {
    kinectron.startMultiFrame(["color", "body"]);
  } else if (key === '9') {
    kinectron.startRawDepth();
  }
}

function drawFeed(img) {
  // Draws feed using p5 load and display image functions  
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0);
  });
}

function callback(data) {
  //console.log(data);
}