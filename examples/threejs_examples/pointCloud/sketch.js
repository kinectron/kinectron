var kinectron = null;

// Set depth width and height same Kinect 
var DEPTHWIDTH = 512;
var DEPTHHEIGHT = 424;

var depthBuffer;
var renderer, camera, scene, controls;

var particles = new THREE.Geometry();
var colors = [];
var numParticles = DEPTHWIDTH * DEPTHHEIGHT;

var animFrame = null;
var busy = false;



// Wait for page to load to create webgl canvas and Kinectron connection
window.addEventListener('load', function() {

  // Create point cloud
  initPointCloud();

  // Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.223.38"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect remote to application
  kinectron.makeConnection();
  kinectron.startRawDepth(rdCallback);
});

// Run this callback each time Kinect data is received
function rdCallback(dataReceived) {
  depthBuffer = dataReceived;

  // Update point cloud based on incoming Kinect data
  pointCloud(depthBuffer);
}

function initPointCloud(){ 
  // Create three.js renderer
  renderer = new THREE.WebGLRenderer( {
    canvas: document.getElementById('cloudCanvas'),
    alpha: 0, antialias: true, clearColor: 0x000000
  } );

  // Create three.js camera and controls
  camera = new THREE.PerspectiveCamera( 40, renderer.domElement.width / renderer.domElement.height, 1, 10000 );
  camera.position.set( 0, 300, 3000 );
  controls = new THREE.TrackballControls( camera, renderer.domElement );

  // Create three.js scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xE80C7A );
  
  createParticles();
  window.addEventListener( 'resize', onWindowResize, false );
  onWindowResize();   
  render();
}

function createParticles() {

  // Create particles
  for(var i = 0; i < numParticles; i++) {
    var x = i % DEPTHWIDTH - DEPTHWIDTH * 0.5;
    var y = DEPTHHEIGHT - Math.floor(i / DEPTHWIDTH);
    var vertex = new THREE.Vector3(x, y, Math.random());
    particles.vertices.push(vertex);

    // Assign each particle a color -- rainbow
    // let color = i/numParticles * 360;
    //colors[i] = new THREE.Color("hsl(" + color + ", 50%, 50%)");

    // Assign each particle a color -- white
    //colors[i] = new THREE.Color(0xffffff);

    //let color = i/numParticles;
    let color = Math.floor(i/numParticles*100);
    let color2 = 100-color;
    colors[i] = new THREE.Color("rgb(" + color2 + "%," + color2 + "%, " + color + "%)");
  }

  // Add point cloud to scene
  particles.colors = colors;
  var material = new THREE.PointsMaterial( { size: 4, vertexColors: THREE.VertexColors, transparent: true } );
  mesh = new THREE.Points(particles, material);
  scene.add(mesh);
}

function pointCloud(depthBuffer) {
  if(busy) {
    return;
  }

  busy = true;

  // Set desired depth resolution
  var nDepthMinReliableDistance = 500;
  var nDepthMaxDistance = 5000;
  var j = 0;

  // Match depth buffer info to each particle
  for(var i = 0; i < depthBuffer.length; i++) {
    var depth = depthBuffer[i]; 
    if(depth <= nDepthMinReliableDistance || depth >= nDepthMaxDistance) depth = Number.MAX_VALUE; //push particles far far away so we don't see them
    particles.vertices[j].z = (nDepthMaxDistance - depth) - 2000;
    j++;
  }

  // Update particles
  particles.verticesNeedUpdate = true;
  busy = false;
}

// Resize scene based on window size
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// Render three.js scene
function render() {
  renderer.render( scene, camera );
  controls.update();
  animFrame = requestAnimationFrame(render);
}