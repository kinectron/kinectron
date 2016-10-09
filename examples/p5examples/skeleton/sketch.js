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
	myCanvas = createCanvas(500, 500);
	background(0);
	noStroke();

	kinectron = new Kinectron();
	kinectron.makeConnection();
	kinectron.startTrackedBodies(bodyTracked);
}

function draw() {

}

function bodyTracked(body) {
  background(0, 20);

  kinectron.getJoints(drawJoint); 
  kinectron.getHands(drawHands);
}

// Draw skeleton
function drawJoint(joint) {
  fill(100);
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 15, 15);
  
  fill(200);
  ellipse(joint.depthX * myCanvas.width, joint.depthY * myCanvas.height, 3, 3);
}

// Draw hands
function drawHands(hands) {
	
	//check if hands are touching 
  if ( (Math.abs(hands.leftHand.depthX - hands.rightHand.depthX) < 0.01) && (Math.abs(hands.leftHand.depthY - hands.rightHand.depthY) < 0.01)) {
  	hands.leftHandState = 'clapping';
  	hands.rightHandState = 'clapping';
  }

  // draw hand states
  updateHandState(hands.leftHandState, hands.leftHand);
  updateHandState(hands.rightHandState, hands.rightHand);
}

function updateHandState(handState, hand) {
  switch (handState) {
    case 'closed':
      drawHand(hand, 1, 255);
    break;

    case 'open':
      drawHand(hand, 0, 255);
    break;

    case 'lasso':
      drawHand(hand, 0, 255);
    break;

    // Created new state for clapping
    case 'clapping':
    	drawHand(hand, 1, 'red');
	}
}

function drawHand(hand, handState, color) {
 
  if (handState === 1) {
    state = 'ascending';
  }
  
  if (handState === 0 ) {
    state = 'descending';
  }
  
  if (state == 'ascending') {
    diameter = lerp(diameter, target, lerpAmt);
    hueValue = lerp(hueValue, dark, lerpAmt);
  }
  
  if (state == 'descending') {
    diameter = lerp(diameter, start, lerpAmt);
    hueValue = lerp(hueValue, light, lerpAmt);
  }
  
  fill(color);
  ellipse(hand.depthX * myCanvas.width, hand.depthY * myCanvas.height, diameter, diameter);  
}