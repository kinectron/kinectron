// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds


var myCanvas = null;
var kinect2 = null;
var beach;
var img;
var myDiv;

function preload() {
	beach = loadImage("images/beach.png");
	console.log('hello');
}

function setup() {
	myCanvas = createCanvas(640, 426);
	background(255);

	// Create hidden image to draw to
	img = createImg(" ");
	myDiv = createDiv();
  img.parent(myDiv);
  myDiv.style("visibility: hidden");

	// Enter peer credentials provided by Kinectron 
	kinect2 = new p5.Kinect2('l', {host: '192.168.1.5', port: 9001, path: '/'}, myCanvas, 'scale', 'height', goToBeach);
	kinect2.makeConnection();
}

function draw() {

}

function goToBeach(data) {
	//console.log('data', data);
	img.elt.src = data.imagedata;
	clear();
	image(beach, 0, 0);
	image(img, 0, 0);
}
