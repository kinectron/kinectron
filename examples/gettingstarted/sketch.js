var myCanvas = null;
var kinect2 = null;

function setup() {
	myCanvas = createCanvas(500,500);
	background(0);

	// Enter peer credentials provided by Kinectron 
	kinect2 = new p5.Kinect2();
	kinect2.makeConnection();
}

function draw() {

}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinect2.stopAll();
	} else if (keyCode === UP_ARROW) {
	 	kinect2.startCamera('skeleton');
	} else if (keyCode === DOWN_ARROW) {
		kinect2.startCamera('rgb');
	}
 }
