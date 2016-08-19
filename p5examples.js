var Kinect2 = require('kinect2');
var kinect = new Kinect2();

//  Create local peer server
var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9001, path: '/'});

// Set peer credentials for localhost by default
var peerNet = {host: 'localhost', port: 9001, path: '/'};
var myPeerId = 'kinectron';
var peer_ids = [];
var peer_connections = [];
var peer = null;
var peerIdDisplay = null;
var newPeerEntry = false;
var newPeerInfo;

var canvas = null;
var context = null;
var canvasState = null;

var outputCanvas = null;
var outputContext = null;

var COLORWIDTH = 1920;
var COLORHEIGHT = 1080;

var DEPTHWIDTH = 512;
var DEPTHHEIGHT = 424;

var outputColorW = 960;
var outputColorH = 540;

var outputDepthW = 512;
var outputDepthH = 424;

var imageData = null;
var imageDataSize = null;
var imageDataArray = null;

var busy = false;
var currentCamera = null;

// Key Tracking needs cleanup
var trackedBodyIndex = -1;

// Skeleton variables
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
var HANDSIZE = 20;
var HANDCLOSEDCOLOR = 'red';
var HANDOPENCOLOR = 'green';
var HANDLASSOCOLOR = 'blue';

window.addEventListener('load', initpeer);
window.addEventListener('load', init);

function chooseCamera(camera) {
  if (currentCamera) {
    console.log('stopping');
    console.log(currentCamera);
    changeCameraState(currentCamera, 'stop');
  }

  if (currentCamera == camera || camera == 'stop-all') {
    console.log('resetting');
    console.log(currentCamera);
    currentCamera = null;
    return;
  }

  console.log('starting');
  console.log(currentCamera);
  changeCameraState(camera, 'start');
  currentCamera = camera;
}


function changeCameraState(camera, state) {
  var cameraCode;
  var changeStateFunction;

  switch (camera) {
    case 'rgb':
      cameraCode = 'RGB';  
    break;

    case 'depth':
      cameraCode = 'Depth';
    break;

    case 'key':
      cameraCode = 'Key';
    break;

    case 'infrared': 
      cameraCode = 'Infrared';
    break;

    case 'le-infrared':
      cameraCode = 'LEInfrared';
    break;

    case 'fh-joint':
      cameraCode = 'FHJoint';
    break;

    case 'scale':
      cameraCode = 'ScaleUser';
    break;

    case 'skeleton':
      cameraCode = 'SkeletonTracking';
    break;
  }

  changeStateFunction = window[state + cameraCode];
  changeStateFunction();    
}



function init() {
  canvas = document.getElementById('inputCanvas');
  context = canvas.getContext('2d');

  outputCanvas = document.getElementById('outputCanvas');
  outputContext = outputCanvas.getContext('2d');

  setImageData();

  peerIdDisplay = document.getElementById('peerid');

  document.getElementById('peersubmit').addEventListener('click', newPeerServer);
  document.getElementById('loadfile').addEventListener('change', loadFile);
  document.getElementById('colorwidth').addEventListener('change', updateDimFields);
  document.getElementById('colorheight').addEventListener('change', updateDimFields);
  document.getElementById('depthwidth').addEventListener('change', updateDimFields);
  document.getElementById('depthheight').addEventListener('change', updateDimFields);
  document.getElementById('colorsubmit').addEventListener('click', setOutputDimensions);
  document.getElementById('depthsubmit').addEventListener('click', setOutputDimensions);
  document.getElementById('rgb').addEventListener('click', function() {chooseCamera('rgb')});
  document.getElementById('depth').addEventListener('click', function() {chooseCamera('depth')});
  document.getElementById('key').addEventListener('click', function() {chooseCamera('key')});
  document.getElementById('infrared').addEventListener('click', function() {chooseCamera('infrared')});
  document.getElementById('le-infrared').addEventListener('click', function() {chooseCamera('le-infrared')});
  document.getElementById('fh-joint').addEventListener('click', function() {chooseCamera('fh-joint')});
  document.getElementById('scale').addEventListener('click', function() {chooseCamera('scale')});
  document.getElementById('skeleton').addEventListener('click', function() {chooseCamera('skeleton')});
  document.getElementById('stop-all').addEventListener('click', function() {
    chooseCamera('stop-all')});
}

