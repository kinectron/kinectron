var mypeerid = null;
var peer = null;
var connection = null;

var canvas = null;
var context = null;

var image = null;

//variables for skeleton
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
var HANDSIZE = 20;
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
        image.src = dataReceived.data.imagedata;
      break;
      
      case 'framesize':
        console.log('size');
        console.log(dataReceived.data);
        setImageSize(dataReceived.data.size);
      break;
     
      case 'clearCanvas':
        console.log('Clear Canvas');
        image.src = " ";
        context.clearRect(0, 0, canvas.width, canvas.height);
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

window.addEventListener('load', function() {
  canvas = document.getElementById('outputCanvas');
  context = canvas.getContext('2d');

  image = document.getElementById('image');
});

function setImageSize(size) {
  if (size == 'color') {
    console.log('resetting large');
    canvas.width = 960;
    canvas.height = 540;
    image.width = 960;
    image.height = 540;
  } else if (size == 'depth') {
    console.log('resetting small');
    canvas.width = 1024;
    canvas.height = 848;
    image.width = 1024;
    image.height = 848;
  }
}

function showHeight(data) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.fillStyle = "red";
  context.arc(data.joint.colorX * canvas.width, data.joint.colorY * canvas.height, 10, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
  context.font = "48px sans";
  context.fillText(data.distance.toFixed(2) + "m", 20 + data.joint.colorX * canvas.width, data.joint.colorY * canvas.height);
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
  // draw semi transparent hand cicles
  var handData = {depthX: jointPoint.depthX, depthY: jointPoint.depthY, handColor: handColor, handSize: HANDSIZE};
  context.globalAlpha = 0.75;
  context.beginPath();
  context.fillStyle = handColor;
  context.arc(jointPoint.depthX * canvas.width, jointPoint.depthY * canvas.height, HANDSIZE, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
  context.globalAlpha = 1;
}


function bodyTracked(body) {
  // clear canvas each time
  context.clearRect(0, 0, canvas.width, canvas.height);
  for(var jointType in body.joints) {
    var joint = body.joints[jointType];
    context.fillStyle = colors[index];
    context.fillRect(joint.depthX * canvas.width, joint.depthY * canvas.height, 10, 10);
    var skeletonJointData = {color: colors[index], depthX: joint.depthX, depthY: joint.depthY};

  }
  // draw hand states
  // 7 is left hand in Kinect2
  updateHandState(body.leftHandState, body.joints[7]);
  // 11 is right hand in Kinect2
  updateHandState(body.rightHandState, body.joints[11]);
}
