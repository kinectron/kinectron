// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

var myCanvas = null;
var kinectron = null;
var beach;
var img;
var myDiv;

var processing = false;

function preload() {
	beach = loadImage("images/beach.png");
}

function setup() {
	myCanvas = createCanvas(640, 426);
	background(255);

	kinectron = new Kinectron();
	kinectron.makeConnection();
	kinectron.startKey(goToBeach);
}

function draw() {
	
}

function goToBeach(img) {
	loadImage(img.src, function(loadedImage) {
		image(beach, 0, 0);
    image(loadedImage, 0, 0);
  });
}