function initpeer() {
    peer = new Peer(myPeerId, peerNet);
    peer.on('error',function(err) {
      console.log(err);
    });

    peer.on('open', function(id) {
      myPeerId = id;
      peerIdDisplay.innerHTML = myPeerId;
      document.getElementById('port').innerHTML = peer.options.port;
      document.getElementById('connectionopen').style.display = 'block';
  });

  peer.on('connection', function(conn) {
    connection = conn;
    console.log("Got a new data connection from peer: " + connection.peer);
    peer_connections.push(connection);

    connection.on('open', function() {
      console.log("Connection opened.");
      sendToPeer('ready', {});
    });
    connection.on('data', function(data) {
      console.log("Data Received: " + data);
    });

    connection.on('data', function(dataReceived) {
      console.log("data received 2");
      if (dataReceived.event == 'initfeed') {
        console.log(dataReceived.data.feed);

        if (dataReceived.data.feed) {
          console.log('yes got feed');
          chooseCamera(dataReceived.data.feed);
        } else {
          console.log('no feed not setting one');
        }
      } else if (dataReceived.event == 'feed') {
        chooseCamera(dataReceived.data.feed);
      }
    });

  });

  peer.on('close', function() {
    console.log('closed');

    // Only create new peer if old peer destroyed and new peer requested
    if (newPeerEntry) {
      peer = null;
      initpeer();
      newPeerEntry = false;
    }
  });
}


function newPeerServer(evt) {
  console.log('newpeerserver');
  newPeerEntry = true;
  evt.preventDefault();
  myPeerId = document.getElementById('newpeerid').value;
  var peerNetTemp = document.getElementById('peernet').value;
  peerNet = JSON.parse(peerNetTemp);

  // Distroy default peer before creating new one
  peer.disconnect();
  peer.destroy();

}

function sendToPeer(evt, data) {
  var dataToSend = {"event": evt, "data": data};
  peer_connections.forEach(function(connection) {
    connection.send(dataToSend);
  });
}

function updateDimFields(evt) {
  var element = evt.srcElement;
  var elementId = element.id;
  var size = element.value;
  var targetElement = null;
  
  evt.preventDefault();

  switch (elementId) {
    case 'colorwidth':
      targetElement = document.getElementById('colorheight');
      targetElement.value = (1080 * size) / 1920;
    break;

    case 'colorheight': 
      targetElement = document.getElementById('colorwidth');
      targetElement.value = (1920 * size) / 1080;
    break;

    case 'depthwidth':
      targetElement = document.getElementById('depthheight');
      targetElement.value = (424 * size) / 512;
    break;

    case 'depthheight':
      targetElement = document.getElementById('depthwidth');
      targetElement.value = (512 * size) / 424;
    break;
  }
}

function setOutputDimensions(evt) {
  var element = evt.srcElement;
  var elementId = element.id;
  
  evt.preventDefault();

  switch (elementId) {
    case 'colorsubmit':
      outputColorW = document.getElementById('colorwidth').value;
      outputColorH = document.getElementById('colorheight').value;

      if (canvasState == 'color' || canvasState === null) {
        resetCanvas('color');
      }
      console.log(outputColorW, outputColorH);
    break;

    case 'depthsubmit':
      outputDepthW = document.getElementById('depthwidth').value;
      outputDepthH = document.getElementById('depthheight').value;
      if (canvasState == 'depth' || canvasState === null) {
        resetCanvas('depth');
      }
        console.log(outputDepthW, outputDepthH);
    break;
  }
}



function startKey() {
  console.log('starting key');

  resetCanvas('color');
  canvasState = 'color';
  setImageData();

  if(kinect.open()) {
      kinect.on('multiSourceFrame', function(frame) {

        if(busy) {
          return;
        }
        busy = true;

        var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
        if(closestBodyIndex !== trackedBodyIndex) {
          if(closestBodyIndex > -1) {
            kinect.trackPixelsForBodyIndices([closestBodyIndex]);
          } else {
            kinect.trackPixelsForBodyIndices(false);
          }
        }
        else {
          if (closestBodyIndex > -1) {
            if (frame.bodyIndexColor.bodies[closestBodyIndex].buffer) {

              newPixelData = frame.bodyIndexColor.bodies[closestBodyIndex].buffer;

              for (var i = 0; i < imageDataSize; i++) {
                imageDataArray[i] = newPixelData[i];
              }

              drawAndSendImage('key', 'png');
            }
          }
        }
        trackedBodyIndex = closestBodyIndex;
        busy = false;

      }); // kinect.on
    } // open
      kinect.openMultiSourceReader({
        frameTypes: Kinect2.FrameType.bodyIndexColor | Kinect2.FrameType.body
      });
}

