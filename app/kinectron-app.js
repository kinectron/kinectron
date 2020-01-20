const os = require("os");
const Kinect2 = require("kinect2");
const KinectAzure = require("kinect-azure");

const BUTTONINACTIVECLR = "#fff";
const BUTTONACTIVECLR = "#1daad8";

let kinect = null;
let whichKinect = null;
let colorImage, colorCanvas, colorContext;

//  Create local peer server
var PeerServer = require("peer").PeerServer;
var server = PeerServer({ port: 9001, path: "/" });

// Set peer credentials for localhost by default
var peerNet = { host: "localhost", port: 9001, path: "/" };
var myPeerId = "kinectron";
var peer_ids = [];
var peer_connections = [];
var peer = null;
var peerIdDisplay = null;
var newPeerEntry = false;
var newPeerInfo;

var canvas = null;
var context = null;
var canvasState = null;

const WINDOWSCOLORWIDTH = 1920;
const WINDOWSCOLORHEIGHT = 1080;

const WINDOWSDEPTHWIDTH = 512;
const WINDOWSDEPTHHEIGHT = 424;

const WINDOWSRAWWIDTH = 512;
const WINDOWSRAWHEIGHT = 424;

// azure resolutions at
// https://docs.microsoft.com/en-us/azure/kinect-dk/hardware-specification
const AZURECOLORWIDTH = 1280;
const AZURECOLORHEIGHT = 720;

const AZUREDEPTHWIDTH = 640;
const AZUREDEPTHHEIGHT = 576;

const AZURERAWWIDTH = 640 / 2;
const AZURERAWHEIGHT = 576 / 2;

let colorwidth;
let colorheight;

let depthwidth;
let depthheight;

let rawdepthwidth;
let rawdepthheight;

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

var imgQuality = 0.5; // set default image quality

window.addEventListener("load", initpeer);
window.addEventListener("load", init);

function init() {
  var ipAddresses;
  var allIpAddresses;

  console.log("You are running Kinectron Version 0.3.2!");

  ipAddresses = getIpAddress();
  allIpAddresses = ipAddresses.join(", ");
  document.getElementById("ipaddress").innerHTML = allIpAddresses;

  peerIdDisplay = document.getElementById("peerid");

  canvas = document.getElementById("inputCanvas");
  context = canvas.getContext("2d");

  setImageData();
  document
    .getElementById("start-kinect-azure")
    .addEventListener("click", startAzureKinect);
  document
    .getElementById("start-kinect-windows")
    .addEventListener("click", startWindowsKinect);
  document
    .getElementById("peersubmit")
    .addEventListener("click", newPeerServer);
  document
    .getElementById("single-frame-btn")
    .addEventListener("click", toggleFrameType);
  document
    .getElementById("multi-frame-btn")
    .addEventListener("click", toggleFrameType);
  document
    .getElementById("colorwidth")
    .addEventListener("change", updateDimFields);
  document
    .getElementById("colorheight")
    .addEventListener("change", updateDimFields);
  document
    .getElementById("depthwidth")
    .addEventListener("change", updateDimFields);
  document
    .getElementById("depthheight")
    .addEventListener("change", updateDimFields);
  document
    .getElementById("colorsubmit")
    .addEventListener("click", setOutputDimensions);
  document
    .getElementById("depthsubmit")
    .addEventListener("click", setOutputDimensions);
  document.getElementById("color").addEventListener("click", chooseCamera);
  document.getElementById("depth").addEventListener("click", chooseCamera);
  document.getElementById("raw-depth").addEventListener("click", chooseCamera);
  document.getElementById("infrared").addEventListener("click", chooseCamera);
  document
    .getElementById("le-infrared")
    .addEventListener("click", chooseCamera);
  document.getElementById("key").addEventListener("click", chooseCamera);
  document.getElementById("rgbd").addEventListener("click", chooseCamera);
  //document.getElementById('fh-joint').addEventListener('click', chooseCamera);
  //document.getElementById('scale').addEventListener('click', chooseCamera);
  document.getElementById("body").addEventListener("click", chooseCamera);
  document.getElementById("skeleton").addEventListener("click", chooseCamera);
  document.getElementById("stop-all").addEventListener("click", chooseCamera);
  document.getElementById("multi").addEventListener("click", chooseMulti);
  document.getElementById("stop-multi").addEventListener("click", stopMulti);
  document
    .getElementById("advanced-link")
    .addEventListener("click", toggleAdvancedOptions);
  document.getElementById("record").addEventListener("click", toggleRecord);
  document
    .getElementById("api-blocker")
    .addEventListener("click", toggleAPIBlocker);
  document
    .getElementById("imgquality")
    .addEventListener("input", updateImgQuality);
}

function startAzureKinect(evt) {
  kinect = new KinectAzure();

  let kinectType = "azure";
  whichKinect = kinectType;

  initControls(kinectType);
  toggleKinectType(evt, kinectType);
  toggleFrameType(evt, kinectType); // ensure always starts on single frame
  setCanvasDimensions(kinectType);

  // to do: refactor so this global image and canvas is not needed
  initAzureColorImageAndCanvas();
}

function initAzureColorImageAndCanvas() {
  colorImage = document.getElementById("color-img");
  colorImage.style.display = "none";

  colorCanvas = document.getElementById("color-canvas");
  // reduce color image size by 2 for more efficient sending
  colorCanvas.width = colorwidth / 2;
  colorCanvas.height = colorheight / 2;
  colorContext = colorCanvas.getContext("2d");

  colorImage.addEventListener("load", e => {
    colorContext.drawImage(colorImage, 0, 0, colorwidth / 2, colorheight / 2);
    createDataUrl(colorCanvas, "color", "webp");
  });
}

