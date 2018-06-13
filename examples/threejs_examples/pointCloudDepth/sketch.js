// This example uses the three.js Kinect example. It replaces the video with the Kinectron depth feed

var container;

var scene, camera, light, renderer;
var geometry, cube, mesh, material;
var mouse, center;
var stats;

var kinectron;

var img, texture;

if ( Detector.webgl ) {

	init();
	animate();

} else {

	document.body.appendChild( Detector.getWebGLErrorMessage() );

}

function changeTexture(depthImg) {

  img.src = depthImg.src; // get color image from kinectron data
  
  img.onload = function () {
  	texture.needsUpdate = true;
  };

}



function init() {

	// Define and create an instance of kinectron
	var kinectronIpAddress = "172.16.222.192"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
	kinectron = new Kinectron(kinectronIpAddress);

	// Connect remote to application
	kinectron.makeConnection();
	kinectron.startDepth(changeTexture);

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	var info = document.createElement( 'div' );
	info.id = 'info';
	info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> - kinect';
	document.body.appendChild( info );

	stats = new Stats();
	// container.appendChild( stats.dom );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 0, 500 );

	scene = new THREE.Scene();
	center = new THREE.Vector3();
	center.z = - 1000;

	// create image for kinectron feed 
	img = new Image;

	// create texture 
	texture = new THREE.Texture( img );
	texture.minFilter = THREE.NearestFilter;
	texture.format = THREE.RGBFormat;

	var width = 512, height = 424;
	var nearClipping = 850, farClipping = 4000;

	geometry = new THREE.BufferGeometry();

	var vertices = new Float32Array( width * height * 3 );

	for ( var i = 0, j = 0, l = vertices.length; i < l; i += 3, j ++ ) {

		vertices[ i ] = j % width;
		vertices[ i + 1 ] = Math.floor( j / width );

	}

	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	material = new THREE.ShaderMaterial( {

		uniforms: {

			"map":          { value: texture },
			"width":        { value: width },
			"height":       { value: height },
			"nearClipping": { value: nearClipping },
			"farClipping":  { value: farClipping },

			"pointSize":    { value: 2 },
			"zOffset":      { value: 1000 }

		},
		vertexShader: document.getElementById( 'vs' ).textContent,
		fragmentShader: document.getElementById( 'fs' ).textContent,
		blending: THREE.AdditiveBlending,
		depthTest: false, depthWrite: false,
		transparent: true

	} );

	mesh = new THREE.Points( geometry, material );
	scene.add( mesh );

	var gui = new dat.GUI();
	gui.add( material.uniforms.nearClipping, 'value', 1, 10000, 1.0 ).name( 'nearClipping' );
	gui.add( material.uniforms.farClipping, 'value', 1, 10000, 1.0 ).name( 'farClipping' );
	gui.add( material.uniforms.pointSize, 'value', 1, 10, 1.0 ).name( 'pointSize' );
	gui.add( material.uniforms.zOffset, 'value', 0, 4000, 1.0 ).name( 'zOffset' );
	gui.close();

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	mouse = new THREE.Vector3( 0, 0, 1 );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );

	window.addEventListener( 'keydown', stopKinectron, false );

}


function stopKinectron() {
 
 	kinectron.stopAll();

}

function onDocumentMouseMove( event ) {

	mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
	mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );

	render();
	stats.update();

}

function render() {

	camera.position.x += ( mouse.x - camera.position.x ) * 0.05;
	camera.position.y += ( - mouse.y - camera.position.y ) * 0.05;
	camera.lookAt( center );

	renderer.render( scene, camera );

}