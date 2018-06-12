// create four lines for skeleton
let line, line1, line2, line3;

function initKinectron() {
 	// Define and create an instance of kinectron
  const kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Create connection between remote and application
  kinectron.makeConnection();

  // Start tracked bodies and set callback
  kinectron.startTrackedBodies(drawJoints);  
}

function initSkeleton() {
	const materialLine = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 3 });

	// start lines at random positions

	// one line for spine and left leg 

	let geometryLine = new THREE.Geometry();
	geometryLine.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine.vertices.push(new THREE.Vector3(1, 0, 0));

	line = new THREE.Line(geometryLine, materialLine);
	scene.add(line);

	// one line for left arm

	let geometryLine1 = new THREE.Geometry();
	geometryLine1.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line1 = new THREE.Line(geometryLine1, materialLine);
	scene.add(line1);

	// one line for right arm

	let geometryLine2 = new THREE.Geometry();
	geometryLine2.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line2 = new THREE.Line(geometryLine2, materialLine);
	scene.add(line2);

	// one line for right leg

	let geometryLine3 = new THREE.Geometry();
	geometryLine3.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line3 = new THREE.Line(geometryLine3, materialLine);
	scene.add(line3);
}


function drawJoints(data) { 

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

	// update position of light on right hand

	bulbLight.position.x = data.joints[kinectron.HANDRIGHT].cameraX;
	bulbLight.position.y = data.joints[kinectron.HANDRIGHT].cameraY;
	bulbLight.position.z = data.joints[kinectron.HANDRIGHT].cameraZ;
}

