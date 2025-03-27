// check for webgl
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// Called once at beginning of program
function init() {

	initEnvironment();
	initSpheres();
	initSkeleton();
	initKinectron();

	window.addEventListener( 'resize', onWindowResize, false );
}


// Resize camera on window resize
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

// Three.js animate function
function animate() {

	requestAnimationFrame( animate );
	render();
}

// Three.js render function
function render() {

	// render scene
	renderLights();
	rotateGlobes();

	renderer.render( scene, camera );

	// keep stats up to date
	stats.update();
}

// Initialize and run sketch
init();
animate();