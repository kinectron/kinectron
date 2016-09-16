var myCanvas = null;
var kinect2 = null;

function setup() {
	myCanvas = createCanvas(500,500);
	background(0);

	// Enter peer credentials provided by Kinectron 
	kinect2 = new p5.Kinect2();
	kinect2.makeConnection();
	kinect2.startRGB(myCallback);

}

function draw() {

}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinect2.startScale(myCallback);
	} else if (keyCode === UP_ARROW) {
	 	kinect2.startDepth(myCallback);
	} else if (keyCode === DOWN_ARROW) {
		kinect2.startRGB(myCallback);
	}
 }


function myCallback(img) {
	console.log(img);
	image(img, 0, 0);
	//kinect2.drawFeed();
}



