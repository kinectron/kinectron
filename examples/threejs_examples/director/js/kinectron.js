// declare kinectron 
var kinectron;

// lines for skeleton
var line, line1, line2, line3;

// do you want to see the skeleton? 
var skeletonVisible = true;

// attach camera to head? 
var headCam = true;

// how much to scale skeleton by
var scaleDiv = 200;


function initKinectron() {
 	// Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.222.192"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Create connection between remote and application
  kinectron.makeConnection();

  // Start tracked bodies and set callback
  kinectron.startTrackedBodies(drawJoints);  
}


function initSkeleton() {

	// use basic line material for skeleton lines *line width doesn't work on Windows
	var materialLine = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });

	// start lines at random positions

	// one line for spine and left leg 

	var geometryLine = new THREE.Geometry();
	geometryLine.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));

	line = new THREE.Line(geometryLine, materialLine);
	line.visible = skeletonVisible;
	scene.add(line);

	// one line for left arm

	var geometryLine1 = new THREE.Geometry();
	geometryLine1.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line1 = new THREE.Line(geometryLine1, materialLine);
	line1.visible = skeletonVisible;
	scene.add(line1);

	// one line for right arm

	var geometryLine2 = new THREE.Geometry();
	geometryLine2.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line2 = new THREE.Line(geometryLine2, materialLine);
	line2.visible = skeletonVisible;
	scene.add(line2);

	// one line for right leg

	var geometryLine3 = new THREE.Geometry();
	geometryLine3.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line3 = new THREE.Line(geometryLine3, materialLine);
	line3.visible = skeletonVisible;
	scene.add(line3);

}

function drawJoints(data) { 

	// check body for intersections 

	checkHands(data);
	checkHead(data);

	// scale skeleton to scene

	for (var m = 0; m < data.joints.length; m++) {
		data.joints[m].cameraX *= window.innerWidth/scaleDiv;
		data.joints[m].cameraY *= window.innerHeight/scaleDiv;
		data.joints[m].cameraZ *= window.innerWidth/scaleDiv - 50;
	}

	// set main camera at head 
	
	if (headCam) {
		camera.position.set(data.joints[kinectron.HEAD].cameraX, data.joints[kinectron.HEAD].cameraY, data.joints[kinectron.HEAD].cameraZ);	
	}
	
	// update point light positions based on hand position 
	
	pointLight.position.x = data.joints[kinectron.HANDRIGHT].cameraX;
	pointLight.position.y = data.joints[kinectron.HANDRIGHT].cameraY;
	pointLight.position.z = data.joints[kinectron.HANDRIGHT].cameraZ;
	

	// update line skeleton with incoming joint data
	
	// spine and left leg 

	line.geometry.vertices[0].x = data.joints[3].cameraX;
	line.geometry.vertices[0].y = data.joints[3].cameraY;
	line.geometry.vertices[0].z = data.joints[3].cameraZ;

	line.geometry.vertices[1].x = data.joints[2].cameraX;
	line.geometry.vertices[1].y = data.joints[2].cameraY;
	line.geometry.vertices[1].z = data.joints[2].cameraZ;

	line.geometry.vertices[2].x = data.joints[20].cameraX;
	line.geometry.vertices[2].y = data.joints[20].cameraY;
	line.geometry.vertices[2].z = data.joints[20].cameraZ;

	line.geometry.vertices[3].x = data.joints[1].cameraX;
	line.geometry.vertices[3].y = data.joints[1].cameraY;
	line.geometry.vertices[3].z = data.joints[1].cameraZ;

	line.geometry.vertices[4].x = data.joints[0].cameraX;
	line.geometry.vertices[4].y = data.joints[0].cameraY;
	line.geometry.vertices[4].z = data.joints[0].cameraZ;

	line.geometry.vertices[5].x = data.joints[12].cameraX;
	line.geometry.vertices[5].y = data.joints[12].cameraY;
	line.geometry.vertices[5].z = data.joints[12].cameraZ;

	line.geometry.vertices[6].x = data.joints[13].cameraX;
	line.geometry.vertices[6].y = data.joints[13].cameraY;
	line.geometry.vertices[6].z = data.joints[13].cameraZ;

	line.geometry.vertices[5].x = data.joints[14].cameraX;
	line.geometry.vertices[5].y = data.joints[14].cameraY;
	line.geometry.vertices[5].z = data.joints[14].cameraZ;

	line.geometry.vertices[6].x = data.joints[15].cameraX;
	line.geometry.vertices[6].y = data.joints[15].cameraY;
	line.geometry.vertices[6].z = data.joints[15].cameraZ;

	// left arm 

	line1.geometry.vertices[0].x = data.joints[20].cameraX;
	line1.geometry.vertices[0].y = data.joints[20].cameraY;
	line1.geometry.vertices[0].z = data.joints[20].cameraZ;

	line1.geometry.vertices[1].x = data.joints[4].cameraX;
	line1.geometry.vertices[1].y = data.joints[4].cameraY;
	line1.geometry.vertices[1].z = data.joints[4].cameraZ;

	line1.geometry.vertices[2].x = data.joints[5].cameraX;
	line1.geometry.vertices[2].y = data.joints[5].cameraY;
	line1.geometry.vertices[2].z = data.joints[5].cameraZ;

	line1.geometry.vertices[3].x = data.joints[5].cameraX;
	line1.geometry.vertices[3].y = data.joints[5].cameraY;
	line1.geometry.vertices[3].z = data.joints[5].cameraZ;

	line1.geometry.vertices[4].x = data.joints[7].cameraX;
	line1.geometry.vertices[4].y = data.joints[7].cameraY;
	line1.geometry.vertices[4].z = data.joints[7].cameraZ;

	// right arm 

	line2.geometry.vertices[0].x = data.joints[20].cameraX;
	line2.geometry.vertices[0].y = data.joints[20].cameraY;
	line2.geometry.vertices[0].z = data.joints[20].cameraZ;

	line2.geometry.vertices[1].x = data.joints[8].cameraX;
	line2.geometry.vertices[1].y = data.joints[8].cameraY;
	line2.geometry.vertices[1].z = data.joints[8].cameraZ;

	line2.geometry.vertices[2].x = data.joints[9].cameraX;
	line2.geometry.vertices[2].y = data.joints[9].cameraY;
	line2.geometry.vertices[2].z = data.joints[9].cameraZ;

	line2.geometry.vertices[3].x = data.joints[10].cameraX;
	line2.geometry.vertices[3].y = data.joints[10].cameraY;
	line2.geometry.vertices[3].z = data.joints[10].cameraZ;

	line2.geometry.vertices[4].x = data.joints[11].cameraX;
	line2.geometry.vertices[4].y = data.joints[11].cameraY;
	line2.geometry.vertices[4].z = data.joints[11].cameraZ;

	// right leg 

	line3.geometry.vertices[0].x = data.joints[0].cameraX;
	line3.geometry.vertices[0].y = data.joints[0].cameraY;
	line3.geometry.vertices[0].z = data.joints[0].cameraZ;

	line3.geometry.vertices[1].x = data.joints[16].cameraX;
	line3.geometry.vertices[1].y = data.joints[16].cameraY;
	line3.geometry.vertices[1].z = data.joints[16].cameraZ;

	line3.geometry.vertices[2].x = data.joints[17].cameraX;
	line3.geometry.vertices[2].y = data.joints[17].cameraY;
	line3.geometry.vertices[2].z = data.joints[17].cameraZ;

	line3.geometry.vertices[3].x = data.joints[18].cameraX;
	line3.geometry.vertices[3].y = data.joints[18].cameraY;
	line3.geometry.vertices[3].z = data.joints[18].cameraZ;

	line3.geometry.vertices[4].x = data.joints[19].cameraX;
	line3.geometry.vertices[4].y = data.joints[19].cameraY;
	line3.geometry.vertices[4].z = data.joints[19].cameraZ;

	// update all skeleton lines 

	line.geometry.verticesNeedUpdate = true;
	line1.geometry.verticesNeedUpdate = true;
	line2.geometry.verticesNeedUpdate = true;
	line3.geometry.verticesNeedUpdate = true;

}