function stopKey() {
  kinect.closeMultiSourceReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startTracking() {
      if (kinect.open()) {
         //listen for body frames
          kinect.on('bodyFrame', function(bodyFrame){
            sendToPeer('bodyFrame',bodyFrame);
              // for (var i = 0;  i < bodyFrame.bodies.length; i++) {
              //      if (bodyFrame.bodies[i].tracked) {
              //        console.log("Tracked");
              //        sendToPeer('bodyFrame',bodyFrame);
              //        console.log(bodyFrame);
              //      }
              // }
          });

          //request body frames
          kinect.openBodyReader();
      }
}

function stopTracking() {
  kinect.close();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startRGB() {

  resetCanvas('color');
  canvasState = 'color';
  setImageData();

  if(kinect.open()) {
    kinect.on('colorFrame', function(newPixelData){

      if(busy) {
        return;
      }
      busy = true;

      for (var i = 0; i < imageDataSize; i++) {
        imageDataArray[i] = newPixelData[i];
      }

      drawAndSendImage('color', 'jpeg');
      busy = false;

    });
  }
  kinect.openColorReader();

}

function stopRGB() {
  kinect.closeColorReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startDepth() {
  console.log("start Depth Camera");

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();

  if(kinect.open()) {
    kinect.on('depthFrame', function(newPixelData){
            if(busy) {
              return;
            }
            busy = true;

            newPixelDataIndex = 0;
            for (var i = 0; i < imageDataSize; i+=4) {
              imageDataArray[i] = newPixelData[newPixelDataIndex];
              imageDataArray[i+1] = newPixelData[newPixelDataIndex];
              imageDataArray[i+2] = newPixelData[newPixelDataIndex];
              imageDataArray[i+3] = newPixelData[newPixelDataIndex];
              newPixelDataIndex++;
            }

            drawAndSendImage('depth', 'png');
            busy = false;
          });
        }
  kinect.openDepthReader();
}

function stopDepth() {
  kinect.closeDepthReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startInfrared() {
  console.log('starting Infrared Camera');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();
     
  if(kinect.open()) {
    kinect.on('infraredFrame', function(imageBuffer){
      
      if(busy) {
        return;
      }
      busy = true;

      var pixelArray = imageData.data;
      var newPixelData = new Uint8Array(imageBuffer);
      var depthPixelIndex = 0;

      for (var i = 0; i < imageDataSize; i+=4) {
        pixelArray[i] = newPixelData[depthPixelIndex];
        pixelArray[i+1] = newPixelData[depthPixelIndex];
        pixelArray[i+2] = newPixelData[depthPixelIndex];
        pixelArray[i+3] = 0xff;
        depthPixelIndex++;
      }

      drawAndSendImage('infrared', 'jpeg');
      busy = false;
    });
  }

  kinect.openInfraredReader();

}

function stopInfrared() {
  console.log('stopping Infrared Camera');
  kinect.closeInfraredReader();
  kinect.removeAllListeners();  
  canvasState = null;
  busy = false;
}

function startLEInfrared() {
  console.log('starting LE Infrared');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();


  if(kinect.open()) {
    kinect.on('longExposureInfraredFrame', function(imageBuffer){
      if(busy) {
        return;
      }
      busy = true;
      
      var pixelArray = imageData.data;
      var newPixelData = new Uint8Array(imageBuffer);
      var depthPixelIndex = 0;
      for (var i = 0; i < imageDataSize; i+=4) {
        pixelArray[i] = newPixelData[depthPixelIndex];
        pixelArray[i+1] = newPixelData[depthPixelIndex];
        pixelArray[i+2] = newPixelData[depthPixelIndex];
        pixelArray[i+3] = 0xff;
        depthPixelIndex++;
      }
      
      drawAndSendImage('LEinfrared', 'jpeg');

      busy = false;
    });

  }

  kinect.openLongExposureInfraredReader();
}

function stopLEInfrared() {
  console.log('stopping LE Infrared');
  kinect.closeLongExposureInfraredReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startFHJoint() {

  resetCanvas('color');
  canvasState = 'color';
  setImageData();
  
  trackedBodyIndex = -1;

  if(kinect.open()) {
    kinect.on('multiSourceFrame', function(frame){

      if(busy) {
        return;
      }
      busy = true;
    
      // draw color image to canvas          
      var newPixelData = frame.color.buffer;
      for (var i = 0; i < imageDataSize; i++) {
        imageDataArray[i] = newPixelData[i];
      }

      //drawAndSendImage('fhcolor', 'jpeg');
  
      // get closest body
      var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
      if(closestBodyIndex !== trackedBodyIndex) {
        if(closestBodyIndex > -1) {
          kinect.trackPixelsForBodyIndices([closestBodyIndex]);
        } else {
          kinect.trackPixelsForBodyIndices(false);
        }
      }
      else {
        if(closestBodyIndex > -1) {
          //measure distance from floor
          if(frame.body.floorClipPlane)
          {
            //get position of left hand
            var joint = frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.handLeft];

            //https://social.msdn.microsoft.com/Forums/en-US/594cf9ed-3fa6-4700-872c-68054cac5bf0/angle-of-kinect-device-and-effect-on-xyz-positional-data?forum=kinectv2sdk
            var cameraAngleRadians= Math.atan(frame.body.floorClipPlane.z / frame.body.floorClipPlane.y);
            var cosCameraAngle = Math.cos(cameraAngleRadians);
            var sinCameraAngle = Math.sin(cameraAngleRadians);
            var yprime = joint.cameraY * cosCameraAngle + joint.cameraZ * sinCameraAngle;
            var jointDistanceFromFloor = frame.body.floorClipPlane.w + yprime;

            //show height in canvas
            showHeight(context, joint, jointDistanceFromFloor);
            showHeight(outputContext, joint, jointDistanceFromFloor);

            //send height data to remote
            var jointDataToSend = {joint: joint, distance: jointDistanceFromFloor};

            sendToPeer('floorHeightTracker', jointDataToSend);
          }
        }
      }

      trackedBodyIndex = closestBodyIndex;
      busy = false;
    });

    kinect.openMultiSourceReader({
      frameTypes: Kinect2.FrameType.body | Kinect2.FrameType.color
    });
  }
}

function stopFHJoint() {
  console.log('stopping FHJoint');
  kinect.closeMultiSourceReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startScaleUser() {
  console.log('start scale user');

  resetCanvas('color');
  canvasState = 'color';
  setImageData();

  trackedBodyIndex = -1;

  if(kinect.open()) {
  kinect.on('multiSourceFrame', function(frame){
    var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
    if(closestBodyIndex !== trackedBodyIndex) {
      if(closestBodyIndex > -1) {
        kinect.trackPixelsForBodyIndices([closestBodyIndex]);
      } else {
        kinect.trackPixelsForBodyIndices(false);
      }
    }
    else {
      if(closestBodyIndex > -1) {
        //get body ground position - when use jumps this point stays on the ground
        if(frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].floorColorY)
        {
          //calculate the source rectangle
          var leftJoint = frame.body.bodies[closestBodyIndex].joints[0],
              topJoint = frame.body.bodies[closestBodyIndex].joints[0],
              rightJoint = frame.body.bodies[closestBodyIndex].joints[0];
          for(var i = 1; i < frame.body.bodies[closestBodyIndex].joints.length; i++) {
            var joint = frame.body.bodies[closestBodyIndex].joints[i];
            if(joint.colorX < leftJoint.colorX) {
              leftJoint = joint;
            }
            if(joint.colorX > rightJoint.colorX) {
              rightJoint = joint;
            }
            if(joint.colorY < topJoint.colorY) {
              topJoint = joint;
            }
          }

          var pixelWidth = calculatePixelWidth(frame.bodyIndexColor.horizontalFieldOfView, frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].cameraZ * 1000);
          scale = 0.3 * pixelWidth;

          //head joint is in middle of head, add area (y-distance from neck to head joint) above
          topJoint = {
            colorX: topJoint.colorX,
            colorY: Math.min(topJoint.colorY, frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.head].colorY - (frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.neck].colorY - frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.head].colorY))
          };
          var srcRect = {
            x: leftJoint.colorX * canvas.width,
            y: topJoint.colorY * canvas.height,
            width: (rightJoint.colorX - leftJoint.colorX) * canvas.width,
            height: (frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].floorColorY - topJoint.colorY) * canvas.height
          };
          var dstRect = {
            x: outputCanvas.width * 0.5,
            y: outputCanvas.height - (srcRect.height * scale),
            width: srcRect.width * scale,
            height: srcRect.height * scale
          };
          //center the user horizontally - is not minus half width of image as user might reach to one side or the other
          //do minus the space on the left size of the spine
          var spaceLeft = frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].colorX - leftJoint.colorX;
          dstRect.x -= (spaceLeft * canvas.width * scale);
          
          newPixelData = frame.bodyIndexColor.bodies[closestBodyIndex].buffer;

          for (var i = 0; i < imageDataSize; i++) {
            imageDataArray[i] = newPixelData[i];
          }
          
          drawAndSendImage('scaleuser', 'png');
          }
      }
    }

    trackedBodyIndex = closestBodyIndex;
  });

  //include the projected floor positions - we want to keep the floor on the bottom, not crop out the user in the middle of a jump
  kinect.openMultiSourceReader({
    frameTypes: Kinect2.FrameType.body | Kinect2.FrameType.bodyIndexColor,
    includeJointFloorData: true
  });
}
}

