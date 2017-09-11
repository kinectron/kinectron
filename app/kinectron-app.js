var os = require('os');

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

var COLORWIDTH = 1920;
var COLORHEIGHT = 1080;

var DEPTHWIDTH = 512;
var DEPTHHEIGHT = 424; 

var RAWWIDTH = 512;
var RAWHEIGHT = 424;

var imageData = null;
var imageDataSize = null;
var imageDataArray = null;

var busy = false;
var currentCamera = null;

var sendAllBodies = false;

var multiFrame = false;
var currentFrames = null;
var sentTime = Date.now();

var rawDepth = false;
var blockAPI = false;

// Key Tracking needs cleanup
var trackedBodyIndex = -1;

// Record variables
const recordingLocation = os.homedir() + "/kinectron-recordings/";
var doRecord = false;
var recordStartTime = 0;
var bodyChunks = [];
var mediaRecorders = [];

window.addEventListener('load', initpeer);
window.addEventListener('load', init);


function init() {
  var ipAddresses;
  var allIpAddresses;

  ipAddresses = getIpAddress();
  allIpAddresses = ipAddresses.join(", ");
  document.getElementById('ipaddress').innerHTML = allIpAddresses;

  peerIdDisplay = document.getElementById('peerid');

  canvas = document.getElementById('inputCanvas');
  context = canvas.getContext('2d');

  setImageData();

  document.getElementById('peersubmit').addEventListener('click', newPeerServer);
  //document.getElementById('loadfile').addEventListener('change', loadFile);
  document.getElementById('single-frame-btn').addEventListener('click', toggleFrameType);
  document.getElementById('multi-frame-btn').addEventListener('click', toggleFrameType);
  document.getElementById('colorwidth').addEventListener('change', updateDimFields);
  document.getElementById('colorheight').addEventListener('change', updateDimFields);
  document.getElementById('depthwidth').addEventListener('change', updateDimFields);
  document.getElementById('depthheight').addEventListener('change', updateDimFields);
  document.getElementById('colorsubmit').addEventListener('click', setOutputDimensions);
  document.getElementById('depthsubmit').addEventListener('click', setOutputDimensions);
  document.getElementById('color').addEventListener('click', chooseCamera);
  document.getElementById('depth').addEventListener('click', chooseCamera);
  document.getElementById('raw-depth').addEventListener('click', chooseCamera);
  document.getElementById('infrared').addEventListener('click', chooseCamera);
  document.getElementById('le-infrared').addEventListener('click', chooseCamera);
  document.getElementById('key').addEventListener('click', chooseCamera);
  //document.getElementById('fh-joint').addEventListener('click', chooseCamera);
  //document.getElementById('scale').addEventListener('click', chooseCamera);
  document.getElementById('body').addEventListener('click', chooseCamera);  
  document.getElementById('skeleton').addEventListener('click', chooseCamera);
  document.getElementById('stop-all').addEventListener('click', chooseCamera);
  document.getElementById('multi').addEventListener('click', chooseMulti);
  document.getElementById('stop-multi').addEventListener('click', stopMulti);
  document.getElementById('advanced-link').addEventListener('click', toggleAdvancedOptions);
  document.getElementById('record').addEventListener('click', toggleRecord);
  document.getElementById('api-blocker').addEventListener('click', toggleAPIBlocker);
}

function toggleAPIBlocker(evt) {
  var apiButton = document.getElementById('api-blocker');
  var apiText = document.getElementById('api-blocker-intro');

  if (!blockAPI) {
    apiButton.value = "Allow API Calls";
    apiText.innerHTML = "API Calls Are Blocked";
  } else {
    apiButton.value = "Block API Calls";
    apiText.innerHTML = "API Calls Are Allowed";
  }

  blockAPI = !blockAPI;
}

// Only used for server-side record
function toggleRecord(evt) {
  if (!doRecord) {
    doRecord = true;
  } else {
    doRecord = false;
  }
  record(evt);
}

// Only used for client-iniated record
function startRecord() {
  // if record already running, do nothing
  if (doRecord) return;

  // if not, set do record and run 
  if (!doRecord) {
    doRecord = true;
    record();
  }
}

function stopRecord() {
  // if record already stopped, do nothing 
  if (!doRecord) return;
  // if running, turn record off
  if (doRecord) {
    doRecord = false;
    record();
  }
}