function checkHands(data) {

	// check distance between right hand and kneww

	var dist = {};
	dist.x = Math.abs(data.joints[kinectron.HANDRIGHT].cameraX - data.joints[kinectron.KNEERIGHT].cameraX);
	dist.y = Math.abs(data.joints[kinectron.HANDRIGHT].cameraY - data.joints[kinectron.KNEERIGHT].cameraY);
	dist.z = Math.abs(data.joints[kinectron.HANDRIGHT].cameraZ - data.joints[kinectron.KNEERIGHT].cameraZ);
 
	// if they are touching turn on point light 

	if ( dist.x < 0.05 && dist.y < 0.05 && dist.z < 0.05) {
			pointLight.visible = true;
			hemiLight.visible = false;
	}

	// check distance between left hand and knee 

	var dist2 = {};
	dist2.x = Math.abs(data.joints[kinectron.HANDLEFT].cameraX - data.joints[kinectron.KNEELEFT].cameraX);
	dist2.y = Math.abs(data.joints[kinectron.HANDLEFT].cameraY - data.joints[kinectron.KNEELEFT].cameraY);
	dist2.z = Math.abs(data.joints[kinectron.HANDLEFT].cameraZ - data.joints[kinectron.KNEELEFT].cameraZ);
 
	// if touching, turn on hemisphere light

	if ( dist2.x < 0.05 && dist2.y < 0.05 && dist2.z < 0.05) {
		pointLight.visible = false;
		hemiLight.visible = true;
	}
}

function checkHead(data) {

	// check if the right hand is on the head

	var dist = {};
	dist.x = Math.abs(data.joints[kinectron.HANDRIGHT].cameraX - data.joints[kinectron.HEAD].cameraX);
	dist.y = Math.abs(data.joints[kinectron.HANDRIGHT].cameraY - data.joints[kinectron.HEAD].cameraY);
	dist.z = Math.abs(data.joints[kinectron.HANDRIGHT].cameraZ - data.joints[kinectron.HEAD].cameraZ);
	
	// check if the hands are touching 

	var dist2 = {};
	dist2.x = Math.abs(data.joints[kinectron.HANDLEFT].cameraX - data.joints[kinectron.HANDRIGHT].cameraX);
	dist2.y = Math.abs(data.joints[kinectron.HANDLEFT].cameraY - data.joints[kinectron.HANDRIGHT].cameraY);
	dist2.z = Math.abs(data.joints[kinectron.HANDLEFT].cameraZ - data.joints[kinectron.HANDRIGHT].cameraZ);
	
	// calibrate the distance between joints if needed
	
	var d = 0.3; 

	// if touching, animate the spline camera 

	if ( ( dist2.x < d && dist2.y < d && dist2.z < d) && ( dist.x < d && dist.y < d && dist.z < d) ) {
		animation = true;
	} else {
		animation = false;
	}
}