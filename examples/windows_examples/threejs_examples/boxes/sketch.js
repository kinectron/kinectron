// Declare kinectron
let kinectron = null;

// Use two images to draw incoming feeds
let img1;
let img2;

// Three.js variables
const width = window.innerWidth;
const height = window.innerHeight;

// Three.js variables
let camera, scene, renderer; // standard scene variables
let geometry1, texture1, mesh1; // cube 1
let geometry2, texture2, mesh2; // cube 2

// Tell program when kinectron data is received 
let dataRcvd = false;


function changeTexture(data) {

  if (!dataRcvd) dataRcvd = true;

  img1.src = data.color; // get color image from kinectron data
  img2.src = data.depth; // get depth image from kinectron data

}

function init() {
  // Define and create an instance of kinectron
  let kinectronIpAddress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect to Kinectron server application
  kinectron.makeConnection();

  // Request color and depth feeds, call changeTexture when data is received 
  kinectron.startMultiFrame(["color", "depth"], changeTexture);

  // Create Three.js renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);
  
  // Three.js scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
  camera.position.z = 500;
  scene.add(camera);

  // Initialize images for Kinectron data;
  img1 = new Image;
  img2 = new Image;

  // Create first cube   
  texture1 = new THREE.Texture(img1);
  texture1.minFilter = THREE.NearestFilter; // avoid texture dimensions error
  let material1 = new THREE.MeshBasicMaterial({ map: texture1 });
  geometry1 = new THREE.BoxGeometry( 150, 150, 150 );
  geometry1.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 100, 0 ) );
  mesh1 = new THREE.Mesh( geometry1, material1 );
  scene.add( mesh1 );


  // Create second cube 
  texture2 = new THREE.Texture(img2);
  texture2.minFilter = THREE.NearestFilter; // avoid texture dimensions error
  let material2 = new THREE.MeshBasicMaterial({ map: texture2 });
  geometry2 = new THREE.BoxGeometry( 150, 150, 150 );
  geometry2.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -100, 0 ) );
  mesh2 = new THREE.Mesh( geometry2, material2 );
  scene.add( mesh2 );

  // Listen for window resize  
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame(animate);

  // If receiving data, update the textures each frame  
  if (dataRcvd) {
    texture1.needsUpdate = true;  
    texture2.needsUpdate = true;
  }
  
  // Rotate cubes 
  mesh1.rotation.y += 0.01;
  mesh2.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

init();
animate();
