var mypeerid = null;
var peer = null;
var connection = null;

var canvas = null;
var context = null;
var imageData = null;
var imageDataSize = null;
var imageDataArray = null;

var img = null;

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
        img.src = dataReceived.data.imagedata;
      break;
      
      case 'framesize':
        console.log('size');
        console.log(dataReceived.data);
        setImageSize(dataReceived.data.size);
      break;
     
      case 'clearCanvas':
        console.log('Clear Canvas');
        img.src = " ";
        //context.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
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

window.addEventListener('load', function() {
  //canvas = document.getElementById('outputCanvas');
  //context = canvas.getContext('2d');

  // imageData = context.createImageData(canvas.width, canvas.height);
  // imageDataSize = imageData.data.length;
  // imageDataArray = imageData.data;

   //image = document.getElementById('image');
});

// p5 setup
function setup() {
  canvas = createCanvas(960, 540);
  canvas.parent("container");
  context = canvas.drawingContext;

  img = document.getElementById('img');

  noStroke();
}


function setImageSize(size) {
  if (size == 'color') {
    console.log('resetting color');
    canvas.canvas.width = 960;
    canvas.canvas.height = 540;
    //img.width = 960;
    //img.height = 540;
  } else if (size == 'depth') {
    console.log('resetting depth');
    canvas.canvas.width = 512;
    canvas.canvas.height = 424;
    //img.width = 512;
    //img.height = 424;
  }
}

function showHeight(data) {
  //context.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
  background(255);
  //context.beginPath();
  fill("red");
  //context.arc(data.joint.colorX * canvas.canvas.width, data.joint.colorY * canvas.canvas.height, 10, 0, Math.PI * 2, true);
  ellipse(data.joint.colorX * canvas.canvas.width, data.joint.colorY * canvas.canvas.height, 20, 20);
  
  //context.fill();
  //context.closePath();
  textSize(48);
  textFont("sans");
  //context.font = "48px sans";
  text(data.distance.toFixed(2) + "m", 20 + data.joint.colorX * canvas.canvas.width, data.joint.colorY * canvas.canvas.height);
  //context.fillText(data.distance.toFixed(2) + "m", 20 + data.joint.colorX * canvas.canvas.width, data.joint.colorY * canvas.canvas.height);
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
