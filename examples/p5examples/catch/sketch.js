var myCanvas = null;
var kinect2 = null;

var characterWidth = 250;
var characterHeight = 400;

var backgroundColor = 255;
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
	myCanvas = createCanvas(windowWidth, windowHeight-100);
	background(0);

	// Enter peer credentials provided by Kinectron 
	kinect2 = new p5.Kinect2('l', {host: '192.168.1.5', port: 9001, path: '/'}, myCanvas, 'skeleton', 'height', playCatch);
	kinect2.makeConnection();
}

function draw() {

}

function playCatch(body) {
	background(backgroundColor);

	fill(characterColor);
	ellipseMode(CENTER);

	if (processing === false) {
		processing = true;

		caught = false;

		leftHandState = body.leftHandState;
		rightHandState = body.rightHandState;

		for (var j = 0; j < body.joints.length; j++) {
			// Put into joints array
			joints[j] = {x: (body.joints[j].cameraX)*characterWidth/2+width/2,
			 				y: (body.joints[j].cameraY*-1)*characterHeight/2+height/2+50};
		}

		// Catch the ball!
		if (rightHandState == 3) {
			fill(255,0,0);
			console.log('joint', joints[handJoint]);
			ellipse(joints[handJoint].x, joints[handJoint].y, 50, 50);

			if (dist(joints[handJoint].x, joints[handJoint].y, x, y) < 25) {
				x = joints[handJoint].x;
				y = joints[handJoint].y;
				caught = true;
			}
		}
		fill(characterColor);

		// Loop through joints
		for (var d = 0; d < joints.length; d++) {
			ellipse(joints[d].x, joints[d].y, 25, 25);
		}

		if (!caught) {
			x += xdir;
			y += ydir;
			if (x >= width || x <= 0) xdir *= -1;
			if (y >= height || y <= 0) ydir *= -1;
		}

		ellipse(x, y, 50, 50);
		processing = false;
	}
}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinect2.stopAll();
	} else if (keyCode === UP_ARROW) {
	 	kinect2.startCamera('skeleton');
	}
 }
