if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

// three js scene elements
var container;
var scene, camera, light, renderer;
var controls, stats;

// geometry for point cloud
var geometry, mesh, material, texture;

// altering kinectron texture
var dClipping1, flrClipping1, xLeftClip1, xRightClip1;  

window.addEventListener('load', init);

function init() {

	// create three.js scene
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	stats = new Stats();
	container.appendChild( stats.dom );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 30, 13, 2000 );

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 1);
	container.appendChild( renderer.domElement );

	controls = new THREE.TrackballControls( camera, renderer.domElement );

	createKinectImg();

	// Set initial texture values from gui
	updateMaterial();

	initKinectron();

	initGui();

	window.addEventListener( 'resize', onWindowResize, false );

	animate();

}

function createKinectImg() {

	// set clipping and dimensions
	var width = 768, height = 424;
	var nearClipping = 850, farClipping = 4000;

	// texture for kinect image 
	texture = new THREE.Texture(img1);
	texture.minFilter = THREE.NearestFilter;

	// geo for kinect poing cloud
	geometry = new THREE.BufferGeometry();

	// create verts for kinect
	var vertices = new Float32Array( width * height * 3 );

	for ( var i = 0, j = 0, l = vertices.length; i < l; i += 3, j ++ ) {

		vertices[ i ] = j % width;
		vertices[ i + 1 ] = Math.floor( j / width );

	}

	// vertices to geometry
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	// create shader material
	material = new THREE.ShaderMaterial( {

		uniforms: {

			"map1":         { value: texture },
			"width":        { value: width },
			"height":       { value: height },
			"nearClipping": { value: nearClipping },
			"farClipping":  { value: farClipping },
			"dClipping1": 	{ value: dClipping1 },
			"flrClipping1": { value: flrClipping1 },
			"pointSize":    { value: 2 },
			"zOffset":      { value: 1000 },
      "xLeftClip1":   { value: xLeftClip1 }, 
      "xRightClip1":  { value: xRightClip1 }
		},

		vertexShader: document.getElementById( 'vs' ).textContent,
		fragmentShader: document.getElementById( 'fs' ).textContent,
		blending: THREE.AdditiveBlending,
		depthTest: false, 
		depthWrite: false,
		transparent: true

	} );

	mesh = new THREE.Points( geometry, material );
	scene.add( mesh );
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
	stats.update();
	controls.update();
	renderer.render( scene, camera );
}