// Toggle Recording
function record(evt) {
  var recordButton = document.getElementById('record');
  var serverSide = false;

  if (evt) {
    evt.preventDefault();
    serverSide = true;
  } 

  console.log(serverSide);

  if (doRecord) {
    // If no frame selected, send alert
    if (multiFrame === false && currentCamera === null) {
      alert("Begin broadcast, then begin recording");
      return;
    }

    var framesToRecord = [];

    if (multiFrame) {
      for (var i = 0; i < currentFrames.length; i++) {
        if (currentFrames[i] == 'body') framesToRecord.push('skeleton');
        else framesToRecord.push(currentFrames[i]);
      }
    } else if (currentCamera == 'body') { 
      framesToRecord.push('skeleton');
    } else {
      framesToRecord.push(currentCamera);
    }

    for (var j = 0; j < framesToRecord.length; j++) {
      mediaRecorders.push(createMediaRecorder(framesToRecord[j], serverSide));
    }
    
    recordStartTime = Date.now();
    //doRecord = true;

    // Toggle record button color and text
    toggleButtonState('record', 'active');
    recordButton.value = "Stop Record";
  } 

  else {
    //doRecord = false;
    toggleButtonState('record', 'inactive');
    recordButton.value = "Start Record";

    // Stop media recorders
    for (var k = mediaRecorders.length - 1; k >= 0; k--) {
      mediaRecorders[k].stop();  
      mediaRecorders.splice(k, 1);
    } 
  }
}

function createMediaRecorder(id, serverSide) {
  var idToRecord = id + "-canvas";
  var newMediaRecorder = new MediaRecorder(document.getElementById(idToRecord).captureStream());
  var mediaChunks = [];

  newMediaRecorder.onstop = function (e) {

    // The video as a blob
    var blob = new Blob(mediaChunks, { 'type' : 'video/webm' });

    // Reset Chunks
    mediaChunks.length = 0;

    // Display the video on the page
    // var videoElement = document.createElement('video');
    // videoElement.setAttribute("id", Date.now());
    // videoElement.controls = true;
    // document.body.appendChild(videoElement);
    // videoElement.src = window.URL.createObjectURL(blob);


    var fs = require('fs');
    try {
        fs.mkdirSync(recordingLocation);
    } catch (evt) {
        if (evt.code != 'EEXIST') throw e;
    }

    // If skeleton data is being tracked, write out the body frames JSON
    if (id == "skeleton") {
      var bodyJSON = JSON.stringify(bodyChunks);
      var filename = recordingLocation + "skeleton" + recordStartTime + ".json";
      fs.writeFile(filename, bodyJSON, "utf8", function() {
        if (serverSide === true) alert("Your file has been saved to " + filename);
      });
      bodyChunks.length = 0;        
    }
    
    // Read the blob as a file
    var reader = new FileReader();
    reader.addEventListener('loadend', function(e) {
      // Create the videoBuffer and write to file
      var videoBuffer = new Buffer(reader.result);

      // Write it out
      var filename = recordingLocation + id + recordStartTime + ".webm";
      fs.writeFile(filename, videoBuffer,  function(err){
        if (err) console.log(err);
        if (serverSide === true) alert("Your file has been saved to " + filename);
      });
    }, false);
    reader.readAsArrayBuffer(blob);

  };

      // When video data is available
  newMediaRecorder.ondataavailable = function(e) {
    mediaChunks.push(e.data);
  };

  // Start recording
  newMediaRecorder.start();
  return newMediaRecorder;
}


function toggleFrameType(evt) {
  evt.preventDefault();
  var button = evt.srcElement;
  var state = button.id;

  if (state == "single-frame-btn") {
    button.style.background = "#1daad8";
    document.getElementById('multi-frame-btn').style.background = "#fff";

    document.getElementById('single-frame').style.display = 'block';
    document.getElementById('multi-frame').style.display = 'none';

  } else if (state == "multi-frame-btn") {
    button.style.background = "#1daad8";
    document.getElementById('single-frame-btn').style.background = "#fff";

    document.getElementById('single-frame').style.display = 'none';
    document.getElementById('multi-frame').style.display = 'block';

  }
}

function toggleAdvancedOptions(evt) {
  evt.preventDefault();

  var advOptions = document.getElementById('advanced-options');
  advOptions.style.display = advOptions.style.display == "block" ? "none" : "block";

  var advLink = document.getElementById('advanced-link');
  var hide = "<a id=\"advanced-link\" href=\"#\">Hide Advanced Options</a>";
  var show = "<a id=\"advanced-link\" href=\"#\">Show Advanced Options</a>";
  advLink.innerHTML = advLink.innerHTML == hide ? show : hide;
}

