//Some general Three.js components
let renderer, scene, camera, controls, stats;

//Kinectron
let kinectron, kinectronGeo;

//Kick off the example
window.onload = function () {
  init();
};

function init() {
  //Setup renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Define and create an instance of kinectron
  const kinectronServerIPAddress = '127.0.0.1'; // FILL IN YOUR KINECTRON IP ADDRESS HERE

  //Open connection with Kinect
  kinectron = new Kinectron(kinectronServerIPAddress);

  // Set kinect type to azure
  kinectron.setKinectType('azure');

  // Connect to Kinectron server
  kinectron.makeConnection();

  //Start RGBD feed and set callback for new frames
  kinectron.startRGBD(onNewKinectFrame);

  // Setup scene
  scene = new THREE.Scene();

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(-4, 2, 7);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //Create a kinectron geometry instance - First argument takes the rendering type ("wire" / "points" / "mesh")
  kinectronGeo = new THREE.KinectGeometry('wire');
  kinectronGeo.kinectron.setDisplacement(15.0);

  //Add it to the scene
  scene.add(kinectronGeo);

  //Create mouse OrbitControls
  controls = new THREE.OrbitControls(camera);

  // A grid helper as a floor reference
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  //Add stats
  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  //Add an event listener for window resize
  window.addEventListener('resize', onWindowResize, false);

  //Add an event listener to key down
  window.addEventListener('keydown', onKeyDown, false);

  render();
}

function onNewKinectFrame(ktronImg) {
  kinectronGeo.kinectron.bind(ktronImg.src);
}

function onKeyDown() {
  // Use '9' key to stop kinect from running
  if (event.keyCode === 57) {
    kinectron.stopAll();
  }
}

function render() {
  //Update the FPS counter
  stats.update();

  //Request the next frame
  requestAnimationFrame(render);

  //Render
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
