// Copyright (c) 2019 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Azure raw depth to point cloud using threejs
=== */
//
let kinectron = null;

// Set depth width and height same Kinect
const DEPTHWIDTH = 640 / 2;
const DEPTHHEIGHT = 576 / 2;

let depthBuffer;
let renderer, camera, scene, controls;

let particles = new THREE.Geometry();
let colors = [];
const numParticles = DEPTHWIDTH * DEPTHHEIGHT;

let animFrame = null;
let busy = false;

// Wait for page to load to create webgl canvas and Kinectron connection
window.addEventListener("load", function() {
  // Create point cloud
  initPointCloud();

  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Set kinect type to azure
  kinectron.setKinectType("azure");

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

function initPointCloud() {
  // Create three.js renderer
  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("cloudCanvas"),
    alpha: 0,
    antialias: true,
    clearColor: 0x000000
  });

  // Create three.js camera and controls
  camera = new THREE.PerspectiveCamera(
    30,
    renderer.domElement.width / renderer.domElement.height,
    1,
    10000
  );
  camera.position.set(0, 0, 9200);
  controls = new THREE.TrackballControls(camera, renderer.domElement);

  // Create three.js scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  createParticles();
  window.addEventListener("resize", onWindowResize, false);
  onWindowResize();
  render();
}

function createParticles() {
  // Create particles
  for (let i = 0; i < numParticles; i++) {
    let x = (i % DEPTHWIDTH) - DEPTHWIDTH * 0.5;
    let y = DEPTHHEIGHT - Math.floor(i / DEPTHWIDTH);
    let vertex = new THREE.Vector3(x, y, Math.random());
    particles.vertices.push(vertex);

    // Assign each particle a color -- rainbow
    // let color = i/numParticles * 360;
    //colors[i] = new THREE.Color("hsl(" + color + ", 50%, 50%)");

    // Assign each particle a color -- white
    //colors[i] = new THREE.Color(0xffffff);

    //let color = i/numParticles;
    let color = Math.floor((i / numParticles) * 100);
    let color2 = 100 - color;
    colors[i] = new THREE.Color(
      "rgb(" + color2 + "%," + color2 + "%, " + color + "%)"
    );
  }

  // Add point cloud to scene
  particles.colors = colors;
  let material = new THREE.PointsMaterial({
    size: 4,
    vertexColors: THREE.VertexColors,
    transparent: true
  });
  mesh = new THREE.Points(particles, material);
  scene.add(mesh);
}

function pointCloud(depthBuffer) {
  if (busy) {
    return;
  }

  busy = true;

  // Set desired depth resolution
  let nDepthMinReliableDistance = 0;
  let nDepthMaxDistance = 3000;
  let j = 0;

  // Match depth buffer info to each particle
  for (let i = 0; i < depthBuffer.length; i++) {
    let depth = depthBuffer[i];
    if (depth <= nDepthMinReliableDistance || depth >= nDepthMaxDistance)
      depth = Number.MAX_VALUE; //push particles far far away so we don't see them
    particles.vertices[j].z = nDepthMaxDistance - depth - 2000;
    j++;
  }

  // Update particles
  particles.verticesNeedUpdate = true;
  busy = false;
}

// Resize scene based on window size
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Render three.js scene
function render() {
  renderer.render(scene, camera);
  controls.update();
  animFrame = requestAnimationFrame(render);
}