function stopScaleUser() {
  console.log('stop scale user');
  kinect.closeMultiSourceReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}      

function startSkeletonTracking() {
  console.log('starting skeleton');
  
  resetCanvas('depth');
  canvasState = 'depth';

  if(kinect.open()) {
    kinect.on('bodyFrame', function(bodyFrame){

      context.clearRect(0, 0, canvas.width, canvas.height);
      outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
      var index = 0;
      bodyFrame.bodies.forEach(function(body){
        if(body.tracked) {
          sendToPeer('bodyFrame', body);
          for(var jointType in body.joints) {
            var joint = body.joints[jointType];
            context.fillStyle = colors[index];
            context.fillRect(joint.depthX * canvas.width, joint.depthY * canvas.height, 10, 10);
            outputContext.fillStyle = colors[index];
            outputContext.fillRect(joint.depthX * outputCanvas.width, joint.depthY * outputCanvas.height, 10, 10);
          }
          //draw hand states
          updateHandState(context, body.leftHandState, body.joints[Kinect2.JointType.handLeft]);
          updateHandState(outputContext, body.leftHandState, body.joints[Kinect2.JointType.handLeft]);
          updateHandState(context, body.rightHandState, body.joints[Kinect2.JointType.handRight]);
          updateHandState(outputContext, body.rightHandState, body.joints[Kinect2.JointType.handRight]);

          index++;

        }
      });
    });
    kinect.openBodyReader();
      }

}

