if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var scene, camera, light, renderer;
var geometry, mesh, material, texture;
var geometry2, mesh2, material2, texture2;

var dClipping1, flrClipping1, xLeftClip1, xRightClip1;  
var dClipping2, flrClipping2, xLeftClip2, xRightClip2;

var controls, stats;

window.addEventListener('load', init);

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	stats = new Stats();
	container.appendChild( stats.dom );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 30, 13, 765 );

	scene = new THREE.Scene();

	createKinectImg1();

	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 1);
	container.appendChild( renderer.domElement );

	initKinectron();

	initGui();

	controls = new THREE.TrackballControls( camera, renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	animate();

}

function createKinectImg1() {

	// set clipping and dimensions
	var width = 768, height = 424;
	var nearClipping = 850, farClipping = 4000;

	// Setup canvas and context for first kinect
	canvas = document.getElementById('canvas1');    
	canvas.width = CANVW;
	canvas.height = CANVH;
	ctx = canvas.getContext('2d');

	// texture for kinect1
	texture = new THREE.Texture(canvas);
	texture.minFilter = THREE.NearestFilter;

	// Setup canvas and context for kinect 2
	canvas2 = document.getElementById('canvas2');    
	canvas2.width = CANVW;
	canvas2.height = CANVH;
	ctx2 = canvas2.getContext('2d');

	// texture for k 2
	texture2 = new THREE.Texture(canvas2);
	texture2.minFilter = THREE.NearestFilter;

	// geo for both kinects
	geometry = new THREE.BufferGeometry();

	// verts for kinect1
	var vertices = new Float32Array( width * height * 3 );

	for ( var i = 0, j = 0, l = vertices.length; i < l; i += 3, j ++ ) {

		vertices[ i ] = j % width;
		vertices[ i + 1 ] = Math.floor( j / width );

	}

	// vertices to first geometry
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	// 

	// create shader material

	updateMaterial();
	
	material = new THREE.ShaderMaterial( {

		uniforms: {

			"map1":         { value: texture },
			"map2": 				{ value: texture2 }, 
			"width":        { value: width },
			"height":       { value: height },
			"nearClipping": { value: nearClipping },
			"farClipping":  { value: farClipping },
			"dClipping1": 	{ value: dClipping1 },
			"dClipping2":   { value : dClipping2 },  
			"flrClipping1": { value : flrClipping1 },
			"flrClipping2": { value : flrClipping2 },
			"pointSize":    { value: 2 },
			"zOffset":      { value: 1000 },
      "xLeftClip1":   { value: xLeftClip1 }, //0.0 is natural beginning
      "xRightClip1":  { value: xRightClip1 },  //0.66 is natural end
      "xLeftClip2":   { value: xLeftClip2 }, //0.33 is natural beginning
      "xRightClip2":  { value: xRightClip2 }  //1.0 is natural end 

		},
		vertexShader: document.getElementById( 'vs' ).textContent,
		fragmentShader: document.getElementById( 'fs' ).textContent,
		blending: THREE.AdditiveBlending,
		depthTest: false, depthWrite: false,
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
	material.needsUpdate = true;
 
  texture.needsUpdate = true;
  texture2.needsUpdate = true;

  requestAnimationFrame( animate );

	render();
	stats.update();
}

function render() {

	controls.update();
	renderer.render( scene, camera );

}