function getIpAddress() {
  var ifaces = os.networkInterfaces();
  var ipAddresses = [];
    
  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        ipAddresses.push(iface.address);

      } else {
        // this interface has only one ipv4 adress
        ipAddresses.push(iface.address);
      }
      ++alias;
    });
  });

  return ipAddresses;
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
      document.getElementById('newipaddress').innerHTML = peer.options.host;
  });

  peer.on('connection', function(conn) {
    connection = conn;
    console.log("Got a new data connection from peer: " + connection.peer);
    peer_connections.push(connection);

    connection.on('open', function() {
      console.log("Connection opened.");
      sendToPeer('ready', {});
    });

    connection.on('data', function(dataReceived) {
      if (blockAPI == true) return;
        
      switch (dataReceived.event) {
        case 'initfeed':
          if (dataReceived.data.feed) {
            chooseCamera(null, dataReceived.data.feed);
          } 
        break;

        case 'feed':
          chooseCamera(null, dataReceived.data.feed);
        break;

        case 'multi': 
          chooseMulti(null, dataReceived.data);
        break;

        case 'record':
          if (dataReceived.data == 'start') startRecord();
          if (dataReceived.data == 'stop') stopRecord(); 
        break;  
      }
    
    });

  });

  peer.on('close', function() {
    console.log('Peer connection closed');

    // Only create new peer if old peer destroyed and new peer requested
    if (newPeerEntry) {
      peer = null;
      initpeer();
      newPeerEntry = false;
    }
  });
}


function newPeerServer(evt) {
  console.log('Creating new peer server');
  newPeerEntry = true;
  evt.preventDefault();
  myPeerId = document.getElementById('newpeerid').value;
  var peerNetTemp = document.getElementById('peernet').value;
  peerNet = JSON.parse(peerNetTemp);

  // Distroy default peer before creating new one
  peer.disconnect();
  peer.destroy();

  // Show new peer credentials. Hide default ip address
  document.getElementById("connectionopen").style.display = 'none';
  document.getElementById("newpeercreated").style.display = 'block';
}

