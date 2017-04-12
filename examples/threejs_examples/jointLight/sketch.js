// check for webgl
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// three.js environment
var camera, scene, renderer,
bulbLight, bulbMat, ambientLight, hemiLight,
object, loader, stats;

// materials for globes
var ballMat, ballMat2, ballMat3, ballMat4;

// globes
var ballMesh, ballMesh2, ballMesh3;

// lines for skeleton
var line, line1, line2, line3;

var previousShadowMap = false;

// ref for lumens: http://www.power-sure.com/lumens.htm
var bulbLuminousPowers = {
	"110000 lm (1000W)": 110000,
	"3500 lm (300W)": 3500,
	"1700 lm (100W)": 1700,
	"800 lm (60W)": 800,
	"400 lm (40W)": 400,
	"180 lm (25W)": 180,
	"20 lm (4W)": 20,
	"Off": 0
};

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
var hemiLuminousIrradiances = {
	"0.0001 lx (Moonless Night)": 0.0001,
	"0.002 lx (Night Airglow)": 0.002,
	"0.5 lx (Full Moon)": 0.5,
	"3.4 lx (City Twilight)": 3.4,
	"50 lx (Living Room)": 50,
	"100 lx (Very Overcast)": 100,
	"350 lx (Office Room)": 350,
	"400 lx (Sunrise/Sunset)": 400,
	"1000 lx (Overcast)": 1000,
	"18000 lx (Daylight)": 18000,
	"50000 lx (Direct Sun)": 50000
};

var params = {
	shadows: true,
	exposure: 0.68,
	bulbPower: Object.keys( bulbLuminousPowers )[4],
	hemiIrradiance: Object.keys( hemiLuminousIrradiances )[0]
};

init();
animate();

function init() {

	initEnvironment();
	initSpheres();
	initSkeleton();
	initKinectron();

	window.addEventListener( 'resize', onWindowResize, false );
}

function initEnvironment() {

	var container = document.getElementById( 'container' );

	// add performance stats to page 
	stats = new Stats();
	container.appendChild( stats.dom );
	
	// three.js camera
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
	camera.position.x = -4;
	camera.position.z = 4;
	camera.position.y = 2;

	// create three.js scene
	scene = new THREE.Scene();

	// create light bulb
	var bulbGeometry = new THREE.SphereGeometry( 0.05, 16, 8 );
	bulbLight = new THREE.PointLight( 0xffee88, 1, 100, 2 );

	bulbMat = new THREE.MeshStandardMaterial( {
		emissive: 0xffffee,
		emissiveIntensity: 1,
		color: 0x000000
	});
	
	bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
	bulbLight.position.set( 0, 2, 0 );
	bulbLight.castShadow = true;
	scene.add( bulbLight );

	// add hemispheric light
	hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 0.02 );
	scene.add( hemiLight );	

	// three.js renderer
	renderer = new THREE.WebGLRenderer();
	renderer.physicallyCorrectLights = true;
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.shadowMap.enabled = true;
	renderer.toneMapping = THREE.ReinhardToneMapping;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// add mouse/camera controls
	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();
}

