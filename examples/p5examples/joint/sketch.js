var myCanvas = null;
var kinectron = null;

// drawHand variables
var start = 30;
var target = 100;
var diameter = start;
var light = 255;
var dark = 100;
var hueValue = light;
var lerpAmt = 0.3;
var state = 'ascending';

function setup() {
	myCanvas = createCanvas(512, 424);
	background(0);
	noStroke();

	kinectron = new Kinectron();
	kinectron.makeConnection();
  kinectron.startTrackedJoint('handRight', drawRightHand);
}

function draw() {

}

function drawRightHand(hand) {
  background(0);
  fill(255);
  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, 50, 50);
}
