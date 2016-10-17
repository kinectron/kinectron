var kinectron = null;

var canvas = null;
var context = null;
var imageData = null;
var imageDataSize = null;
var imageDataArray = null;

var image = null;

//needed?
var animFrame = null;

var depthColorBuffer;
var depthBuffer;

// Three.js variables 
var depthWidth = 512, depthHeight = 424;
var renderer, camera, scene, controls;

var particles = new THREE.Geometry();
var colors = [];
var numParticles = depthWidth * depthHeight * 2;

var busy = false;

// webGL image buffer variables
var colorRenderer = null; 
var webGLCanvas = null;


function mfCallback(dataReceived) {
  depthColorBuffer = drawBuffer(dataReceived.depthColor, image, colorContext);
  depthBuffer = drawBuffer(dataReceived.rawDepth, image2, depthContext);

  pointCloud(depthBuffer, depthColorBuffer);

}


window.addEventListener('load', function() {
  canvas = document.getElementById('outputCanvas');
  context = canvas.getContext('2d');

  colorCanvas = document.getElementById('colorCanvas');
  colorContext = colorCanvas.getContext('2d');
  colorContext.fillStyle="ffffff";
  colorContext.fillRect(0, 0, colorCanvas.width, colorCanvas.height);

  depthCanvas = document.getElementById('depthCanvas');
  depthContext = depthCanvas.getContext('2d');
  depthContext.fillStyle="#ffffff";
  depthContext.fillRect(0, 0, depthCanvas.width, depthCanvas.height);

  canvas.style.display = 'none';
  imageData = context.createImageData(canvas.width, canvas.height);
  imageDataSize = imageData.data.length;
  imageDataArray = imageData.data;

  image = document.getElementById('image');
  image2 = document.getElementById('image2');

  webGLCanvas = document.getElementById('webGLCanvas');
  colorRenderer = new ImageBufferRendererWebgl(webGLCanvas);

  initPointCloud();

  kinectron = new Kinectron();
  kinectron.makeConnection();

  kinectron.setMultiFrameCallback(mfCallback);


});

function drawBuffer(data, image, context) {
   image.src = data;
   context.clearRect(0, 0, context.canvas.width, context.canvas.height);
   context.drawImage(image, 0, 0);
   var imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
   var dataBuffer = imageData.data;
   return dataBuffer;
}

function createGrid() {
  // ground box
  var geometry = new THREE.BoxGeometry( 500, 2, 500 );
  var material = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( 0, -1, 0 );
  scene.add( mesh );
  mesh = new THREE.GridHelper( 250, 10 );
  scene.add( mesh );

  // axes
  var axis = new THREE.AxisHelper( 250 );
  scene.add( axis );
  renderer.render( scene, camera );

  var geometryBox = new THREE.BoxGeometry( 50, 20, 50 );
  var materialBox = new THREE.MeshNormalMaterial();
  var box = new THREE.Mesh( geometryBox, materialBox );
  scene.add( box );
}

function createParticles() {
  //create particles
  console.log('createparticles');

  for(var i = 0; i < numParticles; i++) {
    var x = i % depthWidth - depthWidth * 0.5;
    var y = depthHeight - Math.floor(i / depthWidth);
    var vertex = new THREE.Vector3(x, y, Math.random());
    particles.vertices.push(vertex);
    colors[i] = new THREE.Color(0xffffff);
  }
  particles.colors = colors;
  var material = new THREE.PointCloudMaterial( { size: 3, vertexColors: THREE.VertexColors, transparent: true } );
  mesh = new THREE.PointCloud(particles, material);
  scene.add(mesh);
}

function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function render() {
  renderer.render( scene, camera );
  controls.update();
  animFrame = requestAnimationFrame(render);
}

function initPointCloud(){
  console.log('init point cloud');
  // create three.js scene
  renderer = new THREE.WebGLRenderer( {
    canvas: document.getElementById('cloudCanvas'),
    alpha: 1, antialias: true, clearColor: 0xffffff
  } );

  camera = new THREE.PerspectiveCamera( 40, renderer.domElement.width / renderer.domElement.height, 1, 10000 );
  camera.position.set( 0, 300, 3000 );
  controls = new THREE.TrackballControls( camera, renderer.domElement );

  scene = new THREE.Scene();
  createGrid();
  createParticles();

  window.addEventListener( 'resize', onWindowResize, false );

  onWindowResize();   
  render();


  //busy = false;
}

function pointCloud(depthBuffer, depthColorBuffer) {
    if(busy) {
      return;
    }

    busy = true;
    var nDepthMinReliableDistance = 500;
    var nDepthMaxDistance = 4500;
    var mapDepthToByte = nDepthMaxDistance / 256;
    var j = 0, k = 0;

    for(var i = 0; i < depthBuffer.length; i+=2) {

     var depth = (depthBuffer[i+1] << 8) + depthBuffer[i]; //get uint16 data from buffer
     if(depth <= nDepthMinReliableDistance || depth >= nDepthMaxDistance) depth = Number.MAX_VALUE; //push them far far away so we don't see them
      particles.vertices[j].z = (nDepthMaxDistance - depth) - 2000;
      particles.colors[j].setRGB(depthColorBuffer[k] / 255, depthColorBuffer[k+1] / 255, depthColorBuffer[k+2] / 255);
      j++;
      k+=4;
    }
    particles.verticesNeedUpdate = true;
    particles.colorsNeedUpdate = true;
    busy = false;
}