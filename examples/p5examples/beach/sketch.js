// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

var myCanvas = null;
var kinect2 = null;
var beach;
var img;
var myDiv;

function preload() {
	beach = loadImage("images/beach.png");
}

function setup() {
	myCanvas = createCanvas(640, 426);
	background(255);

	kinect2 = new p5.Kinect2();
	kinect2.makeConnection();
	kinect2.startScale(goToBeach);
}

function draw() {
	
}

function goToBeach(data) {
	clear();
	image(beach, 0, 0);
	kinect2.drawFeed();
}