function stopSkeletonTracking() {
  console.log('stopping skeleton');
  kinect.closeBodyReader();
  kinect.removeAllListeners();
  canvasState = null;

}

function loadFile(e) {
  window.location.href = e.target.files[0].path;
}

function setImageData() {
  imageData = context.createImageData(canvas.width, canvas.height);
  imageDataSize = imageData.data.length;
  imageDataArray = imageData.data;
}

function resetCanvas(size) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  
  if (size == 'depth') {
    canvas.width = DEPTHWIDTH;
    canvas.height = DEPTHHEIGHT;
    outputCanvas.width = outputDepthW;
    outputCanvas.height = outputDepthH;
  } else if (size == 'color') {
    canvas.width = COLORWIDTH;
    canvas.height = COLORHEIGHT; 
    outputCanvas.width = outputColorW;
    outputCanvas.height = outputColorH;
  }
}
    
function drawAndSendImage(frameType, imageType) {
  var outputCanvasData;
  var dataToSend;

  context.putImageData(imageData, 0, 0);
  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  outputContext.drawImage(canvas, 0, 0, outputCanvas.width, outputCanvas.height);
  outputCanvasData = outputCanvas.toDataURL("image/" + imageType, 0.5);
  dataToSend = {'name': frameType, 'imagedata': outputCanvasData};

  sendToPeer('frame', dataToSend);
}

function getClosestBodyIndex(bodies) {
  var closestZ = Number.MAX_VALUE;
  var closestBodyIndex = -1;
  for(var i = 0; i < bodies.length; i++) {
    if(bodies[i].tracked && bodies[i].joints[Kinect2.JointType.spineMid].cameraZ < closestZ) {
      closestZ = bodies[i].joints[Kinect2.JointType.spineMid].cameraZ;
      closestBodyIndex = i;
    }
  }
  return closestBodyIndex;
}

