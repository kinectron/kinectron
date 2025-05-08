// Copyright (c) 2020 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Azure raw depth to point cloud using threejs
=== */
// variable for kinectron
let kinectron = null;

// Set depth width and height same as Kinect binned depth
const DEPTHWIDTH = 640 / 2;
const DEPTHHEIGHT = 576 / 2;

// three.js scene variables
let renderer, camera, scene, controls;

// particle variables
const numParticles = DEPTHWIDTH * DEPTHHEIGHT;
let particles;
let colors = [];

function initKinectron() {
  // Define kinectron
  // replace the ip address with the kinectron server ip address
  // remember to keep the '' quotes
  const kinectronServerIPAddress = '127.0.0.1'; // FILL IN YOUR KINECTRON IP ADDRESS HERE

  // Create an instance of Kinectron
  kinectron = new Kinectron(kinectronServerIPAddress);

  // Set kinect type to azure
  kinectron.setKinectType('azure');

  // Connect remote to application
  kinectron.makeConnection();

  // Start depth key feed and set a callback
  kinectron.startRawDepth(rdCallback);
}

// Run this callback each time Kinect data is received
function rdCallback(depthBuffer) {
  // Update point cloud based on incoming Kinect data
  pointCloud(depthBuffer);
}

// Create the three.js scene
function initThreeJS() {
  // Create three.js renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('threeCanvas'),
    alpha: 0,
    antialias: true,
    clearColor: 0x000000,
  });

  // Create three.js camera
  camera = new THREE.PerspectiveCamera(
    30,
    renderer.domElement.width / renderer.domElement.height,
    1,
    10000,
  );
  camera.position.set(0, 0, 9200);

  // Create three.js controls
  controls = new THREE.TrackballControls(camera, renderer.domElement);

  // Create three.js scene with black background
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Create particles
  createParticles();

  // Size the scene to current window size
  onWindowResize();

  // Begin render loop
  render();
}

// Create particle for depth feed
function createParticles() {
  particles = new THREE.Geometry();

  // Create particles
  for (let i = 0; i < numParticles; i++) {
    // i % DEPTHWIDTH gives x remainder
    // - DEPTHWIDTH * 0.5 centers
    let x = (i % DEPTHWIDTH) - DEPTHWIDTH * 0.5;
    // creates y from the height to 0
    let y = DEPTHHEIGHT - Math.floor(i / DEPTHWIDTH);

    // create a new three point vector
    let vertex = new THREE.Vector3(x, y, Math.random());

    // add it to the particles
    particles.vertices.push(vertex);

    // Assign each particle a color -- gradient
    let color = Math.floor((i / numParticles) * 100); // r,g channel
    let color2 = 100 - color; // blue channel
    colors[i] = new THREE.Color(
      'rgb(' + color2 + '%,' + color2 + '%, ' + color + '%)',
    );

    // Some other color options....

    // Assign each particle a color -- rainbow
    // let color = i/numParticles * 360;
    //colors[i] = new THREE.Color("hsl(" + color + ", 50%, 50%)");

    // Assign each particle a color -- white
    //colors[i] = new THREE.Color(0xffffff);
  }

  // Give the particles their colors
  particles.colors = colors;

  // Create material for the points
  let material = new THREE.PointsMaterial({
    size: 4,
    vertexColors: THREE.VertexColors,
    transparent: true,
  });

  // Create the points geometry
  mesh = new THREE.Points(particles, material);

  // Add point cloud to scene
  scene.add(mesh);
}

// Function to update point cloud with depth data
function pointCloud(depthBuffer) {
  // Set desired depth range
  let nDepthMinReliableDistance = 0;
  let nDepthMaxDistance = 3000;

  // To iterate through particles
  let particleIndex = 0;

  // Loop through the depth buffer
  for (let i = 0; i < depthBuffer.length; i++) {
    // Get current depth value
    let depth = depthBuffer[i];

    // If the depth is out of depth range
    if (
      depth <= nDepthMinReliableDistance ||
      depth >= nDepthMaxDistance
    ) {
      // Push the particle far far away so we don't see it
      depth = Number.MAX_VALUE;
    }

    // Update depth value in the particle array
    particles.vertices[particleIndex].z = depth;

    // Increase the particle index
    particleIndex++;
  }

  // Update particles
  particles.verticesNeedUpdate = true;
}

// Resize scene based on window size
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render three.js scene
function render() {
  // Render the scene
  // https://stackoverflow.com/questions/41077723/what-is-the-exact-meaning-for-renderer-in-programming
  renderer.render(scene, camera);

  // Update the trackball controls with each scene
  controls.update();

  // Request anim frame
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  requestAnimationFrame(render);
}

// Resize graphics when user resizes window
window.addEventListener('resize', onWindowResize, false);

// Wait for page to load to create three.js scene and Kinectron connection
window.addEventListener('load', function () {
  // Create three.js scene
  initThreeJS();

  // Start kinectron
  initKinectron();
});
