var myCanvas = null;

// Declare kinectron 
var kinectron = null;

var CameraParams = {
  cx : 254.878,
  cy : 205.395,
  fx : 365.456,
  fy : 365.456,
  k1 : 0.0905474,
  k2 : -0.26819,
  k3 : 0.0950862,
  p1 : 0.0,
  p2 : 0.0
};

var a = 0;

var depthWidth = 512;
var depthHeight = 424;

var busy = false;


function setup() {
  createCanvas(800, 600, WEBGL);
  background(0);

  // Define and create an instance of kinectron
  var yourKinectronIpAdress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron();

  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();

  // Set callbacks
  kinectron.setRawDepthCallback(rawDepthCallback);
}

function draw() {
  
}


function rawDepthCallback(data) {
  if (busy) return;
  busy = true;
  //background(0);

  // Translate and rotate
  push();
  translate(width/2, height/2, -2250);
  rotateY(a);

  // We're just going to calculate and draw every 2nd pixel
  var skip = 4;

  // Get the raw depth as array of integers
  var depth = data;

  fill(255);
  //strokeWeight(2);
  beginShape(POINTS);
  for (var x = 0; x < depthWidth; x+=skip) {
    for (var y = 0; y < depthHeight; y+=skip) {
      var offset = x + y * depthWidth;
      var d = depth[offset];
      //calculte the x, y, z camera position based on the depth information
      console.log(x, y, d);
      var nPoint = depthToPointCloudPos(x, y, d);
      console.log(nPoint);
      //if (nPoint.x > 0) console.log(nPoint);
      box(30);

      vertex(nPoint.x, nPoint.y, nPoint.z);
    }
  }
  endShape();

  pop();

  // Rotate
  a += 0.0015;

  busy = false;
}

//calculte the xyz camera position based on the depth data
function depthToPointCloudPos(ix, iy, depthValue) {
  var tPoint = {};
  tPoint.z = depthValue;// / (1.0f); // Convert from mm to meters
  tPoint.x = (ix - CameraParams.cx) * tPoint.z / CameraParams.fx;
  tPoint.y = (iy - CameraParams.cy) * tPoint.z / CameraParams.fy;
  return tPoint;
}
