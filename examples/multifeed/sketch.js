var myCanvas = null;
var context = null;
var kinect2 = null;

function setup() {
	myCanvas = createCanvas(1000,1000);
	context = myCanvas.drawingContext;

	//console.log(myCanvas.drawingContext);
	background(255);

	// Enter peer credentials provided by Kinectron 
	kinect2 = new p5.Kinect2();
	kinect2.makeConnection();

	kinect2.setRGBCallback(rgbCallback);
	kinect2.setBodyCallback(bodyCallback);
	kinect2.setDepthCallback(depthCallback);
	kinect2.setRawDepthCallback(rawDepthCallback);
}

function draw() {

}

function keyPressed() {
	if (keyCode === ENTER) {
	 	kinect2.startMultiFrame(["color", "body"]);
	 	//kinect2.startMultiFrame(["rawDepth"]);
	} 
 }

function rgbCallback(img) {
	background(255, 100);
	image(img, 0, 0);
}

function depthCallback(img) {
	image(img, 300, 300);
}

function rawDepthCallback(data) {
	//console.log('raw', data);
}

function bodyCallback(body) {

	//find tracked bodies
	for (var i = 0; i < body.length; i++) {
		if (body[i].tracked === true) {
			bodyTracked(body[i]);
		}
	}
}

function bodyTracked(body) {

	//draw joints in tracked bodies 
  context.fillStyle = '#000000';
  context.fillRect(0, 300, 700, 700);

  // kinect2.getJoints(drawJoint); 
  // kinect2.getHands(drawHands);

  for(var jointType in body.joints) {
	  var joint = body.joints[jointType];
	  context.fillStyle = '#ff0000';
	  context.fillRect(joint.depthX * canvas.width, joint.depthY * canvas.height, 10, 10);
	  
	}
}