function calculateLength(joints) {
  var length = 0;
  var numJoints = joints.length;
  for(var i = 1; i < numJoints; i++) {
    length += Math.sqrt(Math.pow(joints[i].colorX - joints[i-1].colorX, 2) + Math.pow(joints[i].colorY - joints[i-1].colorY, 2));
  }
  return length;
}

function calculatePixelWidth(horizontalFieldOfView, depth)
{
  // measure the size of the pixel
  var hFov = horizontalFieldOfView / 2;
  var numPixels = canvas.width / 2;
  var T = Math.tan((Math.PI * 180) / hFov);
  var pixelWidth = T * depth;
  return pixelWidth / numPixels;
}

function showHeight(context, joint, jointDistance) {
  context.beginPath();
  context.fillStyle = 'red';
  context.arc(joint.colorX * context.canvas.width, joint.colorY * context.canvas.height, 10, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
  context.font = '48px sans';
  context.fillText(jointDistance.toFixed(2) + 'm', 20 + joint.colorX * context.canvas.width, joint.colorY * context.canvas.height);
}

function updateHandState(context, handState, jointPoint) {
  switch (handState) {
    case Kinect2.HandState.closed:
      drawHand(context, jointPoint, HANDCLOSEDCOLOR);
    break;

    case Kinect2.HandState.open:
      drawHand(context, jointPoint, HANDOPENCOLOR);
    break;

    case Kinect2.HandState.lasso:
      drawHand(context, jointPoint, HANDLASSOCOLOR);
    break;
  }
}

function drawHand(context, jointPoint, handColor) {
  // draw semi transparent hand cicles
  var handData = {depthX: jointPoint.depthX, depthY: jointPoint.depthY, handColor: handColor, handSize: HANDSIZE};
  //sendToPeer('drawHand', handData);
  context.globalAlpha = 0.75;
  context.beginPath();
  context.fillStyle = handColor;
  context.arc(jointPoint.depthX * 512, jointPoint.depthY * 424, HANDSIZE, 0, Math.PI * 2, true);
  context.fill();
  context.closePath();
  context.globalAlpha = 1;
}


// Get IP Address. Taken from http://net.ipcalf.com/
if (RTCPeerConnection) (function () {
    var rtc = new RTCPeerConnection({iceServers:[]});
    if (1 || window.mozRTCPeerConnection) {      // FF [and now Chrome!] needs a channel/stream to proceed
        rtc.createDataChannel('', {reliable:false});
    }
    
    rtc.onicecandidate = function (evt) {
        // convert the candidate to SDP so we can run it through our general parser
        // see https://twitter.com/lancestout/status/525796175425720320 for details
        if (evt.candidate) grepSDP("a="+evt.candidate.candidate);
    };
    rtc.createOffer(function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
    }, function (e) { console.warn("offer failed", e); });
    
    
    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;
    function updateDisplay(newAddr) {
        if (newAddr in addrs) return;
        else addrs[newAddr] = true;
        var ips = Object.getOwnPropertyNames(addrs).sort();

        // find local ip address
        for (i = 0; i < ips.length; i++) {
          if (ips[i].includes('192')) {
            var displayAddrs = ips[i];
          }
          
        }
        //var displayAddrs = Object.keys(addrs).filter(function (k) { return addrs[k]; });
        document.getElementById('ipaddress').textContent = displayAddrs;
    }
    
    function grepSDP(sdp) {
        var hosts = [];
        sdp.split('\r\n').forEach(function (line) { // c.f. http://tools.ietf.org/html/rfc4566#page-39
            if (~line.indexOf("a=candidate")) {     // http://tools.ietf.org/html/rfc4566#section-5.13
                var parts = line.split(' '),        // http://tools.ietf.org/html/rfc5245#section-15.1
                    addr = parts[4],
                    type = parts[7];
                if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf("c=")) {       // http://tools.ietf.org/html/rfc4566#section-5.7
                var parts = line.split(' '),
                    addr = parts[2];
                updateDisplay(addr);
            }
        });
    }
})(); else {
    document.getElementById('ipaddress').innerHTML = "<code>ifconfig | grep inet | grep -v inet6 | cut -d\" \" -f2 | tail -n1</code>";
    document.getElementById('ipaddress').nextSibling.textContent = "In Chrome and Firefox your IP should display automatically, by the power of WebRTCskull.";
}