function startWindowsKinect(evt) {
  kinect = new Kinect2();
  let kinectType = "windows";
  whichKinect = kinectType;

  initControls(kinectType);
  toggleKinectType(evt, kinectType);
  toggleFrameType(evt, kinectType); // ensure always starts on single frame
  setCanvasDimensions(kinectType);
}

function setCanvasDimensions(kinectType) {
  if (kinectType === "azure") {
    colorwidth = AZURECOLORWIDTH;
    colorheight = AZURECOLORHEIGHT;

    depthwidth = AZUREDEPTHWIDTH;
    depthheight = AZUREDEPTHHEIGHT;

    rawdepthwidth = AZURERAWWIDTH;
    rawdepthheight = AZURERAWHEIGHT;
  } else if (kinectType === "windows") {
    colorwidth = WINDOWSCOLORWIDTH;
    colorheight = WINDOWSCOLORHEIGHT;

    depthwidth = WINDOWSDEPTHWIDTH;
    depthheight = WINDOWSDEPTHHEIGHT;

    rawdepthwidth = WINDOWSRAWWIDTH;
    rawdepthheight = WINDOWSRAWHEIGHT;
  }
}

function initControls(kinectType) {
  let additionalControls = document.getElementById("additional-controls");
  additionalControls.style.display = "block";

  // let allFrameButtons = document.querySelectorAll("input[type=button]");

  let allOptions = document.getElementsByClassName("option");
  // let allFrameButtons = document.getElementsByType('button');

  for (let i = 0; i < allOptions.length; i++) {
    allOptions[i].style.display = "none";
  }

  if (kinectType === "azure") {
    let azureButtons = document.getElementsByClassName("azure-option");

    for (let i = 0; i < azureButtons.length; i++) {
      azureButtons[i].style.display = "block";
    }
  } else if (kinectType === "windows") {
    let windowsButtons = document.getElementsByClassName("windows-option");

    for (let i = 0; i < windowsButtons.length; i++) {
      windowsButtons[i].style.display = "block";
    }
  }
}

function toggleKinectType(evt, kinectType) {
  let button;
  let state;

  if (evt === null) {
    if (kinectType === "azure") {
      button = document.getElementById("start-kinect-azure");
    } else {
      button = document.getElementById("start-kinect-windows");
    }
  } else {
    evt.preventDefault();
    button = evt.srcElement;
  }

  state = button.id;

  if (state === "start-kinect-azure") {
    button.style.background = BUTTONACTIVECLR;
    document.getElementById(
      "start-kinect-windows"
    ).style.background = BUTTONINACTIVECLR;
  } else if (state === "start-kinect-windows") {
    button.style.background = BUTTONACTIVECLR;
    document.getElementById(
      "start-kinect-azure"
    ).style.background = BUTTONINACTIVECLR;
  }
}

function updateImgQuality(evt) {
  imgQuality = evt.srcElement.value * 0.1;
}