function initSpheres() {
	// create loader for earth textures
	var textureLoader = new THREE.TextureLoader();

	// ball mat 1
	ballMat = new THREE.MeshStandardMaterial( {
		color: 0xffffff,
		roughness: 0.5,
		metalness: 1.0
	});
	textureLoader.load( "../shared/textures/earth_atmos_2048.jpg", function( map ) {
		map.anisotropy = 4;
		ballMat.map = map;
		ballMat.needsUpdate = true;
	} );
	textureLoader.load( "../shared/textures/earth_specular_2048.jpg", function( map ) {
		map.anisotropy = 4;
		ballMat.metalnessMap = map;
		ballMat.needsUpdate = true;
	} );

	// ball mat 2
	ballMat2 = new THREE.MeshStandardMaterial( {
		color: 0xffffff,
		roughness: 0.5,
		metalness: 1.0
	});

	// ball mat 3
	ballMat3 = new THREE.MeshStandardMaterial( {
		color: 0xff00ff,
		roughness: 0.5,
		metalness: 0.5
	});

	// ball mat 4
	ballMat4 = new THREE.MeshStandardMaterial( {
		color: 0xffffff,
		roughness: 0.5,
		metalness: 1.0
	});
	textureLoader.load( "../shared/textures/earth_lights_2048.png", function( map ) {
		map.anisotropy = 4;
		ballMat4.map = map;
		ballMat4.needsUpdate = true;
	} );
	textureLoader.load( "../shared/textures/earth_specular_2048.jpg", function( map ) {
		map.anisotropy = 4;
		ballMat4.metalnessMap = map;
		ballMat4.needsUpdate = true;
	} );

	// create ball 1
	var ballGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
	ballMesh = new THREE.Mesh( ballGeometry, ballMat );
	ballMesh.position.set( 1, 0.5, 1 );
	ballMesh.rotation.y = Math.PI;
	ballMesh.castShadow = true;
	scene.add( ballMesh );

	// create ball 2
	var ballGeometry2 = new THREE.SphereGeometry( 0.2, 32, 32 );
	ballMesh2 = new THREE.Mesh( ballGeometry2, ballMat2 );
	ballMesh2.position.set(0.5, 0.4, 2);
	ballMesh2.rotation.y = Math.PI;
	ballMesh2.castShadow = true;
	scene.add( ballMesh2 );

	// create ball 3
	var ballGeometry3 = new THREE.SphereGeometry( 0.3, 32, 32 );
	ballMesh3 = new THREE.Mesh( ballGeometry3, ballMat3 );
	ballMesh3.position.set( -0.5, 0.2, 3 );
	ballMesh3.rotation.y = Math.PI;
	ballMesh3.castShadow = true;
	scene.add( ballMesh3 );

	// create ball 4
	var ballGeometry4 = new THREE.SphereGeometry( 0.3, 32, 32 );
	ballMesh4 = new THREE.Mesh( ballGeometry4, ballMat4 );
	ballMesh4.position.set(-1, 0.3, 5);  
	ballMesh4.rotation.y = Math.PI;
	ballMesh4.castShadow = true;
	scene.add( ballMesh4 );

}

function initSkeleton() {
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
	scene.add(line);

	// one line for left arm

	var geometryLine1 = new THREE.Geometry();
	geometryLine1.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine1.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line1 = new THREE.Line(geometryLine1, materialLine);
	scene.add(line1);

	// one line for right arm

	var geometryLine2 = new THREE.Geometry();
	geometryLine2.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine2.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line2 = new THREE.Line(geometryLine2, materialLine);
	scene.add(line2);

	// one line for right leg

	var geometryLine3 = new THREE.Geometry();
	geometryLine3.vertices.push(new THREE.Vector3(-1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(0, 1, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	geometryLine3.vertices.push(new THREE.Vector3(1, 0, 0));
	
	line3 = new THREE.Line(geometryLine3, materialLine);
	scene.add(line3);
}

function initKinectron() {
 	// Define and create an instance of kinectron
  var kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron();

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Create connection between remote and application
  kinectron.makeConnection();

  // Start tracked bodies and set callback
  kinectron.startTrackedBodies(drawJoints);  
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

function onWindowResize() {

	// resize camera on window rewize
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}



function render() {

	// to allow for very bright scenes.
	renderer.toneMappingExposure = Math.pow( params.exposure, 5.0 ); 
	
	// update shadows
	renderer.shadowMap.enabled = params.shadows;
	bulbLight.castShadow = params.shadows;
	
	if( params.shadows !== previousShadowMap ) {
		ballMat.needsUpdate = true;
		ballMat2.needsUpdate = true;
		ballMat3.needsUpdate = true;
		ballMat4.needsUpdate = true;
		previousShadowMap = params.shadows;
	}

	// set light power
	bulbLight.power = bulbLuminousPowers[ params.bulbPower ];
	bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface
	hemiLight.intensity = hemiLuminousIrradiances[ params.hemiIrradiance ];

	// rotate globes
	ballMesh.rotation.y += 0.005;
	ballMesh2.rotation.y -= 0.007;
	ballMesh3.rotation.x += 0.004;
	ballMesh4.rotation.x += 0.02;

	// render scene
	renderer.render( scene, camera );

	// keep stats up to date
	stats.update();

}