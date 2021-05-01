// Copyright (c) 2020 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Azure depth key to point cloud using threejs
Depth key delivers depth data corresponding only to detected people 
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
  kinectron.startDepthKey(dkCallback);
}

// Run this callback each time Kinect data is received
function dkCallback(depthBuffer) {
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
  }

  // Give the particles their colors
  particles.colors = colors;

  // Create material for the points
  let material = new THREE.PointsMaterial({
    size: 3,
    vertexColors: THREE.VertexColors,
    // transparent: true,
  });

  // Create the points geometry
  mesh = new THREE.Points(particles, material);

  // Add point cloud to scene
  scene.add(mesh);
}

/// Function to update point cloud with depth data
function pointCloud(depthBuffer) {
  // Set desired depth range
  const rangeMin = 0;
  const rangeMax = 3000;

  // To iterate through particles
  let particleIndex = 0;

  // Loop through the depth buffer
  for (let i = 0; i < depthBuffer.length; i++) {
    // Get current depth value
    let depth = depthBuffer[i];

    // map depth to color
    const hue = map(depth, 500, 2000, 0.8, 0.2);
    const rgb = HSVtoRGB(hue, 1.0, 0.8);

    // assign rgb values
    particles.colors[particleIndex].r = rgb.r;
    particles.colors[particleIndex].g = rgb.g;
    particles.colors[particleIndex].b = rgb.b;

    // If the depth is out of depth range
    if (depth <= rangeMin || depth >= rangeMax) {
      // Push the particle far far away so we don't see it
      depth = Number.MAX_VALUE;
    }

    // Update depth value in the particle array
    particles.vertices[particleIndex].z = -depth;

    // Increase the particle index
    particleIndex++;
  }

  // Update particles and colors
  particles.verticesNeedUpdate = true;
  particles.colorsNeedUpdate = true;
}

function map(value, inputMin, inputMax, outputMin, outputMax) {
  return (
    ((value - inputMin) * (outputMax - outputMin)) /
      (inputMax - inputMin) +
    outputMin
  );
}

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: r,
    g: g,
    b: b,
  };
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
