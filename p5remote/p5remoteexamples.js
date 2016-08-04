var mypeerid = null;
var peer = null;
var connection = null;

var canvas = null;
var context = null;

var img = null;

var COLORWIDTH = 960;
var COLORHEIGHT = 540;

var DEPTHWIDTH = 512;
var DEPTHHEIGHT = 424;

//variables for skeleton
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
var HANDSIZE = 40;
var HANDCLOSEDCOLOR = "red";
var HANDOPENCOLOR = "green";
var HANDLASSOCOLOR = "blue"; 
var index = 0;

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
     // console.log(data);
  });
});

function makeConnection() {
  var peerid = document.getElementById('peerid').value;
  connection = peer.connect(peerid); // get a webrtc DataConnection
  connection.on('open', function(data) {
    console.log("Open data connection with server");

  });

  connection.on('data', function(dataReceived) {
    switch (dataReceived.event) {
      case 'frame':
        console.log(dataReceived.data.name);
        img.elt.src = dataReceived.data.imagedata;
      break;
      
      case 'framesize':
        console.log('size');
        console.log(dataReceived.data);
        setImageSize(dataReceived.data.size);
      break;
     
      case 'clearCanvas':
        console.log('Clear Canvas');
        img.src = " ";
        background(255);
      break;
      
      case 'bodyFrame':
        console.log('Body Frame:');
        bodyTracked(dataReceived.data);
      break;

      case 'floorHeightTracker':
        console.log('Floor Height');
        showHeight(dataReceived.data);
      break;
    }
  });
}

// p5 setup
function setup() {
  canvas = createCanvas();
  canvas.parent("container");
  context = canvas.drawingContext;

  img = createImg(" ");
  img.parent("container");  

  canvas.style("width: " + COLORWIDTH + "; height: " + COLORHEIGHT);
  img.style("width: " + COLORWIDTH + "; height: " + COLORHEIGHT);

  noStroke();
}


function setImageSize(size) {
  if (size == 'color') {
    console.log('resetting color');
    canvas.width = COLORWIDTH;
    canvas.height = COLORHEIGHT;
    canvas.canvas.width = COLORWIDTH;
    canvas.canvas.height = COLORHEIGHT;
    canvas.style("width: " + COLORWIDTH + "; height: " + COLORHEIGHT);
    img.style("width: " + COLORWIDTH + "; height: " + COLORHEIGHT);
  } else if (size == 'depth') {
    console.log('resetting depth');
    canvas.width = DEPTHWIDTH;
    canvas.height = DEPTHHEIGHT;
    canvas.canvas.width = DEPTHWIDTH;
    canvas.canvas.height = DEPTHHEIGHT;
    canvas.style("width: " + DEPTHWIDTH + "; height: " + DEPTHHEIGHT);
    img.style("width: " + DEPTHWIDTH + "; height: " + DEPTHHEIGHT);
  }
}

function showHeight(data) {
  // clear canvas
  background(255);
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