function toggleAPIBlocker(evt) {
  var apiButton = document.getElementById("api-blocker");
  var apiText = document.getElementById("api-blocker-intro");

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
  var recordButton = document.getElementById("record");
  var serverSide = false;

  if (evt) {
    evt.preventDefault();
    serverSide = true;
  }

  if (doRecord) {
    // If no frame selected, send alert
    if (multiFrame === false && currentCamera === null) {
      alert("Begin broadcast, then begin recording");
      return;
    }

    var framesToRecord = [];

    console.log("currentcamera", currentCamera);

    if (multiFrame) {
      for (var i = 0; i < currentFrames.length; i++) {
        if (currentFrames[i] == "body") framesToRecord.push("skeleton");
        else framesToRecord.push(currentFrames[i]);
      }
    } else if (currentCamera == "body") {
      framesToRecord.push("skeleton");
    } else {
      framesToRecord.push(currentCamera);
    }

    for (var j = 0; j < framesToRecord.length; j++) {
      mediaRecorders.push(createMediaRecorder(framesToRecord[j], serverSide));
    }

    recordStartTime = Date.now();
    //doRecord = true;

    // Toggle record button color and text
    toggleButtonState("record", "active");
    recordButton.value = "Stop Record";
  } else {
    //doRecord = false;
    toggleButtonState("record", "inactive");
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
  var newMediaRecorder = new MediaRecorder(
    document.getElementById(idToRecord).captureStream()
  );
  var mediaChunks = [];

  newMediaRecorder.onstop = function(e) {
    // The video as a blob
    var blob = new Blob(mediaChunks, { type: "video/webm" });

    // Reset Chunks
    mediaChunks.length = 0;

    // Display the video on the page
    // var videoElement = document.createElement('video');
    // videoElement.setAttribute("id", Date.now());
    // videoElement.controls = true;
    // document.body.appendChild(videoElement);
    // videoElement.src = window.URL.createObjectURL(blob);

    var fs = require("fs");
    try {
      fs.mkdirSync(recordingLocation);
    } catch (evt) {
      if (evt.code != "EEXIST") throw e;
    }

    // If skeleton data is being tracked, write out the body frames JSON
    if (id == "skeleton") {
      var bodyJSON = JSON.stringify(bodyChunks);
      var filename = recordingLocation + "skeleton" + recordStartTime + ".json";
      fs.writeFile(filename, bodyJSON, "utf8", function() {
        if (serverSide === true)
          alert("Your file has been saved to " + filename);
      });
      bodyChunks.length = 0;
    }

    // Read the blob as a file
    var reader = new FileReader();
    reader.addEventListener(
      "loadend",
      function(e) {
        // Create the videoBuffer and write to file
        var videoBuffer = new Buffer(reader.result);

        // Write it out
        var filename = recordingLocation + id + recordStartTime + ".webm";
        fs.writeFile(filename, videoBuffer, function(err) {
          if (err) console.log(err);
          if (serverSide === true)
            alert("Your file has been saved to " + filename);
        });
      },
      false
    );
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

function toggleFrameType(evt, kinectType) {
  let pressedButton;
  let state;

  if (evt === null) {
    if (kinectType === "azure") {
      pressedButton = document.getElementById("start-kinect-azure");
    } else {
      pressedButton = document.getElementById("start-kinect-windows");
    }
  } else {
    evt.preventDefault();
    pressedButton = evt.srcElement;
  }

  state = pressedButton.id;

  let singleFrameButton = document.getElementById("single-frame-btn");
  let multiFrameButton = document.getElementById("multi-frame-btn");
  let singleFrameOptions = document.getElementById("single-frame");
  let multiFrameOptions = document.getElementById("multi-frame");

  if (
    state === "single-frame-btn" ||
    state === "start-kinect-azure" ||
    state === "start-kinect-windows"
  ) {
    singleFrameButton.style.background = BUTTONACTIVECLR;
    multiFrameButton.style.background = BUTTONINACTIVECLR;

    singleFrameOptions.style.display = "block";
    multiFrameOptions.style.display = "none";
  } else if (state == "multi-frame-btn") {
    multiFrameButton.style.background = BUTTONACTIVECLR;
    singleFrameButton.style.background = BUTTONINACTIVECLR;

    singleFrameOptions.style.display = "none";
    multiFrameOptions.style.display = "block";
  }
}

function toggleAdvancedOptions(evt) {
  evt.preventDefault();

  var advOptions = document.getElementById("advanced-options");
  advOptions.style.display =
    advOptions.style.display == "block" ? "none" : "block";

  var advLink = document.getElementById("advanced-link");
  var hide = '<a id="advanced-link" href="#">Hide Advanced Options</a>';
  var show = '<a id="advanced-link" href="#">Show Advanced Options</a>';
  advLink.innerHTML = advLink.innerHTML == hide ? show : hide;
}

function getIpAddress() {
  var ifaces = os.networkInterfaces();
  var ipAddresses = [];

  Object.keys(ifaces).forEach(function(ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function(iface) {
      if ("IPv4" !== iface.family || iface.internal !== false) {
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
  peer.on("error", function(err) {
    console.log(err);
  });

  peer.on("open", function(id) {
    myPeerId = id;
    peerIdDisplay.innerHTML = myPeerId;
    document.getElementById("port").innerHTML = peer.options.port;
    document.getElementById("newipaddress").innerHTML = peer.options.host;
  });

  peer.on("connection", function(conn) {
    connection = conn;
    console.log("Got a new data connection from peer: " + connection.peer);
    peer_connections.push(connection);

    connection.on("open", function() {
      console.log("Connection opened.");

      // to do: revisit
      if (whichKinect !== null) {
        sendToPeer("ready", { kinect: whichKinect });
      } else {
        sendToPeer("ready", {});
      }
    });

    connection.on("data", function(dataReceived) {
      if (blockAPI == true) return;

      switch (dataReceived.event) {
        case "setkinect":
          setKinect(dataReceived.data);
          break;

        case "initfeed":
          if (dataReceived.data.feed) {
            chooseCamera(null, dataReceived.data.feed);
          }
          break;

        case "feed":
          chooseCamera(null, dataReceived.data.feed);
          break;

        case "multi":
          chooseMulti(null, dataReceived.data);
          break;

        case "record":
          if (dataReceived.data == "start") startRecord();
          if (dataReceived.data == "stop") stopRecord();
          break;
      }
    });
  });

  peer.on("close", function() {
    console.log("Peer connection closed");

    // Only create new peer if old peer destroyed and new peer requested
    if (newPeerEntry) {
      peer = null;
      initpeer();
      newPeerEntry = false;
    }
  });
}

function setKinect(kinectType) {
  whichKinect = kinectType;

  if (whichKinect === "azure") {
    startAzureKinect(null);
  } else {
    startWindowsKinect(null);
  }
}

function newPeerServer(evt) {
  console.log("Creating new peer server");
  newPeerEntry = true;
  evt.preventDefault();
  myPeerId = document.getElementById("newpeerid").value;
  var peerNetTemp = document.getElementById("peernet").value;
  peerNet = JSON.parse(peerNetTemp);

  // Distroy default peer before creating new one
  peer.disconnect();
  peer.destroy();

  // Show new peer credentials. Hide default ip address
  document.getElementById("connectionopen").style.display = "none";
  document.getElementById("newpeercreated").style.display = "block";
}

let timer = false;
let timeCounter = 0;
let sendCounter = 0;
let memCounter = 0;
function sendToPeer(evt, data) {
  // console.log(evt);
  // to do: create utility for counting sending fps and size of obj to send
  // console.log(evt);
  // if (evt === "trackedBodyFrame") {
  // if (evt === "frame") {
  // if (evt === "rawDepth") {
  // if (timer === false) {
  //   timer = true;
  //   timeCounter = Date.now();
  // }
  // if (Date.now() > timeCounter + 5000) {
  //   console.log("resetting. last count: ", sendCounter);
  //   timer = false;
  //   sendCounter = 0;
  // } else {
  //   sendCounter++; // count how many times we send in 1 second
  // }
  // console.log(roughSizeOfObject(data));
  // }

  let dataToSend = { event: evt, data: data };

  peer_connections.forEach(function(connection) {
    connection.send(dataToSend);
  });
}

function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === "boolean") {
      bytes += 4;
    } else if (typeof value === "string") {
      bytes += value.length * 2;
    } else if (typeof value === "number") {
      bytes += 8;
    } else if (typeof value === "object" && objectList.indexOf(value) === -1) {
      objectList.push(value);

      for (var i in value) {
        stack.push(value[i]);
      }
    }
  }
  return bytes;
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
    case "colorwidth":
      targetElement = document.getElementById("colorheight");
      targetElement.value = (1080 * size) / 1920;
      break;

    case "colorheight":
      targetElement = document.getElementById("colorwidth");
      targetElement.value = (1920 * size) / 1080;
      break;

    case "depthwidth":
      targetElement = document.getElementById("depthheight");
      targetElement.value = (424 * size) / 512;
      break;

    case "depthheight":
      targetElement = document.getElementById("depthwidth");
      targetElement.value = (512 * size) / 424;
      break;
  }
}

function setOutputDimensions(evt) {
  evt.preventDefault();

  var allCanvases = [
    "color",
    "depth",
    "raw-depth",
    "skeleton",
    "infrared",
    "le-infrared",
    "key"
  ];

  var element = evt.srcElement;
  var elementId = element.id;

  for (var i = 0; i < allCanvases.length; i++) {
    var currentCanvas = document.getElementById(allCanvases[i] + "-canvas");
    var currentCanvasResolution = (
      currentCanvas.width / currentCanvas.height
    ).toFixed(1);

    switch (elementId) {
      case "colorsubmit":
        if (currentCanvasResolution == 1.8) {
          currentCanvas.width = document.getElementById("colorwidth").value;
          currentCanvas.height = document.getElementById("colorheight").value;
        }
        break;

      case "depthsubmit":
        if (currentCanvasResolution == 1.2) {
          currentCanvas.width = document.getElementById("depthwidth").value;
          currentCanvas.height = document.getElementById("depthheight").value;
        }
        break;
    }
  }
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Feed Choice //////////////////////////////

function chooseCamera(evt, feed) {
  let camera;
  let changingCameras = false;

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

  if (currentCamera === camera) {
    return;
  } else if (camera === "stop-all") {
    if (currentCamera) {
      changeCameraState(currentCamera, "stop");
      toggleButtonState(currentCamera, "inactive");
      toggleFeedDiv(currentCamera, "none");

      currentCamera = null;
      return;
    } else {
      return;
    }
  } else {
    if (currentCamera) {
      changingCameras = true;
      changeCameraState(currentCamera, "stop");
      toggleButtonState(currentCamera, "inactive");
      toggleFeedDiv(currentCamera, "none");

      // Using this to avoid fatal error from node-addon-api
      // FATAL ERROR: ThreadSafeFunction::operator = You cannot assign a new TSFN because existing one is still alive.
      // I think this is it. Need to revisit
      // https://github.com/nodejs/node-addon-api/issues/524
      setTimeout(function() {
        changeCameraState(camera, "start");
        toggleButtonState(camera, "active");
        toggleFeedDiv(camera, "block");

        currentCamera = camera;
      }, 500);
    }

    if (!changingCameras) {
      changeCameraState(camera, "start");
      toggleButtonState(camera, "active");
      toggleFeedDiv(camera, "block");

      currentCamera = camera;
    }
  }
}

function toggleButtonState(buttonId, state) {
  var button = document.getElementById(buttonId);

  if (state == "active") {
    button.style.background = BUTTONACTIVECLR;
  } else if (state == "inactive") {
    button.style.background = BUTTONINACTIVECLR;
  }
}

function toggleFeedDiv(camera, state) {
  var divsToShow = [];
  if (camera == "multi") {
    for (var i = 0; i < currentFrames.length; i++) {
      if (currentFrames[i] == "body") divsToShow.push("skeleton");
      else divsToShow.push(currentFrames[i]);
    }
  } else if (camera == "body") {
    divsToShow.push("skeleton");
  } else {
    divsToShow.push(camera);
  }

  for (var j = 0; j < divsToShow.length; j++) {
    var divId = divsToShow[j] + "-div";
    var feedDiv = document.getElementById(divId);

    feedDiv.style.display = state;
  }
}

function changeCameraState(camera, state) {
  var cameraCode;
  var changeStateFunction;

  switch (camera) {
    case "color":
      cameraCode = "Color";
      break;

    case "depth":
      cameraCode = "Depth";
      break;

    case "raw-depth":
      cameraCode = "RawDepth";
      break;

    case "key":
      cameraCode = "Key";
      break;

    case "infrared":
      cameraCode = "Infrared";
      break;

    case "le-infrared":
      cameraCode = "LEInfrared";
      break;

    case "fh-joint":
      cameraCode = "FHJoint";
      break;

    // case 'scale':
    //   cameraCode = 'ScaleUser';
    // break;

    case "body":
      sendAllBodies = true;
      cameraCode = "SkeletonTracking";
      break;

    case "skeleton":
      sendAllBodies = false;
      cameraCode = "SkeletonTracking";
      break;

    case "rgbd":
      cameraCode = "RGBD";
      break;

    case "multi":
      cameraCode = "Multi";
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
    chooseCamera(null, "stop-all");
  }

  var temp;
  var frames = [];
  var multiFrames = [];
  var result;

  if (incomingFrames) {
    frames = incomingFrames;
  } else {
    //find which feeds are checked
    var allCheckBoxes = document.getElementsByClassName("cb-multi");
    for (var i = 0; i < allCheckBoxes.length; i++) {
      if (allCheckBoxes[i].checked) {
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
      case "color":
        multiFrames.push(Kinect2.FrameType.color);
        break;

      case "depth":
        multiFrames.push(Kinect2.FrameType.depth);
        break;

      case "body":
        multiFrames.push(Kinect2.FrameType.body);
        break;

      case "raw-depth":
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

  result = multiFrames.reduce(function(a, b) {
    return a | b;
  });
  toggleFeedDiv("multi", "block");
  startMulti(result);
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Kinect Frames ////////////////////////////

function startColor() {
  console.log("starting color camera");

  // to do: ideally refactor so globals not needed for azure

  resetCanvas("color");
  canvasState = "color";
  setImageData();

  if (kinect.constructor.name === "KinectAzure") {
    // KINECT AZURE
    if (kinect.open()) {
      kinect.startCameras({
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15
      });

      let colorImageURL;

      kinect.startListening(data => {
        const bufferCopy = Buffer.from(data.colorImageFrame.imageData);

        // setting a data url leaks memory - Blobs seem to work fine
        // https://stackoverflow.com/questions/19298393/setting-img-src-to-dataurl-leaks-memory
        const imageBlob = new Blob([bufferCopy], { type: "image/jpeg" });
        if (colorImageURL) {
          URL.revokeObjectURL(colorImageURL);
        }

        // color canvas processing and seinging managed in colorImage on load event
        // see initAzureColorImageAndCanvas()
        colorImageURL = URL.createObjectURL(imageBlob);
        colorImage.src = colorImageURL;
      });
    }
    // Windows Kinect
  } else {
    let colorCanvas = document.getElementById("color-canvas");
    colorCanvas.width = colorwidth / 2;
    colorCanvas.height = colorheight / 2;
    let colorContext = colorCanvas.getContext("2d");

    // Kinect Windows
    if (kinect.open()) {
      kinect.on("colorFrame", function(newPixelData) {
        if (busy) {
          return;
        }
        busy = true;

        processColorBuffer(newPixelData);

        drawImageToCanvas(colorCanvas, colorContext, "color", "webp");
        busy = false;
      });
    }
    kinect.openColorReader();
  }
}

function stopColor() {
  if (kinect.constructor.name === "KinectAzure") {
    // Kinect Azure Code
    console.log("stopping color camera");
    kinect.stopCameras();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    console.log("stopping color camera");
    kinect.closeColorReader();
    kinect.removeAllListeners();
    canvasState = null;
    busy = false;
  }
}

function startDepth() {
  console.log("start depth camera");

  let depthCanvas = document.getElementById("depth-canvas");
  depthCanvas.width = depthwidth;
  depthCanvas.height = depthheight;
  let depthContext = depthCanvas.getContext("2d");

  resetCanvas("depth");
  canvasState = "depth";
  setImageData();

  if (kinect.constructor.name === "KinectAzure") {
    // KINECT AZURE CODE
    if (kinect.open()) {
      const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED;
      kinect.startCameras({
        depth_mode: depthMode,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15
      });

      let depthModeRange = kinect.getDepthModeRange(depthMode);

      kinect.startListening(data => {
        const newPixelData = Buffer.from(data.depthImageFrame.imageData);
        processAzureDepthBuffer(newPixelData, depthModeRange);
        drawImageToCanvas(depthCanvas, depthContext, "depth", "webp");
      });
    }
  } else {
    // KINECT WINDOWS CODE
    if (kinect.open()) {
      kinect.on("depthFrame", function(newPixelData) {
        if (busy) {
          return;
        }
        busy = true;

        processDepthBuffer(newPixelData);
        drawImageToCanvas(depthCanvas, depthContext, "depth", "webp");
        busy = false;
      });
    }
    kinect.openDepthReader();
  }
}

function stopDepth() {
  if (kinect.constructor.name === "KinectAzure") {
    // Kinect Azure
    console.log("stopping depth camera");
    kinect.stopCameras();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    // Kinect Windows
    console.log("stopping depth camera");
    kinect.closeDepthReader();
    kinect.removeAllListeners();
    canvasState = null;
    busy = false;
  }
}

function startRawDepth() {
  console.log("start Raw Depth Camera");

  let rawDepthCanvas = document.getElementById("raw-depth-canvas");
  rawDepthCanvas.width = rawdepthwidth;
  rawDepthCanvas.height = rawdepthheight;
  let rawDepthContext = rawDepthCanvas.getContext("2d");

  resetCanvas("raw");
  canvasState = "raw";
  setImageData();

  rawDepth = true;

  if (kinect.constructor.name === "KinectAzure") {
    // KINECT AZURE CODE
    if (kinect.open()) {
      console.log("kinect open");
      // UNBINNED has higher depth resolution at 640x576
      // const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED;
      // BINNED has lower resolution at 320x288
      const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_2X2BINNED;
      kinect.startCameras({
        depth_mode: depthMode,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15
      });

      // let depthModeRange = kinect.getDepthModeRange(depthMode);

      kinect.startListening(data => {
        const newPixelData = Buffer.from(data.depthImageFrame.imageData);

        processRawDepthBuffer(newPixelData);
        let rawDepthImg = drawImageToCanvas(
          rawDepthCanvas,
          rawDepthContext,
          "rawDepth",
          "webp",
          1
        );

        sendToPeer("rawDepth", rawDepthImg);
        // limit raw depth to 25 fps // 40
        // limit raw depth to 15fps
        // if (Date.now() > sentTime + 1000 / 10) {
        //   sendToPeer("rawDepth", rawDepthImg);
        //   sentTime = Date.now();
        // }
      });
    }
  } else {
    // Windows Kinect
    if (kinect.open()) {
      kinect.on("rawDepthFrame", function(newPixelData) {
        if (busy) {
          return;
        }
        busy = true;

        processRawDepthBuffer(newPixelData);
        var rawDepthImg = drawImageToCanvas(
          rawDepthCanvas,
          rawDepthContext,
          "rawDepth",
          "webp",
          1
        );

        // limit raw depth to 25 fps
        if (Date.now() > sentTime + 40) {
          sendToPeer("rawDepth", rawDepthImg);
          sentTime = Date.now();
        }

        busy = false;
      });
    }
    kinect.openRawDepthReader();
  }
}

function stopRawDepth() {
  console.log("stopping raw depth camera");

  if (kinect.constructor.name === "KinectAzure") {
    // Kinect Azure
    console.log("stopping depth camera");
    kinect.stopCameras();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    // Kinect Windows
    kinect.closeRawDepthReader();
    kinect.removeAllListeners();
    canvasState = null;
    rawDepth = false;
    busy = false;
  }
}

function startInfrared() {
  console.log("starting infrared camera");

  let infraredCanvas = document.getElementById("infrared-canvas");
  infraredCanvas.width = depthwidth;
  infraredCanvas.height = depthheight;
  let infraredContext = infraredCanvas.getContext("2d");

  resetCanvas("depth");
  canvasState = "depth";
  setImageData();

  if (kinect.open()) {
    kinect.on("infraredFrame", function(newPixelData) {
      if (busy) {
        return;
      }
      busy = true;

      processDepthBuffer(newPixelData);
      drawImageToCanvas(infraredCanvas, infraredContext, "infrared", "webp");

      busy = false;
    });
  }
  kinect.openInfraredReader();
}

function stopInfrared() {
  console.log("stopping infrared camera");
  kinect.closeInfraredReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startLEInfrared() {
  console.log("starting le-infrared");

  let leInfraredCanvas = document.getElementById("le-infrared-canvas");
  leInfraredCanvas.width = depthwidth;
  leInfraredCanvas.height = depthheight;
  let leInfraredContext = leInfraredCanvas.getContext("2d");

  resetCanvas("depth");
  canvasState = "depth";
  setImageData();

  if (kinect.open()) {
    kinect.on("longExposureInfraredFrame", function(newPixelData) {
      if (busy) {
        return;
      }
      busy = true;

      processDepthBuffer(newPixelData);
      drawImageToCanvas(
        leInfraredCanvas,
        leInfraredContext,
        "LEinfrared",
        "webp"
      );

      busy = false;
    });
  }

  kinect.openLongExposureInfraredReader();
}

function stopLEInfrared() {
  console.log("stopping le-infrared");
  kinect.closeLongExposureInfraredReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startRGBD() {
  console.log("starting rgbd");

  let rgbdCanvas = document.getElementById("rgbd-canvas");
  rgbdCanvas.width = depthwidth;
  rgbdCanvas.height = depthheight;
  let rgbdContext = rgbdCanvas.getContext("2d");

  resetCanvas("depth");
  canvasState = "depth";
  setImageData();

  if (kinect.open()) {
    kinect.on("multiSourceFrame", function(frame) {
      if (busy) {
        return;
      }

      busy = true;

      var j = 0;
      for (var i = 0; i < imageDataSize; i += 4) {
        imageDataArray[i] = frame.depthColor.buffer[i];
        imageDataArray[i + 1] = frame.depthColor.buffer[i + 1];
        imageDataArray[i + 2] = frame.depthColor.buffer[i + 2];
        imageDataArray[i + 3] = frame.depth.buffer[j]; // set alpha channel as depth
        j++;
      }

      var rgbdImg = drawImageToCanvas(
        rgbdCanvas,
        rgbdContext,
        "rgbd",
        "webp",
        0.1
      );

      //busy = false;

      // limit raw depth to 25 fps
      if (Date.now() > sentTime + 40) {
        packageData("rgbd", rgbdImg);
        sentTime = Date.now();
      }

      setTimeout(function() {
        busy = false;
      });
    }); // kinect.on
  } // open
  kinect.openMultiSourceReader({
    frameTypes: Kinect2.FrameType.depth | Kinect2.FrameType.depthColor
  });
}

function stopRGBD() {
  console.log("stopping rgbd");
  kinect.closeMultiSourceReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
}

function startSkeletonTracking() {
  console.log("starting skeleton");

  let skeletonCanvas = document.getElementById("skeleton-canvas");
  skeletonCanvas.width = depthwidth;
  skeletonCanvas.height = depthheight;
  let skeletonContext = skeletonCanvas.getContext("2d");

  resetCanvas("depth");
  canvasState = "depth";

  if (kinect.constructor.name === "KinectAzure") {
    if (kinect.open()) {
      // to do: looks like the cameras need to be open for the tracker to work. true?
      kinect.startCameras({
        depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_30
      });
      kinect.createTracker();
      kinect.startListening(function handleData(data) {
        if (data.bodyFrame.numBodies === 0) {
          return;
        }
        // normalizing 2d coordinates
        let normalizedBodyFrame = normalizeSkeletonCoords(data.bodyFrame);

        if (sendAllBodies) {
          sendToPeer("bodyFrame", normalizedBodyFrame);
          if (doRecord) {
            normalizedBodyFrame.record_startime = recordStartTime;
            normalizedBodyFrame.record_timestamp = Date.now() - recordStartTime;
            bodyChunks.push(normalizedBodyFrame);
          }
        }

        skeletonContext.clearRect(
          0,
          0,
          skeletonCanvas.width,
          skeletonCanvas.height
        );

        let index = 0;
        normalizedBodyFrame.bodies.forEach(function drawBody(body) {
          if (!sendAllBodies) {
            sendToPeer("trackedBodyFrame", body);
            if (doRecord) {
              body.record_startime = recordStartTime;
              body.record_timestamp = Date.now() - recordStartTime;
              bodyChunks.push(body);
            }
          }

          drawSkeleton(skeletonCanvas, skeletonContext, body, index);
          index++;
        });
      }); // listening
    } // open
  } else {
    // for windows kinect
    if (kinect.open()) {
      kinect.on("bodyFrame", function(bodyFrame) {
        if (sendAllBodies) {
          sendToPeer("bodyFrame", bodyFrame);
          if (doRecord) {
            bodyFrame.record_startime = recordStartTime;
            bodyFrame.record_timestamp = Date.now() - recordStartTime;
            bodyChunks.push(bodyFrame);
          }
        }
        skeletonContext.clearRect(
          0,
          0,
          skeletonCanvas.width,
          skeletonCanvas.height
        );
        var index = 0;
        bodyFrame.bodies.forEach(function(body) {
          if (body.tracked) {
            if (!sendAllBodies) {
              sendToPeer("trackedBodyFrame", body);
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
} //tracking

function normalizeSkeletonCoords(bodyFrame) {
  bodyFrame.bodies.forEach(function(body) {
    for (let i = 0; i < body.skeleton.joints.length; i++) {
      body.skeleton.joints[i].colorX =
        1.0 - body.skeleton.joints[i].colorX / AZURECOLORWIDTH;
      body.skeleton.joints[i].colorY /= AZURECOLORHEIGHT;
      body.skeleton.joints[i].depthX =
        1.0 - body.skeleton.joints[i].depthX / AZUREDEPTHWIDTH;
      body.skeleton.joints[i].depthY /= AZUREDEPTHHEIGHT;
    }
  });

  return bodyFrame;
}

function stopSkeletonTracking() {
  if (kinect.constructor.name === "KinectAzure") {
    // Kinect Azure Code
    console.log("stopping skeleton");
    kinect.stopCameras();
    kinect.destroyTracker();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    // Kinect Windows Code
    console.log("stopping skeleton");
    kinect.closeBodyReader();
    kinect.removeAllListeners();
    canvasState = null;
  }
}

function displayCurrentFrames() {
  var allFrameDisplay = document.getElementsByClassName("current-frames");

  for (var i = 0; i < allFrameDisplay.length; i++) {
    allFrameDisplay[i].innerHTML = currentFrames;
  }
}

function startMulti(multiFrames) {
  console.log("starting multi");

  var options = { frameTypes: multiFrames };
  var multiToSend = {};

  displayCurrentFrames();

  multiFrame = true;
  if (kinect.open()) {
    kinect.on("multiSourceFrame", function(frame) {
      if (busy) {
        return;
      }
      busy = true;

      var newPixelData;
      var temp;

      if (frame.color) {
        var colorCanvas = document.getElementById("color-canvas");
        var colorContext = colorCanvas.getContext("2d");

        resetCanvas("color");
        canvasState = "color";
        setImageData();

        newPixelData = frame.color.buffer;
        processColorBuffer(newPixelData);
        temp = drawImageToCanvas(colorCanvas, colorContext, null, "webp");
        multiToSend.color = temp;
      }

      if (frame.body) {
        var skeletonCanvas = document.getElementById("skeleton-canvas");
        var skeletonContext = skeletonCanvas.getContext("2d");

        if (doRecord) {
          frame.body.record_startime = recordStartTime;
          frame.body.record_timestamp = Date.now() - recordStartTime;
          bodyChunks.push(frame.body);
        }

        // index used to change colors on draw
        var index = 0;

        // draw tracked bodies
        skeletonContext.clearRect(
          0,
          0,
          skeletonCanvas.width,
          skeletonCanvas.height
        );
        frame.body.bodies.forEach(function(body) {
          if (body.tracked) {
            drawSkeleton(skeletonCanvas, skeletonContext, body, index);
            index++;
          }
        });

        multiToSend.body = frame.body.bodies;
      }

      if (frame.depth) {
        var depthCanvas = document.getElementById("depth-canvas");
        var depthContext = depthCanvas.getContext("2d");

        resetCanvas("depth");
        canvasState = "depth";
        setImageData();

        newPixelData = frame.depth.buffer;
        processDepthBuffer(newPixelData);
        temp = drawImageToCanvas(depthCanvas, depthContext, null, "webp");
        multiToSend.depth = temp;
      }

      if (frame.rawDepth) {
        var rawDepthCanvas = document.getElementById("raw-depth-canvas");
        var rawDepthContext = rawDepthCanvas.getContext("2d");

        resetCanvas("raw");
        canvasState = "raw";
        setImageData();

        newPixelData = frame.rawDepth.buffer;
        processRawDepthBuffer(newPixelData);
        temp = drawImageToCanvas(
          rawDepthCanvas,
          rawDepthContext,
          null,
          "webp",
          1
        );
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
      sendToPeer("multiFrame", multiToSend);

      busy = false;
    }); // kinect.on
  } // open

  kinect.openMultiSourceReader(options);
}

function stopMulti() {
  if (multiFrame) {
    kinect.closeMultiSourceReader();
    kinect.removeAllListeners();
    toggleFeedDiv("multi", "none");
    canvasState = null;
    busy = false;
    multiFrame = false;
  }
}

function startKey() {
  console.log("starting key");

  let keyCanvas = document.getElementById("key-canvas");
  keyCanvas.width = colorwidth / 2;
  keyCanvas.height = colorheight / 2;
  let keyContext = keyCanvas.getContext("2d");

  resetCanvas("color");
  canvasState = "color";
  setImageData();

  if (kinect.open()) {
    kinect.on("multiSourceFrame", function(frame) {
      if (busy) {
        return;
      }
      busy = true;

      var closestBodyIndex = getClosestBodyIndex(frame.body.bodies);
      if (closestBodyIndex !== trackedBodyIndex) {
        if (closestBodyIndex > -1) {
          kinect.trackPixelsForBodyIndices([closestBodyIndex]);
        } else {
          kinect.trackPixelsForBodyIndices(false);
        }
      } else {
        if (closestBodyIndex > -1) {
          if (frame.bodyIndexColor.bodies[closestBodyIndex].buffer) {
            newPixelData = frame.bodyIndexColor.bodies[closestBodyIndex].buffer;

            for (var i = 0; i < imageDataSize; i++) {
              imageDataArray[i] = newPixelData[i];
            }

            drawImageToCanvas(keyCanvas, keyContext, "key", "webp");
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
  console.log("stopping key");
  kinect.closeMultiSourceReader();
  kinect.removeAllListeners();
  canvasState = null;
  busy = false;
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

  switch (size) {
    case "depth":
      canvas.width = depthwidth;
      canvas.height = depthheight;
      break;

    case "color":
      canvas.width = colorwidth;
      canvas.height = colorheight;
      break;

    case "raw":
      canvas.width = rawdepthwidth;
      canvas.height = rawdepthheight;
      break;
  }
}

function drawImageToCanvas(inCanvas, inContext, frameType, imageType, quality) {
  context.putImageData(imageData, 0, 0);
  inContext.clearRect(0, 0, inCanvas.width, inCanvas.height);
  inContext.drawImage(canvas, 0, 0, inCanvas.width, inCanvas.height);

  if (rawDepth) {
    return createDataUrl(inCanvas, frameType, imageType, quality);
  } else {
    createDataUrl(inCanvas, frameType, imageType, quality);
  }
}

// to do: test this new function with api
function createDataUrl(inCanvas, frameType, imageType, quality) {
  let outputCanvasData;
  let imageQuality = imgQuality; //use globally stored image quality variable

  if (typeof quality !== "undefined") imageQuality = quality; // or replace image quality with stream default

  outputCanvasData = inCanvas.toDataURL("image/" + imageType, imageQuality);

  if (multiFrame) {
    return outputCanvasData;
  } else if (rawDepth) {
    return outputCanvasData;
  } else if (frameType == "rgbd") {
    return outputCanvasData;
  } else {
    packageData(frameType, outputCanvasData);
  }
}

function packageData(frameType, outputCanvasData) {
  dataToSend = { name: frameType, imagedata: outputCanvasData };
  sendToPeer("frame", dataToSend);
}

function processColorBuffer(newPixelData) {
  for (var i = 0; i < imageDataSize; i++) {
    imageDataArray[i] = newPixelData[i];
  }
}

function processDepthBuffer(newPixelData) {
  var j = 0;

  for (var i = 0; i < imageDataSize; i += 4) {
    imageDataArray[i] = newPixelData[j];
    imageDataArray[i + 1] = newPixelData[j];
    imageDataArray[i + 2] = newPixelData[j];
    imageDataArray[i + 3] = 0xff; // set alpha channel at full opacity
    j++;
  }
}

function processAzureDepthBuffer(newPixelData, depthRange) {
  let depthPixelIndex = 0;

  for (let i = 0; i < imageDataSize; i += 4) {
    // console.log('inside');
    const depthValue =
      (newPixelData[depthPixelIndex + 1] << 8) | newPixelData[depthPixelIndex];

    const normalizedValue = map(
      depthValue,
      depthRange.min,
      depthRange.max,
      255,
      0
    );
    imageDataArray[i] = normalizedValue;
    imageDataArray[i + 1] = normalizedValue;
    imageDataArray[i + 2] = normalizedValue;
    imageDataArray[i + 3] = 0xff;

    depthPixelIndex += 2;
  }
}

const map = (value, inputMin, inputMax, outputMin, outputMax) => {
  return (
    ((value - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
    outputMin
  );
};

function processRawDepthBuffer(newPixelData) {
  var j = 0;
  for (var i = 0; i < imageDataSize; i += 4) {
    imageDataArray[i] = newPixelData[j];
    imageDataArray[i + 1] = newPixelData[j + 1];
    imageDataArray[i + 2] = 0;
    imageDataArray[i + 3] = 0xff;
    j += 2;
  }
}

function getClosestBodyIndex(bodies) {
  var closestZ = Number.MAX_VALUE;
  var closestBodyIndex = -1;
  for (var i = 0; i < bodies.length; i++) {
    if (
      bodies[i].tracked &&
      bodies[i].joints[Kinect2.JointType.spineMid].cameraZ < closestZ
    ) {
      closestZ = bodies[i].joints[Kinect2.JointType.spineMid].cameraZ;
      closestBodyIndex = i;
    }
  }
  return closestBodyIndex;
}

function calculateLength(joints) {
  var length = 0;
  var numJoints = joints.length;
  for (var i = 1; i < numJoints; i++) {
    length += Math.sqrt(
      Math.pow(joints[i].colorX - joints[i - 1].colorX, 2) +
        Math.pow(joints[i].colorY - joints[i - 1].colorY, 2)
    );
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

function drawSkeleton(inCanvas, inContext, body, index) {
  // Skeleton variables
  let colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#00ffff",
    "#ff00ff"
  ];
  //draw joints

  // for azure kinect
  if (kinect.constructor.name === "KinectAzure") {
    for (let i = 0; i < body.skeleton.joints.length; i++) {
      let joint = body.skeleton.joints[i];
      inContext.fillStyle = colors[index];
      inContext.fillRect(
        joint.depthX * inCanvas.width,
        joint.depthY * inCanvas.height,
        10,
        10
      );
    }

    // for windows kinect
    // to do: test that this still works with kinect 2
  } else {
    for (var jointType in body.joints) {
      var joint = body.joints[jointType];
      inContext.fillStyle = colors[index];
      inContext.fillRect(
        joint.depthX * inCanvas.width,
        joint.depthY * inCanvas.height,
        10,
        10
      );
    }

    //draw hand states
    updateHandState(
      inContext,
      body.leftHandState,
      body.joints[Kinect2.JointType.handLeft]
    );
    updateHandState(
      inContext,
      body.rightHandState,
      body.joints[Kinect2.JointType.handRight]
    );
  }
}

function updateHandState(context, handState, jointPoint) {
  var HANDCLOSEDCOLOR = "red";
  var HANDOPENCOLOR = "green";
  var HANDLASSOCOLOR = "blue";

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
  var handData = {
    depthX: jointPoint.depthX,
    depthY: jointPoint.depthY,
    handColor: handColor,
    handSize: HANDSIZE
  };
  //sendToPeer('drawHand', handData);
  context.globalAlpha = 0.75;
  context.beginPath();
  context.fillStyle = handColor;
  context.arc(
    jointPoint.depthX * 512,
    jointPoint.depthY * 424,
    HANDSIZE,
    0,
    Math.PI * 2,
    true
  );
  context.fill();
  context.closePath();
  context.globalAlpha = 1;
}
