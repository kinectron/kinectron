// spline code from https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html

// animation starts off
var animation = false, lookAhead = false;

// do not show helper by default
var showCameraHelper = false;

// how big is spline
var scale = 2; 
var closed2 = true;

var parent;
var tube, tubeMesh;

// can we see spline
var tubeVisibility = true;

// create spline
var spline = new THREE.Curves.GrannyKnot();

// spline vars 
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();

// create spline geometries
var pipeSpline = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 10, -10 ), new THREE.Vector3( 10, 0, -10 ),
	new THREE.Vector3( 20, 0, 0 ), new THREE.Vector3( 30, 0, 10 ),
	new THREE.Vector3( 30, 0, 20 ), new THREE.Vector3( 20, 0, 30 ),
	new THREE.Vector3( 10, 0, 30 ), new THREE.Vector3( 0, 0, 30 ),
	new THREE.Vector3( -10, 10, 30 ), new THREE.Vector3( -10, 20, 30 ),
	new THREE.Vector3( 0, 30, 30 ), new THREE.Vector3( 10, 30, 30 ),
	new THREE.Vector3( 20, 30, 15 ), new THREE.Vector3( 10, 30, 10 ),
	new THREE.Vector3( 0, 30, 10 ), new THREE.Vector3( -10, 20, 10 ),
	new THREE.Vector3( -10, 10, 10 ), new THREE.Vector3( 0, 0, 10 ),
	new THREE.Vector3( 10, -10, 10 ), new THREE.Vector3( 20, -15, 10 ),
	new THREE.Vector3( 30, -15, 10 ), new THREE.Vector3( 40, -15, 10 ),
	new THREE.Vector3( 50, -15, 10 ), new THREE.Vector3( 60, 0, 10 ),
	new THREE.Vector3( 70, 0, 0 ), new THREE.Vector3( 80, 0, 0 ),
	new THREE.Vector3( 90, 0, 0 ), new THREE.Vector3( 100, 0, 0 )
] );

var sampleClosedSpline = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, -40, -40 ),
	new THREE.Vector3( 0, 40, -40 ),
	new THREE.Vector3( 0, 140, -40 ),
	new THREE.Vector3( 0, 40, 40 ),
	new THREE.Vector3( 0, -40, 40 )
] );

sampleClosedSpline.type = 'catmullrom';
sampleClosedSpline.closed = true;

var pipeSpline = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, 10, -10 ), new THREE.Vector3( 10, 0, -10 ),
	new THREE.Vector3( 20, 0, 0 ), new THREE.Vector3( 30, 0, 10 ),
	new THREE.Vector3( 30, 0, 20 ), new THREE.Vector3( 20, 0, 30 ),
	new THREE.Vector3( 10, 0, 30 ), new THREE.Vector3( 0, 0, 30 ),
	new THREE.Vector3( -10, 10, 30 ), new THREE.Vector3( -10, 20, 30 ),
	new THREE.Vector3( 0, 30, 30 ), new THREE.Vector3( 10, 30, 30 ),
	new THREE.Vector3( 20, 30, 15 ), new THREE.Vector3( 10, 30, 10 ),
	new THREE.Vector3( 0, 30, 10 ), new THREE.Vector3( -10, 20, 10 ),
	new THREE.Vector3( -10, 10, 10 ), new THREE.Vector3( 0, 0, 10 ),
	new THREE.Vector3( 10, -10, 10 ), new THREE.Vector3( 20, -15, 10 ),
	new THREE.Vector3( 30, -15, 10 ), new THREE.Vector3( 40, -15, 10 ),
	new THREE.Vector3( 50, -15, 10 ), new THREE.Vector3( 60, 0, 10 ),
	new THREE.Vector3( 70, 0, 0 ), new THREE.Vector3( 80, 0, 0 ),
	new THREE.Vector3( 90, 0, 0 ), new THREE.Vector3( 100, 0, 0 )
] );

var sampleClosedSpline = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( 0, -40, -40 ),
	new THREE.Vector3( 0, 40, -40 ),
	new THREE.Vector3( 0, 140, -40 ),
	new THREE.Vector3( 0, 40, 40 ),
	new THREE.Vector3( 0, -40, 40 )
] );

sampleClosedSpline.type = 'catmullrom';
sampleClosedSpline.closed = true;


function createSplineCamera() {
	
	// put camera and helper in an object

	parent = new THREE.Object3D();
	scene.add( parent );

	// create spline camera

	splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
	parent.add( splineCamera );

	// create helper for camera

	cameraHelper = new THREE.CameraHelper( splineCamera );
	scene.add( cameraHelper );

	addTube();

	// debug camera

	cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
	parent.add( cameraEye );

	cameraHelper.visible = showCameraHelper;
	cameraEye.visible = showCameraHelper;

}

function addTube() {

	// create tube for spline 

	var segments = 100;
	closed2 = true;

	var radiusSegments = 3;

	if ( tubeMesh !== undefined ) parent.remove( tubeMesh );

	extrudePath = spline;

	tube = new THREE.TubeBufferGeometry( extrudePath, segments, 2, radiusSegments, closed2 );

	addGeometry( tube, 0xff00ff );
	
	// set scale of spline

	tubeMesh.scale.set( scale, scale, scale );
	tubeMesh.visible = tubeVisibility;

}


function addGeometry( geometry, color ) {

	// 3d shape

	tubeMesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [
		new THREE.MeshLambertMaterial( {
			color: color
		} ),
		new THREE.MeshBasicMaterial( {
			color: 0x000000,
			opacity: 0.3,
			wireframe: true,
			transparent: true
	} ) ] );

	parent.add( tubeMesh );

}

function animateCamera( toggle ) {

	// toggle the spline camera on and off 

	if ( toggle === true ) {
		animation = animation === false;
	}

	// set visibility of camera debuggers

	cameraHelper.visible = showCameraHelper;
	cameraEye.visible = showCameraHelper;

}

function renderSplineCamera() {
	// Try Animate Camera Along Spline

	var time = Date.now();
	var looptime = 20 * 1000;
	var t = ( time % looptime ) / looptime;

	var pos = tube.parameters.path.getPointAt( t );
	pos.multiplyScalar( scale );

	// interpolation

	var segments = tube.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;

	binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );

	var dir = tube.parameters.path.getTangentAt( t );

	var offset = 15;

	normal.copy( binormal ).cross( dir );

	// We move on a offset on its binormal

	pos.add( normal.clone().multiplyScalar( offset ) );

	splineCamera.position.copy( pos );
	cameraEye.position.copy( pos );

	// Using arclength for stablization in look ahead.

	var lookAt = tube.parameters.path.getPointAt( ( t + 30 / tube.parameters.path.getLength() ) % 1 ).multiplyScalar( scale );

	// Camera Orientation 2 - up orientation via normal

	if ( !lookAhead ) lookAt.copy( pos ).add( dir );
	splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
	splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );

	cameraHelper.update();
}
