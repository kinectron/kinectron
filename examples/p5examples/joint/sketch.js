var myCanvas = null;
var kinectron = null;

function setup() {
	myCanvas = createCanvas(512, 424);
	background(0);
	noStroke();

	kinectron = new Kinectron();
	kinectron.makeConnection();
  kinectron.startTrackedJoint(kinectron.HANDRIGHT, drawRightHand);
}

function draw() {

}

function drawRightHand(hand) {
  background(0);
  fill(255);
  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, 50, 50);
}
