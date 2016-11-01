var myCanvas = null;

// Declare kinectron 
var kinectron = null;

function setup() {
  myCanvas = createCanvas(512, 424);
  background(0);
  noStroke();

  // Define and create an instance of kinectron
  kinectron = new Kinectron("192.168.1.7");

  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();

  // Request right hand and set callback 
  kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);
}

function draw() {

}

function drawRightHand(hand) {
  background(0);
  fill(255);

  // Normalize location based on canvas size
  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, 50, 50);
}