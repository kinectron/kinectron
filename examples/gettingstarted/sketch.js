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
}



// Helper functions //

// Width and height variables available for skeleton and floor height joint helper functions
// var incomingW = null;
// var incomingH = null;

// // Skeleton variables for helper functions
// var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
// var HANDSIZE = 40;
// var HANDCLOSEDCOLOR = 'red';
// var HANDOPENCOLOR = 'green';
// var HANDLASSOCOLOR = 'blue';
// var index = 0;



// Draw skeleton 
// function bodyTracked(body) {
//   // clear canvas each time
//   clear();
//   // draw body joints
//   for(var jointType in body.joints) {
//     var joint = body.joints[jointType];
//     stroke(colors[index]);
//     fill(colors[index]);
//     rect(joint.depthX * incomingW, joint.depthY * incomingH, 10, 10);
//     //var skeletonJointData = {color: colors[index], depthX: joint.depthX, depthY: joint.depthY};
//   }
//   // draw hand states
//   // 7 is left hand in Kinect2
//   updateHandState(body.leftHandState, body.joints[7]);
//   // 11 is right hand in Kinect2
//   updateHandState(body.rightHandState, body.joints[11]);
// }

// function updateHandState(handState, jointPoint) {
//   switch (handState) {
//     // 3 is Kinect2 closed handstate
//     case 3:
//       drawHand(jointPoint, HANDCLOSEDCOLOR);
//     break;

//     // 2 is Kinect2 open handstate
//     case 2:
//       drawHand(jointPoint, HANDOPENCOLOR);
//     break;

//     // 4 is Kinect2 open handstate
//     case 4:
//       drawHand(jointPoint, HANDLASSOCOLOR);
//     break;
//   }
// }

// function drawHand(jointPoint, handColor) {
//   // draw hand cicles
//   //var handData = {depthX: jointPoint.depthX, depthY: jointPoint.depthY, handColor: handColor, handSize: HANDSIZE};
//   stroke(handColor);
//   fill(handColor);
//   ellipse(jointPoint.depthX * incomingW, jointPoint.depthY * incomingH, HANDSIZE, HANDSIZE);
// }

// // Show height in floor-height feed
// function showHeight(data) {
//   // clear canvas
//   clear();
//   // draw height
//   fill("red");
//   ellipse(data.joint.colorX * incomingW, data.joint.colorY * incomingH, 20, 20);
//   textSize(48);
//   textFont("sans");
//   text(data.distance.toFixed(2) + "m", 20 + data.joint.colorX * incomingW, data.joint.colorY * incomingH);
// }