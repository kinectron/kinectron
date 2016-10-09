var myCanvas = null;
var kinectron = null;

function setup() {
	myCanvas = createCanvas(500,500);
	background(0);

	kinectron = new Kinectron();
	kinectron.makeConnection();
	
	kinectron.setRGBCallback(drawFeed);
	kinectron.setDepthCallback(drawFeed);
	kinectron.setInfraredCallback(drawFeed);
}

function draw() {

}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinectron.startRGB();
	} else if (keyCode === UP_ARROW) {
	 	kinectron.startDepth();
	} else if (keyCode === DOWN_ARROW) {
		kinectron.startInfrared();
	} else if (keyCode === RIGHT_ARROW) {
		kinectron.stopAll();
	}
 }

function drawFeed(img) {
	loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0);
  });
}




