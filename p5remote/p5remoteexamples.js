var mypeerid = null;
var peer = null;
var connection = null;

var canvas = null;
var context = null;

var img = null;

// All possible camera options 
var cameraOptions = ['rgb', 'depth', 'key', 'infrared', 'le-infrared', 'fh-joint', 'scale', 'skeleton', 'stop-all'];

// Kinect color and depth cameras have different dimensions
var COLORWIDTH = 960;
var COLORHEIGHT = 540;
var DEPTHWIDTH = 512;
var DEPTHHEIGHT = 424;

// variables for drawing skeleton
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
var HANDSIZE = 40;
var HANDCLOSEDCOLOR = "red";
var HANDOPENCOLOR = "green";
var HANDLASSOCOLOR = "blue"; 
var index = 0;

// create new peer 
peer = new Peer({host: 'liveweb.itp.io', port: 9000, path: '/', secure: true})

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  mypeerid = id;
});

peer.on('connection', function(conn) {
  connection = conn;
  connection.on('open', function() {
    console.log("connected");
  });
  connection.on('data', function(data) {
  });
});

function makeConnection() {
  var peerid = document.getElementById('peerid').value;
  connection = peer.connect(peerid); // get a webrtc DataConnection
  connection.on('open', function(data) {
    console.log("Open data connection with server");

  });

  // Route incoming traffic from Kinectron
  connection.on('data', function(dataReceived) {
    switch (dataReceived.event) {
      // If image data draw image
      case 'frame':
        console.log(dataReceived.data.name);
        img.elt.src = dataReceived.data.imagedata;
      break;
      // If new feed reset canvas and image
      case 'framesize':
        if (dataReceived.data.size == 'color') {
          setImageSize(COLORWIDTH, COLORHEIGHT);
        } else if (dataReceived.data.size == 'depth') {
          setImageSize(DEPTHWIDTH, DEPTHHEIGHT);
        }
      break;
     // If skeleton data, draw skeleton
      case 'bodyFrame':
        console.log('Body Frame:');

        // TO FIX: Resetting image on each frame bc frame not resetting with canvas reset function
        img.elt.src = " ";
        bodyTracked(dataReceived.data);
      break;
      
      case 'floorHeightTracker':
        console.log('Floor Height');
        showHeight(dataReceived.data);
      break;
    }
  });
}

function sendToPeer() {
  var evt = 'feed';
  var data = document.getElementById('feed').value;
  var verified = verifyFeed(data);
  var dataToSend = {"event": evt, "data": data};

  if (verified) {
    connection.send(dataToSend);
  }
}

function verifyFeed(name) {
  var nameExists = false; 
  for (var i = 0; i < cameraOptions.length; i++) {
    if (cameraOptions[i] == name) {
      nameExists = true;
    } 
  }
  return nameExists;
}


// p5 setup
function setup() {
  // create canvas and context
  canvas = createCanvas();
  canvas.parent("container");
  context = canvas.drawingContext;

  // create iamge 
  img = createImg(" ");
  img.parent("container");  

  // set initial size of canvas and image and layer
  canvas.style("width: " + COLORWIDTH + "; height: " + COLORHEIGHT + "; position: absolute;");
  img.style("width: " + COLORWIDTH + "; height: " + COLORHEIGHT);

  noStroke();
}


function setImageSize(width, height) {
  // clear canvas and img
  clear();
  img.elt.src = " ";
  // reset size of canvas and image
  canvas.width = width;
  canvas.height = height;
  canvas.canvas.width = width;
  canvas.canvas.height = height;
  canvas.style("width: " + width + "; height: " + height);
  img.style("width: " + width + "; height: " + height); 
}

function showHeight(data) {
  // clear canvas
  clear();
  // draw height
  fill("red");
  ellipse(data.joint.colorX * canvas.canvas.width, data.joint.colorY * canvas.canvas.height, 20, 20);
  textSize(48);
  textFont("sans");
  text(data.distance.toFixed(2) + "m", 20 + data.joint.colorX * canvas.canvas.width, data.joint.colorY * canvas.canvas.height);
}


function updateHandState(handState, jointPoint) {
  switch (handState) {
    // 3 is Kinect2 closed handstate
    case 3:
      drawHand(jointPoint, HANDCLOSEDCOLOR);
    break;

    // 2 is Kinect2 open handstate
    case 2:
      drawHand(jointPoint, HANDOPENCOLOR);
    break;

    // 4 is Kinect2 open handstate
    case 4:
      drawHand(jointPoint, HANDLASSOCOLOR);
    break;
  }
}

function drawHand(jointPoint, handColor) {
  // draw hand cicles
  var handData = {depthX: jointPoint.depthX, depthY: jointPoint.depthY, handColor: handColor, handSize: HANDSIZE};
  fill(handColor);
  ellipse(jointPoint.depthX * canvas.canvas.width, jointPoint.depthY * canvas.canvas.height, HANDSIZE, HANDSIZE);
}


function bodyTracked(body) {
  // clear canvas each time
  clear();
  // draw body joints
  for(var jointType in body.joints) {
    var joint = body.joints[jointType];
    fill(colors[index]);
    rect(joint.depthX * canvas.canvas.width, joint.depthY * canvas.canvas.height, 10, 10);
    var skeletonJointData = {color: colors[index], depthX: joint.depthX, depthY: joint.depthY};
  }
  // draw hand states
  // 7 is left hand in Kinect2
  updateHandState(body.leftHandState, body.joints[7]);
  // 11 is right hand in Kinect2
  updateHandState(body.rightHandState, body.joints[11]);
}
