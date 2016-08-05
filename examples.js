var Kinect2 = require('kinect2');
var kinect = new Kinect2();

var mypeerid = null;
var peer = null;
var peer_ids = [];
var peer_connections = [];
var peerIdDisplay = null;

var canvas = null;
var context = null;

var outputCanvas = null;
var outputContext = null;

var COLORWIDTH = 1920;
var COLORHEIGHT = 1080;

var DEPTHWIDTH = 512;
var DEPTHHEIGHT = 424;

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
    return
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

  document.getElementById('loadfile').addEventListener('change', loadFile);
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
    peer = new Peer('l',{host: 'liveweb.itp.io', port: 9000, path: '/', secure: true});

    peer.on('error',function(err) {
      console.log(err);
    });

    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
      mypeerid = id;
      peerIdDisplay.innerHTML = mypeerid;
  });

  peer.on('connection', function(conn) {
    connection = conn;
    console.log("Got a new data connection from peer: " + connection.peer);
    peer_connections.push(connection);

    connection.on('open', function() {
      console.log("Connection opened.");
    });
    connection.on('data', function(data) {
      console.log("Data Received: " + data);
    });
  });
}

function sendToPeer(evt, data) {
  var dataToSend = {"event": evt, "data": data};
  peer_connections.forEach(function(connection) {
    connection.send(dataToSend);
  });
}

function startKey() {
  console.log('starting key');

  resetCanvas('color')
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

              newPixelData = frame.bodyIndexColor.bodies[closestBodyIndex].buffer

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
  busy = false;
}

function startRGB() {

  resetCanvas('color');
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
  busy = false;
}

function startDepth() {
  console.log("start Depth Camera");

  resetCanvas('depth');
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
  busy = false;
}

function startInfrared() {
  console.log('starting Infrared Camera');

  resetCanvas('depth');
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
  busy = false;
}

function startLEInfrared() {
  console.log('starting LE Infrared');

  resetCanvas('depth');
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
  busy = false;
}

function startFHJoint() {

  resetCanvas('color');
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

      drawAndSendImage('fhcolor', 'jpeg');
  
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
  busy = false;
}

function startScaleUser() {
  console.log('start scale user');

  resetCanvas('color');
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
  busy = false;
}      

function startSkeletonTracking() {
  console.log('starting skeleton');
  
  resetCanvas('depth');

  if(kinect.open()) {
    kinect.on('bodyFrame', function(bodyFrame){

      context.clearRect(0, 0, canvas.width, canvas.height);
      outputContext.clearRect(0, 0, canvas.width, canvas.height);
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
  //sendToPeer('clearCanvas', {});
  
  if (size == 'depth') {
    canvas.width = DEPTHWIDTH;
    canvas.height = DEPTHHEIGHT;
    outputCanvas.width = DEPTHWIDTH;
    outputCanvas.height = DEPTHHEIGHT;
    sendToPeer('framesize', {'size': 'depth'});
  } else if (size == 'color') {
    canvas.width = COLORWIDTH;
    canvas.height = COLORHEIGHT; 
    outputCanvas.width = COLORWIDTH;
    outputCanvas.height = COLORHEIGHT;
    sendToPeer('framesize', {'size': 'color'});
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