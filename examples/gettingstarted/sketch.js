var myCanvas = null;
var kinectron = null;

function setup() {
	myCanvas = createCanvas(500,500);
	background(0);

	kinectron = new Kinectron();
	kinectron.makeConnection();
	
	kinectron.startRGB(colorCallback);
	kinectron.setDepthCallback(depthCallback);
}

function draw() {

}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinectron.startDepth();
	} else if (keyCode === UP_ARROW) {
	 	kinectron.startRGB(colorCallback);
	} else if (keyCode === DOWN_ARROW) {
		kinectron.startRGB(myCallback);
	}
 }


function colorCallback(img) {
	loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0);
  });
}

function depthCallback(img) {
	console.log('depth is deep');
}



