// check for browser webgl 
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// three js variables 
var scene, renderer, stats;
var torusKnot;

// lights, camera, !
var pointLight, hemiLight;
var camera, splineCamera, cameraHelper, cameraEye;

// set scene and begin animation
init();
animate();

function init() {

	// create three.js camara and scene

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 0, 10, -200 );

	scene = new THREE.Scene();
	scene.add( new THREE.AmbientLight( 0x222233 ) );

	// create spline and spline camera 

	createSplineCamera();

	// Lights

	// create a point light -- function allows you to create multiple

	pointLight = createLight( 0x0000ff, 2, 100 );
	scene.add( pointLight );

	// create hemisphere light 

	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	hemiLight.visible = false;
	scene.add( hemiLight );

	// create torus knot geometry 

	var geometry = new THREE.TorusKnotGeometry( 14, 1, 150, 20 );
	var material = new THREE.MeshPhongMaterial( {
		color: 0xff0000,
		shininess: 100,
		specular: 0x222222
	} );

	torusKnot = new THREE.Mesh( geometry, material );
	torusKnot.position.set( 0, 5, 0 );
	torusKnot.castShadow = true;
	torusKnot.receiveShadow = true;
	scene.add( torusKnot );

	// three.js renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	// enable shadowmapping 

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild( renderer.domElement );

	// add mouse controls 

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.target.set( 0, 10, 0 );
	controls.update();

	// add stats to monitor performance 

	stats = new Stats();
	document.body.appendChild( stats.dom );

	// initialize kinectron and skeleton 

	initKinectron(); 
	initSkeleton();

	// listen for window resize 

	window.addEventListener( 'resize', onWindowResize, false );

}

function createLight( color, size, dist ) {

	// create point light that casts a shadow
	
	var pointLight = new THREE.PointLight( color, 1, dist );
	pointLight.castShadow = true;
	pointLight.shadow.camera.near = 1;
	pointLight.shadow.camera.far = 30;
	pointLight.shadow.bias = 0.01;

	var geometry = new THREE.SphereGeometry( size, 12, 6 );
	var material = new THREE.MeshBasicMaterial( { color: color } );
	var sphere = new THREE.Mesh( geometry, material );
	pointLight.add( sphere );

	return pointLight;

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	// follow spline with camera
	renderSplineCamera();

	// choose which camera to show on render
	renderer.render( scene, animation === true ? splineCamera : camera );

	// update performance stats
	stats.update();

}



