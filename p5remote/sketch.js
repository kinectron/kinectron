var myCanvas = null;
var kinect2 = null;

function setup() {
	myCanvas = createCanvas(500,500);
	background(0);

	kinect2 = new p5.Kinect2('l', {host: '192.168.1.5', port: 9001, path: '/'}, myCanvas, 'rgb');
	kinect2.makeConnection();
}

function draw() {

}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinect2.startCamera('skeleton');
	} else if (keyCode === UP_ARROW) {
	 	kinect2.startCamera('rgb');
	} else if (keyCode === DOWN_ARROW) { 
		kinect2.startCamera('key');
	} else if (keyCode === LEFT_ARROW) {
		kinect2.startCamera('key', myCallback);
	} else if (keyCode === RIGHT_ARROW) {
		kinect2.stopAll();
	}
 }

 function myCallback(data) {
 	console.log('data', data);
 }
 