function sendToPeer(evt, data) {
  var dataToSend = {"event": evt, "data": data};
  peer_connections.forEach(function(connection) {
    connection.send(dataToSend);
  });
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Set Canvas Dimensions ////////////////////

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
  evt.preventDefault();

  var allCanvases = ['color', 'depth', 'raw-depth', 'skeleton', 'infrared', 'le-infrared', 'key'];

  var element = evt.srcElement;
  var elementId = element.id;

  for (var i = 0; i < allCanvases.length; i++) {
    var currentCanvas = document.getElementById(allCanvases[i] + '-canvas');
    var currentCanvasResolution = (currentCanvas.width / currentCanvas.height).toFixed(1);

    switch (elementId) {
      case 'colorsubmit':
        if (currentCanvasResolution == 1.8) {
          currentCanvas.width = document.getElementById('colorwidth').value;
          currentCanvas.height = document.getElementById('colorheight').value;
        }
      break;

      case 'depthsubmit':
        if (currentCanvasResolution == 1.2) {
          currentCanvas.width = document.getElementById('depthwidth').value;
          currentCanvas.height = document.getElementById('depthheight').value;
        }
      break;
    }
  } 
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Feed Choice //////////////////////////////

function chooseCamera(evt, feed) {
  var camera;

  if (evt) {
    evt.preventDefault();
    camera = evt.srcElement.id;
  } else {
    camera = feed;
  }

  // Turn off multiframe if it is running
  if (multiFrame) {
    stopMulti();
  }

  if (currentCamera == camera) {
    return;
  } else if (camera == 'stop-all') {
    if (currentCamera) {
      changeCameraState(currentCamera, 'stop');
      toggleButtonState(currentCamera, 'inactive');
      toggleFeedDiv(currentCamera, "none");

      currentCamera = null;
      return;
    } else {
      return;
    }
  } else {
    if (currentCamera) {
      changeCameraState(currentCamera, 'stop');
      toggleButtonState(currentCamera, 'inactive');
      toggleFeedDiv(currentCamera, "none");

    } 
    changeCameraState(camera, 'start');
    toggleButtonState(camera, 'active');
    toggleFeedDiv(camera, "block");

    currentCamera = camera;
  }
}

function toggleButtonState(buttonId, state) {
  var button = document.getElementById(buttonId);

  if (state == "active") {
    button.style.background = "#1daad8";
  } else if (state == "inactive") {
    button.style.background = "#fff";
  }
}

function toggleFeedDiv(camera, state) {
  var divsToShow = [];
  if (camera == 'multi') {
    for (var i = 0; i < currentFrames.length; i++) {
      if (currentFrames[i] == 'body') divsToShow.push('skeleton');
      else divsToShow.push(currentFrames[i]);
    }
  } else if (camera == 'body') { 
    divsToShow.push('skeleton');
  } else {
    divsToShow.push(camera);
  }

  for (var j = 0; j < divsToShow.length; j ++) {
    var divId = divsToShow[j] + "-div";
    var feedDiv = document.getElementById(divId);

    feedDiv.style.display = state;
  }
}

function changeCameraState(camera, state) {
  var cameraCode;
  var changeStateFunction;

  switch (camera) {
    case 'color':
      cameraCode = 'Color';  
    break;

    case 'depth':
      cameraCode = 'Depth';
    break;

    case 'raw-depth':
      cameraCode = 'RawDepth';
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

    // case 'scale':
    //   cameraCode = 'ScaleUser';
    // break;

    case 'body':
      sendAllBodies = true;
      cameraCode = 'SkeletonTracking';
    break;

    case 'skeleton':
      sendAllBodies = false;
      cameraCode = 'SkeletonTracking';
    break;

    case 'multi':
      cameraCode = 'Multi';
    break;
  }

  changeStateFunction = window[state + cameraCode];
  changeStateFunction();    
}

function chooseMulti(evt, incomingFrames) {
  if (evt) {
    evt.preventDefault();
  }

  // if single feed running, stop the feed
  if (currentCamera) { 
    chooseCamera(null, 'stop-all');
  }
  
  var temp;
  var frames = [];
  var multiFrames =[];
  var result;

  if (incomingFrames) {
    frames = incomingFrames;
  } else {
    //find which feeds are checked
    var allCheckBoxes = document.getElementsByClassName('cb-multi');
    for(var i=0; i < allCheckBoxes.length; i++){
      if(allCheckBoxes[i].checked){
        frames.push(allCheckBoxes[i].value);
      }
    }
  } 

  // if no frames selected, return
  if (frames.length === 0) {
    alert("Select at least one frame.");
    return;
  }

  // Set global frames variable for use in preview message
  currentFrames = frames;

  // TO DO Simplify the case and result per Shawn 
  for (var j = 0; j < frames.length; j++) {
    var frameName;
    var tempName;

    frameName = frames[j];

    switch (frameName) {
      case 'color':
        multiFrames.push(Kinect2.FrameType.color);
      break;

      case 'depth':
         multiFrames.push(Kinect2.FrameType.depth);
      break;

      case 'body':
        multiFrames.push(Kinect2.FrameType.body);
      break;
      
      case 'raw-depth':
        multiFrames.push(Kinect2.FrameType.rawDepth);
      break;

      // case 'bodyIndexColor':
      //   multiFrames.push(Kinect2.FrameType.bodyIndexColor);
      // break;

      // case 'depthColor':
      //   multiFrames.push(Kinect2.FrameType.depthColor);
      // break;

      //infrared is not implemented for multiframe yet
      // case 'infrared': 
      //    multiFrames.push(Kinect2.FrameType.infrared);
      // break;

      // case 'le-infrared':
      //   multiFrames.push(Kinect2.FrameType.longExposureInfrared);
      // break;
    }
  }
 
  result = multiFrames.reduce(function (a, b) { return a | b; });
  toggleFeedDiv('multi', 'block');
  startMulti(result);
}


////////////////////////////////////////////////////////////////////////
//////////////////////////// Kinect2 Frames ////////////////////////////

function startColor() {
  console.log('starting color camera');

  var colorCanvas = document.getElementById('color-canvas');
  var colorContext = colorCanvas.getContext('2d');

  resetCanvas('color');
  canvasState = 'color';
  setImageData();

  if(kinect.open()) {
    kinect.on('colorFrame', function(newPixelData){

      if(busy) {
        return;
      }
      busy = true;

      processColorBuffer(newPixelData);

      drawImageToCanvas(colorCanvas, colorContext, 'color', 'jpeg');
      busy = false;

    });
  }
  kinect.openColorReader();

}

function stopColor() {
  console.log('stopping color camera');
  kinect.closeColorReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startDepth() {
  console.log("start depth camera");

  var depthCanvas = document.getElementById('depth-canvas');
  var depthContext = depthCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();

  if(kinect.open()) {
    kinect.on('depthFrame', function(newPixelData){
      if(busy) {
        return;
      }
      busy = true;

      processDepthBuffer(newPixelData);
      drawImageToCanvas(depthCanvas, depthContext, 'depth', 'jpeg');
      busy = false;
    });
  }
  kinect.openDepthReader();
}

function stopDepth() {
  console.log('stopping depth camera');
  kinect.closeDepthReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startRawDepth() {
  console.log("start Raw Depth Camera");

  var rawDepthCanvas = document.getElementById('raw-depth-canvas');
  var rawDepthContext = rawDepthCanvas.getContext('2d');

  resetCanvas('raw');
  canvasState = 'raw';
  setImageData();

  rawDepth = true;
  if(kinect.open()) {
    kinect.on('rawDepthFrame', function(newPixelData){
      if(busy) {
        return;
      }
      busy = true;
     
      processRawDepthBuffer(newPixelData);
      var rawDepthImg = drawImageToCanvas(rawDepthCanvas, rawDepthContext, 'rawDepth', 'webp', 1);

      // limit raw depth to 25 fps  
      if (Date.now() > sentTime + 40) {
        sendToPeer('rawDepth', rawDepthImg);
      sentTime = Date.now();
      }
      
      busy = false;
    });
  }
  kinect.openRawDepthReader();
}

function stopRawDepth() {
  console.log("stopping raw depth camera");
  kinect.closeRawDepthReader();
  kinect.removeAllListeners();
  canvasState = null;
  rawDepth = false;
  busy = false;
}

function startInfrared() {
  console.log('starting infrared camera');

  var infraredCanvas = document.getElementById('infrared-canvas');
  var infraredContext = infraredCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();
     
  if(kinect.open()) {
    kinect.on('infraredFrame', function(newPixelData){
      
      if(busy) {
        return;
      }
      busy = true;
      
      processDepthBuffer(newPixelData);
      drawImageToCanvas(infraredCanvas, infraredContext, 'infrared', 'jpeg');
      
      busy = false;
    });
  }
  kinect.openInfraredReader();

}

function stopInfrared() {
  console.log('stopping infrared camera');
  kinect.closeInfraredReader();
  kinect.removeAllListeners();  
  canvasState = null;
  busy = false;
}

function startLEInfrared() {
  console.log('starting le-infrared');

  var leInfraredCanvas = document.getElementById('le-infrared-canvas');
  var leInfraredContext = leInfraredCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();


  if(kinect.open()) {
    kinect.on('longExposureInfraredFrame', function(newPixelData){
      if(busy) {
        return;
      } 
      busy = true;
      
      processDepthBuffer(newPixelData);
      drawImageToCanvas(leInfraredCanvas, leInfraredContext, 'LEinfrared', 'jpeg');

      busy = false;
    });

  }

  kinect.openLongExposureInfraredReader();
}

function stopLEInfrared() {
  console.log('stopping le-infrared');
  kinect.closeLongExposureInfraredReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startSkeletonTracking() {
  console.log('starting skeleton');

  var skeletonCanvas = document.getElementById('skeleton-canvas');
  var skeletonContext = skeletonCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';

  if(kinect.open()) {
    kinect.on('bodyFrame', function(bodyFrame){
      if(sendAllBodies) {
        sendToPeer('bodyFrame', bodyFrame);
        if (doRecord) {
          bodyFrame.record_startime = recordStartTime;
          bodyFrame.record_timestamp = Date.now() - recordStartTime;
          bodyChunks.push(bodyFrame);
        }
      }

      skeletonContext.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);
      var index = 0;
      bodyFrame.bodies.forEach(function(body){
        if(body.tracked) {
          if (!sendAllBodies) {
            sendToPeer('trackedBodyFrame', body);
            if (doRecord) {
              body.record_startime = recordStartTime;
              body.record_timestamp = Date.now() - recordStartTime;
              bodyChunks.push(body);
            }
          }

          drawSkeleton(skeletonCanvas, skeletonContext, body, index);
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

function displayCurrentFrames() {
  var allFrameDisplay = document.getElementsByClassName('current-frames');
  
  for (var i = 0; i < allFrameDisplay.length; i++) {
    allFrameDisplay[i].innerHTML = currentFrames;
  }
}

function startMulti(multiFrames) {
  console.log('starting multi');

  var options = {frameTypes: multiFrames};
  var multiToSend = {};

  displayCurrentFrames();

  multiFrame = true;
  if(kinect.open()) {
    kinect.on('multiSourceFrame', function(frame) {
      if(busy) {
        return;
      }
      busy = true;

      var newPixelData;
      var temp;

      if (frame.color) {

        var colorCanvas = document.getElementById('color-canvas');
        var colorContext = colorCanvas.getContext('2d');
        
        resetCanvas('color');
        canvasState = 'color';
        setImageData();

        newPixelData = frame.color.buffer;
        processColorBuffer(newPixelData);
        temp = drawImageToCanvas(colorCanvas, colorContext, null, 'jpeg');
        multiToSend.color = temp;
      }

      if (frame.body) {
        var skeletonCanvas = document.getElementById('skeleton-canvas');
        var skeletonContext = skeletonCanvas.getContext('2d');

        if (doRecord) {
          frame.body.record_startime = recordStartTime;
          frame.body.record_timestamp = Date.now() - recordStartTime;
          bodyChunks.push(frame.body);
        }

        // index used to change colors on draw
        var index = 0;

        // draw tracked bodies
        skeletonContext.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);
        frame.body.bodies.forEach(function(body){
          if(body.tracked) {
            drawSkeleton(skeletonCanvas, skeletonContext, body, index);
            index++;
          }
        });

        multiToSend.body = frame.body.bodies;
      }

      if (frame.depth) {
        var depthCanvas = document.getElementById('depth-canvas');
        var depthContext = depthCanvas.getContext('2d');
        
        resetCanvas('depth');
        canvasState = 'depth';
        setImageData();

        newPixelData = frame.depth.buffer;
        processDepthBuffer(newPixelData);
        temp = drawImageToCanvas(depthCanvas, depthContext, null, 'jpeg');
        multiToSend.depth = temp;
      }

      if (frame.rawDepth) {
        var rawDepthCanvas = document.getElementById('raw-depth-canvas');
        var rawDepthContext = rawDepthCanvas.getContext('2d');

        resetCanvas('raw');
        canvasState = 'raw';
        setImageData();
  
        newPixelData = frame.rawDepth.buffer;
        processRawDepthBuffer(newPixelData);
        temp = drawImageToCanvas(rawDepthCanvas, rawDepthContext, null, 'webp', 1);
        multiToSend.rawDepth = temp;
      }

      // TO DO Integrate into interface  
      // if (frame.depthColor) {
      //   resetCanvas('depth');
      //   canvasState = 'depth';
      //   setImageData();

      //   newPixelData = frame.depthColor.buffer;
      //   processColorBuffer(newPixelData);
      //   temp = drawImageToCanvas(null, 'jpeg');
      //   multiToSend.depthColor = temp;

      // }

      // function drawColorBuffer(imageBuffer) {
      //   if(busy) {
      //     return;
      //   }
      //   busy = true;
      //   var newPixelData = new Uint8Array(imageBuffer);
      //   for (var i = 0; i < imageDataSize; i++) {
      //     imageDataArray[i] = newPixelData[i];
      //   }
      //   context.putImageData(imageData, 0, 0);
      //   busy = false;
      //   // send really low quality image data to prioritize depth data
      //   return canvas.toDataURL("image/jpeg", 0.1);
      // }


      // TO DO Implement depthColor and bodyIndexColor -- RGBD?

      // Used in greenkey  
      // if (frame.bodyIndexColor) { 
      // }

      //Frame rate limiting
      // if (Date.now() > sentTime + 40) {
      //   sendToPeer('multiFrame', multiToSend);
      //   sentTime = Date.now();
      // }
      
      // No Framerate limiting
      sendToPeer('multiFrame', multiToSend);

      busy = false;

    }); // kinect.on
  } // open

      kinect.openMultiSourceReader(options);
}

function stopMulti() {
  if (multiFrame) {
    kinect.closeMultiSourceReader();
    kinect.removeAllListeners();
    toggleFeedDiv('multi', 'none');
    canvasState = null;
    busy = false;
    multiFrame = false;
  }
}

function startKey() {
  console.log('starting key');

  var keyCanvas = document.getElementById('key-canvas');
  var keyContext = keyCanvas.getContext('2d');


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

              drawImageToCanvas(keyCanvas, keyContext, 'key', 'webp');
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
  console.log('stopping key');
  kinect.closeMultiSourceReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}


// function startFHJoint() {

//   resetCanvas('color');
//   canvasState = 'color';
//   setImageData();
  
//   trackedBodyIndex = -1;

//   if(kinect.open()) {
//     kinect.on('multiSourceFrame', function(frame){

//       if(busy) {
//         return;
//       }
//       busy = true;
    
//       // draw color image to canvas          
//       var newPixelData = frame.color.buffer;
//       for (var i = 0; i < imageDataSize; i++) {
//         imageDataArray[i] = newPixelData[i];
//       }

//       //drawImageToCanvas('fhcolor', 'jpeg');
  
//       // get closest body
//       var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
//       if(closestBodyIndex !== trackedBodyIndex) {
//         if(closestBodyIndex > -1) {
//           kinect.trackPixelsForBodyIndices([closestBodyIndex]);
//         } else {
//           kinect.trackPixelsForBodyIndices(false);
//         }
//       }
//       else {
//         if(closestBodyIndex > -1) {
//           //measure distance from floor
//           if(frame.body.floorClipPlane)
//           {
//             //get position of left hand
//             var joint = frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.handLeft];

//             //https://social.msdn.microsoft.com/Forums/en-US/594cf9ed-3fa6-4700-872c-68054cac5bf0/angle-of-kinect-device-and-effect-on-xyz-positional-data?forum=kinectv2sdk
//             var cameraAngleRadians= Math.atan(frame.body.floorClipPlane.z / frame.body.floorClipPlane.y);
//             var cosCameraAngle = Math.cos(cameraAngleRadians);
//             var sinCameraAngle = Math.sin(cameraAngleRadians);
//             var yprime = joint.cameraY * cosCameraAngle + joint.cameraZ * sinCameraAngle;
//             var jointDistanceFromFloor = frame.body.floorClipPlane.w + yprime;

//             //show height in canvas
//             showHeight(context, joint, jointDistanceFromFloor);
//             showHeight(outputContext, joint, jointDistanceFromFloor);

//             //send height data to remote
//             var jointDataToSend = {joint: joint, distance: jointDistanceFromFloor};

//             sendToPeer('floorHeightTracker', jointDataToSend);
//           }
//         }
//       }

//       trackedBodyIndex = closestBodyIndex;
//       busy = false;
//     });

//     kinect.openMultiSourceReader({
//       frameTypes: Kinect2.FrameType.body | Kinect2.FrameType.color
//     });
//   }
// }

// function stopFHJoint() {
//   console.log('stopping FHJoint');
//   kinect.closeMultiSourceReader();
//   kinect.removeAllListeners();
//   canvasState = null;
//   busy = false;
// }

// function startScaleUser() {
//   console.log('start scale user');

//   resetCanvas('color');
//   canvasState = 'color';
//   setImageData();

//   trackedBodyIndex = -1;

//   if(kinect.open()) {
//   kinect.on('multiSourceFrame', function(frame){
//     var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
//     if(closestBodyIndex !== trackedBodyIndex) {
//       if(closestBodyIndex > -1) {
//         kinect.trackPixelsForBodyIndices([closestBodyIndex]);
//       } else {
//         kinect.trackPixelsForBodyIndices(false);
//       }
//     }
//     else {
//       if(closestBodyIndex > -1) {
//         //get body ground position - when use jumps this point stays on the ground
//         if(frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].floorColorY)
//         {
//           //calculate the source rectangle
//           var leftJoint = frame.body.bodies[closestBodyIndex].joints[0],
//               topJoint = frame.body.bodies[closestBodyIndex].joints[0],
//               rightJoint = frame.body.bodies[closestBodyIndex].joints[0];
//           for(var i = 1; i < frame.body.bodies[closestBodyIndex].joints.length; i++) {
//             var joint = frame.body.bodies[closestBodyIndex].joints[i];
//             if(joint.colorX < leftJoint.colorX) {
//               leftJoint = joint;
//             }
//             if(joint.colorX > rightJoint.colorX) {
//               rightJoint = joint;
//             }
//             if(joint.colorY < topJoint.colorY) {
//               topJoint = joint;
//             }
//           }

//           var pixelWidth = calculatePixelWidth(frame.bodyIndexColor.horizontalFieldOfView, frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].cameraZ * 1000);
//           scale = 0.3 * pixelWidth;

//           //head joint is in middle of head, add area (y-distance from neck to head joint) above
//           topJoint = {
//             colorX: topJoint.colorX,
//             colorY: Math.min(topJoint.colorY, frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.head].colorY - (frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.neck].colorY - frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.head].colorY))
//           };
//           var srcRect = {
//             x: leftJoint.colorX * canvas.width,
//             y: topJoint.colorY * canvas.height,
//             width: (rightJoint.colorX - leftJoint.colorX) * canvas.width,
//             height: (frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].floorColorY - topJoint.colorY) * canvas.height
//           };
//           var dstRect = {
//             x: outputCanvas.width * 0.5,
//             y: outputCanvas.height - (srcRect.height * scale),
//             width: srcRect.width * scale,
//             height: srcRect.height * scale
//           };
//           //center the user horizontally - is not minus half width of image as user might reach to one side or the other
//           //do minus the space on the left size of the spine
//           var spaceLeft = frame.body.bodies[closestBodyIndex].joints[Kinect2.JointType.spineMid].colorX - leftJoint.colorX;
//           dstRect.x -= (spaceLeft * canvas.width * scale);
          
//           newPixelData = frame.bodyIndexColor.bodies[closestBodyIndex].buffer;

//           for (var i = 0; i < imageDataSize; i++) {
//             imageDataArray[i] = newPixelData[i];
//           }
          
//           drawImageToCanvas('scaleuser', 'png');
//           }
//       }
//     }

//     trackedBodyIndex = closestBodyIndex;
//   });

//   //include the projected floor positions - we want to keep the floor on the bottom, not crop out the user in the middle of a jump
//   kinect.openMultiSourceReader({
//     frameTypes: Kinect2.FrameType.body | Kinect2.FrameType.bodyIndexColor,
//     includeJointFloorData: true
//   });
// }
// }

// function stopScaleUser() {
//   console.log('stop scale user');
//   kinect.closeMultiSourceReader();
//   kinect.removeAllListeners();
//   canvasState = null;
//   busy = false;
// }      



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
  //outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  switch (size) {
    case 'depth':
      canvas.width = DEPTHWIDTH;
      canvas.height = DEPTHHEIGHT;
      //outputCanvas.width = outputDepthW;
      //outputCanvas.height = outputDepthH;
    break;

    case 'color':
      canvas.width = COLORWIDTH;
      canvas.height = COLORHEIGHT; 
      //outputCanvas.width = outputColorW;
      //outputCanvas.height = outputColorH;
    break;

    case 'raw':
      canvas.width = RAWWIDTH;
      canvas.height = RAWHEIGHT; 
      //outputCanvas.width = OUTPUTRAWW;
      //outputCanvas.height = OUTPUTRAWH;
    break;
  }
}
    
function drawImageToCanvas(inCanvas, inContext, frameType, imageType, quality) {
  var outputCanvasData;
  var imageQuality = 0.5;
  var dataToSend;

  if (typeof quality !=="undefined") imageQuality = quality;

  context.putImageData(imageData, 0, 0);
  inContext.clearRect(0, 0, inCanvas.width, inCanvas.height);
  inContext.drawImage(canvas, 0, 0, inCanvas.width, inCanvas.height);
  outputCanvasData = inCanvas.toDataURL("image/" + imageType, imageQuality);

  if (multiFrame) {
    return outputCanvasData;
  } else if (rawDepth) {
    return outputCanvasData;
  } else {
    packageData(frameType, outputCanvasData);
  }
}

function packageData(frameType, outputCanvasData) {
  dataToSend = {'name': frameType, 'imagedata': outputCanvasData};
  sendToPeer('frame', dataToSend);
}

function processColorBuffer(newPixelData) {
  for (var i = 0; i < imageDataSize; i++) {
    imageDataArray[i] = newPixelData[i];
  } 
}

function processDepthBuffer(newPixelData){
  var j = 0;

  for (var i = 0; i < imageDataSize; i+=4) {
    imageDataArray[i] = newPixelData[j];
    imageDataArray[i+1] = newPixelData[j];
    imageDataArray[i+2] = newPixelData[j];
    imageDataArray[i+3] = 0xff; // set alpha channel at full opacity
    j++;
  }
}

function processRawDepthBuffer(newPixelData) {
  var j = 0;
  for (var i = 0; i < imageDataSize; i+=4) {
    imageDataArray[i] = newPixelData[j];
    imageDataArray[i+1] = newPixelData[j+1];
    imageDataArray[i+2] = 0;
    imageDataArray[i+3] = 0xff;
    j+=2;
  }
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

function calculatePixelWidth(horizontalFieldOfView, depth) {
  // measure the size of the pixel
  var hFov = horizontalFieldOfView / 2;
  var numPixels = canvas.width / 2;
  var T = Math.tan((Math.PI * 180) / hFov);
  var pixelWidth = T * depth;
  return pixelWidth / numPixels;
}

// function showHeight(context, joint, jointDistance) {
//   context.clearRect(0, 0, canvas.width, canvas.height);
//   outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
//   context.beginPath();
//   context.fillStyle = 'red';
//   context.arc(joint.colorX * context.canvas.width, joint.colorY * context.canvas.height, 10, 0, Math.PI * 2, true);
//   context.fill();
//   context.closePath();
//   context.font = '48px sans';
//   context.fillText(jointDistance.toFixed(2) + 'm', 20 + joint.colorX * context.canvas.width, joint.colorY * context.canvas.height);
// }

function drawSkeleton(inCanvas, inContext, body, index) {
  // Skeleton variables
  var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
  //draw joints
  for(var jointType in body.joints) {
    var joint = body.joints[jointType];
    inContext.fillStyle = colors[index];
    inContext.fillRect(joint.depthX * inCanvas.width, joint.depthY * inCanvas.height, 10, 10);
  }
  
  //draw hand states
  updateHandState(inContext, body.leftHandState, body.joints[Kinect2.JointType.handLeft]);
  updateHandState(inContext, body.rightHandState, body.joints[Kinect2.JointType.handRight]);
}

function updateHandState(context, handState, jointPoint) {
  var HANDCLOSEDCOLOR = 'red';
  var HANDOPENCOLOR = 'green';
  var HANDLASSOCOLOR = 'blue';
  
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
  var HANDSIZE = 20;
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