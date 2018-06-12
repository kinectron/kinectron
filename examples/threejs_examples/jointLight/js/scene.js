// lights taken from https://threejs.org/examples/?q=light#webgl_lights_physical

// three.js environment
let camera, scene, renderer,
bulbLight, bulbMat, ambientLight, hemiLight,
object, loader, stats;

// materials for globes
let ballMat, ballMat2, ballMat3, ballMat4;

// globes
let ballMesh, ballMesh2, ballMesh3;

let previousShadowMap = false;

// ref for lumens: http://www.power-sure.com/lumens.htm
let bulbLuminousPowers = {
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
let hemiLuminousIrradiances = {
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

let params = {
	shadows: true,
	exposure: 0.68,
	bulbPower: Object.keys( bulbLuminousPowers )[4],
	hemiIrradiance: Object.keys( hemiLuminousIrradiances )[0]
};

function initEnvironment() {

	let container = document.getElementById( 'container' );

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
	let bulbGeometry = new THREE.SphereGeometry( 0.05, 16, 8 );
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
	let controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 0, 0 );
	controls.update();
}

function initSpheres() {
	// create loader for earth textures
	let textureLoader = new THREE.TextureLoader();

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
	let ballGeometry = new THREE.SphereGeometry( 0.5, 32, 32 );
	ballMesh = new THREE.Mesh( ballGeometry, ballMat );
	ballMesh.position.set( 1, 0.5, 1 );
	ballMesh.rotation.y = Math.PI;
	ballMesh.castShadow = true;
	scene.add( ballMesh );

	// create ball 2
	let ballGeometry2 = new THREE.SphereGeometry( 0.2, 32, 32 );
	ballMesh2 = new THREE.Mesh( ballGeometry2, ballMat2 );
	ballMesh2.position.set(0.5, 0.4, 2);
	ballMesh2.rotation.y = Math.PI;
	ballMesh2.castShadow = true;
	scene.add( ballMesh2 );

	// create ball 3
	let ballGeometry3 = new THREE.SphereGeometry( 0.3, 32, 32 );
	ballMesh3 = new THREE.Mesh( ballGeometry3, ballMat3 );
	ballMesh3.position.set( -0.5, 0.2, 3 );
	ballMesh3.rotation.y = Math.PI;
	ballMesh3.castShadow = true;
	scene.add( ballMesh3 );

	// create ball 4
	let ballGeometry4 = new THREE.SphereGeometry( 0.3, 32, 32 );
	ballMesh4 = new THREE.Mesh( ballGeometry4, ballMat4 );
	ballMesh4.position.set(-1, 0.3, 5);  
	ballMesh4.rotation.y = Math.PI;
	ballMesh4.castShadow = true;
	scene.add( ballMesh4 );

}

function renderLights() {
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

}

function rotateGlobes() {
	ballMesh.rotation.y += 0.005;
	ballMesh2.rotation.y -= 0.007;
	ballMesh3.rotation.x += 0.004;
	ballMesh4.rotation.x += 0.02;

}