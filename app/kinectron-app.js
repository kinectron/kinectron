const os = require('os');
const Kinect2 = require('kinect2');
const KinectAzure = require('kinect-azure');
const ngrok = require('ngrok');

const BUTTONINACTIVECLR = '#fff';
const BUTTONACTIVECLR = '#1daad8';

let kinect = null;
let whichKinect = null;
let colorImage, colorCanvas, colorContext;

//  Create local peer server
var PeerServer = require('peer').PeerServer;
var server = PeerServer({ port: 9001, path: '/' });

// Set peer credentials for localhost by default
var peerNet = { host: 'localhost', port: 9001, path: '/' };
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

const AZURERGBDWIDTH = 512;
const AZURERGBDHEIGHT = 512;

let colorwidth;
let colorheight;

let depthwidth;
let depthheight;

let rawdepthwidth;
let rawdepthheight;

let rgbdwidth;
let rgbdheight;

var imageData = null;
var imageDataSize = null;
var imageDataArray = null;

var busy = false;
var currentCamera = null;

var sendAllBodies = false;

var multiFrame = false;
var currentFrames = null;

var rawDepth = false;
var blockAPI = false;

// Key Tracking needs cleanup
var trackedBodyIndex = -1;

let sentTime = Date.now();

// Record variables
const recordingLocation = os.homedir() + '/kinectron-recordings/';
var doRecord = false;
var recordStartTime = 0;
var bodyChunks = [];
var mediaRecorders = [];

let imgQuality = 0.5; // set default image quality

// globals for debug fps timer;
let timer = false;
let timeCounter = 0;
let sendCounter = 0;

window.addEventListener('load', initpeer);
window.addEventListener('load', init);

function init() {
  var ipAddresses;
  var allIpAddresses;

  console.log('You are running Kinectron Version 0.3.6!');

  ipAddresses = getIpAddress();
  allIpAddresses = ipAddresses.join(', ');
  document.getElementById('ipaddress').innerHTML = allIpAddresses;

  peerIdDisplay = document.getElementById('peerid');

  canvas = document.getElementById('inputCanvas');
  context = canvas.getContext('2d');

  setImageData();
  document
    .getElementById('start-kinect-azure')
    .addEventListener('click', startAzureKinect);
  document
    .getElementById('start-kinect-windows')
    .addEventListener('click', startWindowsKinect);
  document
    .getElementById('peersubmit')
    .addEventListener('click', newPeerServer);
  document
    .getElementById('single-frame-btn')
    .addEventListener('click', toggleFrameType);
  document
    .getElementById('multi-frame-btn')
    .addEventListener('click', toggleFrameType);
  document
    .getElementById('colorwidth')
    .addEventListener('change', updateDimFields);
  document
    .getElementById('colorheight')
    .addEventListener('change', updateDimFields);
  document
    .getElementById('depthwidth')
    .addEventListener('change', updateDimFields);
  document
    .getElementById('depthheight')
    .addEventListener('change', updateDimFields);
  document
    .getElementById('colorsubmit')
    .addEventListener('click', setOutputDimensions);
  document
    .getElementById('depthsubmit')
    .addEventListener('click', setOutputDimensions);
  document
    .getElementById('color')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('depth')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('raw-depth')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('infrared')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('le-infrared')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('key')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('depth-key')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('rgbd')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('body')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('skeleton')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('stop-all')
    .addEventListener('click', chooseCamera);
  document
    .getElementById('multi')
    .addEventListener('click', chooseMulti);
  document
    .getElementById('stop-multi')
    .addEventListener('click', stopMulti);
  document
    .getElementById('advanced-link')
    .addEventListener('click', toggleAdvancedOptions);
  document
    .getElementById('record')
    .addEventListener('click', toggleRecord);
  document
    .getElementById('api-blocker')
    .addEventListener('click', toggleAPIBlocker);
  document
    .getElementById('imgquality')
    .addEventListener('input', updateImgQuality);
  document
    .getElementById('startngrok')
    .addEventListener('click', startNgrok);
}

function startNgrok(evt) {
  const ngroklink = '<a href=>';
  if (
    confirm(
      `Creating a public address will open a secure public tunnel to your computer at port 9001 over https using ngrok. Learn more at ngrok.com. While this developer thinks this is a pretty nifty solution to getting your Kinectron server up on the internet, it could open you up to security threats. The risks are probably relatively low, but proceed at your own risk (and/or consider constributing to Kinectron to make it more secure (･ω･)b).`,
    )
  ) {
    (async function () {
      let ngrokUrl = await ngrok.connect(9001);
      console.log('Created public address at ' + ngrokUrl);

      let newStr = ngrokUrl.replace('https://', '');

      const ngrokAddress = document.getElementById('ngrokaddress');
      ngrokAddress.style.display = 'inline';
      ngrokAddress.innerHTML = newStr;

      const ngrokButton = document.getElementById('startngrok');
      ngrokButton.style.display = 'none';
    })();
  } else {
    console.log('No public address created.');
  }
}

function startAzureKinect(evt) {
  kinect = new KinectAzure();

  let kinectType = 'azure';
  whichKinect = kinectType;

  initControls(kinectType);
  toggleKinectType(evt, kinectType);
  toggleFrameType(evt, kinectType); // ensure always starts on single frame
  setCanvasDimensions(kinectType);

  // TODO: refactor so this global image and canvas is not needed
  initAzureColorImageAndCanvas();
}

function initAzureColorImageAndCanvas() {
  colorImage = document.getElementById('color-img');
  colorImage.style.display = 'none';

  colorCanvas = document.getElementById('color-canvas');
  // reduce color image size by 2 for more efficient sending
  colorCanvas.width = colorwidth / 2;
  colorCanvas.height = colorheight / 2;
  colorContext = colorCanvas.getContext('2d');

  colorImage.addEventListener('load', (e) => {
    colorContext.drawImage(
      colorImage,
      0,
      0,
      colorwidth / 2,
      colorheight / 2,
    );

    const dataUrl = createDataUrl(colorCanvas, 'webp', imgQuality);
    const packagedData = packageData('color', dataUrl);
    sendToPeer('frame', packagedData);
  });
}

function startWindowsKinect(evt) {
  kinect = new Kinect2();
  let kinectType = 'windows';
  whichKinect = kinectType;

  initControls(kinectType);
  toggleKinectType(evt, kinectType);
  toggleFrameType(evt, kinectType); // ensure always starts on single frame
  setCanvasDimensions(kinectType);
}

function setCanvasDimensions(kinectType) {
  if (kinectType === 'azure') {
    colorwidth = AZURECOLORWIDTH;
    colorheight = AZURECOLORHEIGHT;

    depthwidth = AZUREDEPTHWIDTH;
    depthheight = AZUREDEPTHHEIGHT;

    rawdepthwidth = AZURERAWWIDTH;
    rawdepthheight = AZURERAWHEIGHT;

    rgbdwidth = AZURERGBDWIDTH;
    rgbdheight = AZURERGBDHEIGHT;
  } else if (kinectType === 'windows') {
    colorwidth = WINDOWSCOLORWIDTH;
    colorheight = WINDOWSCOLORHEIGHT;

    depthwidth = WINDOWSDEPTHWIDTH;
    depthheight = WINDOWSDEPTHHEIGHT;

    rawdepthwidth = WINDOWSRAWWIDTH;
    rawdepthheight = WINDOWSRAWHEIGHT;
  }
}

function initControls(kinectType) {
  let additionalControls = document.getElementById(
    'additional-controls',
  );
  additionalControls.style.display = 'block';

  // let allFrameButtons = document.querySelectorAll("input[type=button]");

  let allOptions = document.getElementsByClassName('option');
  // let allFrameButtons = document.getElementsByType('button');

  for (let i = 0; i < allOptions.length; i++) {
    allOptions[i].style.display = 'none';
  }

  if (kinectType === 'azure') {
    let azureButtons =
      document.getElementsByClassName('azure-option');

    for (let i = 0; i < azureButtons.length; i++) {
      azureButtons[i].style.display = 'block';
    }
  } else if (kinectType === 'windows') {
    let windowsButtons =
      document.getElementsByClassName('windows-option');

    for (let i = 0; i < windowsButtons.length; i++) {
      windowsButtons[i].style.display = 'block';
    }
  }
}

function toggleKinectType(evt, kinectType) {
  let button;
  let state;

  if (evt === null) {
    if (kinectType === 'azure') {
      button = document.getElementById('start-kinect-azure');
    } else {
      button = document.getElementById('start-kinect-windows');
    }
  } else {
    evt.preventDefault();
    button = evt.srcElement;
  }

  state = button.id;

  if (state === 'start-kinect-azure') {
    button.style.background = BUTTONACTIVECLR;
    document.getElementById('start-kinect-windows').style.background =
      BUTTONINACTIVECLR;
  } else if (state === 'start-kinect-windows') {
    button.style.background = BUTTONACTIVECLR;
    document.getElementById('start-kinect-azure').style.background =
      BUTTONINACTIVECLR;
  }
}

function updateImgQuality(evt) {
  imgQuality = evt.srcElement.value * 0.1;
}

function toggleAPIBlocker(evt) {
  var apiButton = document.getElementById('api-blocker');
  var apiText = document.getElementById('api-blocker-intro');

  if (!blockAPI) {
    apiButton.value = 'Allow API Calls';
    apiText.innerHTML = 'API Calls Are Blocked';
  } else {
    apiButton.value = 'Block API Calls';
    apiText.innerHTML = 'API Calls Are Allowed';
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

  if (doRecord) {
    // If no frame selected, send alert
    if (multiFrame === false && currentCamera === null) {
      alert('Begin broadcast, then begin recording');
      return;
    }

    var framesToRecord = [];

    console.log('currentcamera', currentCamera);

    if (multiFrame) {
      for (var i = 0; i < currentFrames.length; i++) {
        if (currentFrames[i] == 'body')
          framesToRecord.push('skeleton');
        else framesToRecord.push(currentFrames[i]);
      }
    } else if (currentCamera == 'body') {
      framesToRecord.push('skeleton');
    } else {
      framesToRecord.push(currentCamera);
    }

    for (var j = 0; j < framesToRecord.length; j++) {
      mediaRecorders.push(
        createMediaRecorder(framesToRecord[j], serverSide),
      );
    }

    recordStartTime = Date.now();
    //doRecord = true;

    // Toggle record button color and text
    toggleButtonState('record', 'active');
    recordButton.value = 'Stop Record';
  } else {
    //doRecord = false;
    toggleButtonState('record', 'inactive');
    recordButton.value = 'Start Record';

    // Stop media recorders
    for (var k = mediaRecorders.length - 1; k >= 0; k--) {
      mediaRecorders[k].stop();
      mediaRecorders.splice(k, 1);
    }
  }
}

function createMediaRecorder(id, serverSide) {
  var idToRecord = id + '-canvas';
  var newMediaRecorder = new MediaRecorder(
    document.getElementById(idToRecord).captureStream(),
  );
  var mediaChunks = [];

  newMediaRecorder.onstop = function (e) {
    // The video as a blob
    var blob = new Blob(mediaChunks, { type: 'video/webm' });

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
    if (id == 'skeleton') {
      var bodyJSON = JSON.stringify(bodyChunks);
      var filename =
        recordingLocation + 'skeleton' + recordStartTime + '.json';
      fs.writeFile(filename, bodyJSON, 'utf8', function () {
        if (serverSide === true)
          alert('Your file has been saved to ' + filename);
      });
      bodyChunks.length = 0;
    }

    // Read the blob as a file
    var reader = new FileReader();
    reader.addEventListener(
      'loadend',
      function (e) {
        // Create the videoBuffer and write to file
        var videoBuffer = new Buffer(reader.result);

        // Write it out
        var filename =
          recordingLocation + id + recordStartTime + '.webm';
        fs.writeFile(filename, videoBuffer, function (err) {
          if (err) console.log(err);
          if (serverSide === true)
            alert('Your file has been saved to ' + filename);
        });
      },
      false,
    );
    reader.readAsArrayBuffer(blob);
  };

  // When video data is available
  newMediaRecorder.ondataavailable = function (e) {
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
    if (kinectType === 'azure') {
      pressedButton = document.getElementById('start-kinect-azure');
    } else {
      pressedButton = document.getElementById('start-kinect-windows');
    }
  } else {
    evt.preventDefault();
    pressedButton = evt.srcElement;
  }

  state = pressedButton.id;

  let singleFrameButton = document.getElementById('single-frame-btn');
  let multiFrameButton = document.getElementById('multi-frame-btn');
  let singleFrameOptions = document.getElementById('single-frame');
  let multiFrameOptions = document.getElementById('multi-frame');

  if (
    state === 'single-frame-btn' ||
    state === 'start-kinect-azure' ||
    state === 'start-kinect-windows'
  ) {
    singleFrameButton.style.background = BUTTONACTIVECLR;
    multiFrameButton.style.background = BUTTONINACTIVECLR;

    singleFrameOptions.style.display = 'block';
    multiFrameOptions.style.display = 'none';
  } else if (state == 'multi-frame-btn') {
    multiFrameButton.style.background = BUTTONACTIVECLR;
    singleFrameButton.style.background = BUTTONINACTIVECLR;

    singleFrameOptions.style.display = 'none';
    multiFrameOptions.style.display = 'block';
  }
}

function toggleAdvancedOptions(evt) {
  evt.preventDefault();

  var advOptions = document.getElementById('advanced-options');
  advOptions.style.display =
    advOptions.style.display == 'block' ? 'none' : 'block';

  var advLink = document.getElementById('advanced-link');
  var hide =
    '<a id="advanced-link" href="#">Hide Advanced Options</a>';
  var show =
    '<a id="advanced-link" href="#">Show Advanced Options</a>';
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
  peer.on('error', function (err) {
    console.log(err);
  });

  peer.on('open', function (id) {
    myPeerId = id;
    peerIdDisplay.innerHTML = myPeerId;
    document.getElementById('port').innerHTML = peer.options.port;
    document.getElementById('newipaddress').innerHTML =
      peer.options.host;
  });

  peer.on('connection', function (conn) {
    connection = conn;
    console.log(
      'Got a new data connection from peer: ' + connection.peer,
    );
    peer_connections.push(connection);

    connection.on('open', function () {
      console.log('Connection opened.');

      // TODO: revisit
      if (whichKinect !== null) {
        sendToPeer('ready', { kinect: whichKinect });
      } else {
        sendToPeer('ready', {});
      }
    });

    connection.on('data', function (dataReceived) {
      if (blockAPI == true) return;

      switch (dataReceived.event) {
        case 'setkinect':
          setKinect(dataReceived.data);
          break;

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

  peer.on('close', function () {
    console.log('Peer connection closed');

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

  if (whichKinect === 'azure') {
    startAzureKinect(null);
  } else {
    startWindowsKinect(null);
  }
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
  document.getElementById('connectionopen').style.display = 'none';
  document.getElementById('newpeercreated').style.display = 'block';
}

// lossy argument prevents data from being sent if there is data in the buffer
function sendToPeer(evt, data, lossy) {
  const dataToSend = { event: evt, data: data };
  let debugSendingData = false;

  if (debugSendingData) {
    countFPS(evt);
    console.log(roughSizeOfObject(dataToSend));
  }

  peer_connections.forEach(function (connection) {
    // TODO: Find an optimal buffering amount (or add a configuration setting for it).

    // Check if there is still data in the buffer before adding more information to it.
    // This prevents bandwidth issues from causing latency.
    // dataChannel must be null checked because dead peer connections will be in this
    //  list.

    if (
      lossy &&
      connection.dataChannel &&
      connection.dataChannel.bufferedAmount > 0
    ) {
      return;
    }

    connection.send(dataToSend);
  });
}

function countFPS(evt) {
  if (evt === 'frame') {
    if (timer === false) {
      timer = true;
      timeCounter = Date.now();
    }
    if (Date.now() > timeCounter + 1000) {
      console.log('resetting. last count: ', sendCounter);
      timer = false;
      sendCounter = 0;
    } else {
      sendCounter++; // count how many times we send in 1 second
    }
  }
}

function roughSizeOfObject(object) {
  var objectList = [];
  var stack = [object];
  var bytes = 0;

  while (stack.length) {
    var value = stack.pop();

    if (typeof value === 'boolean') {
      bytes += 4;
    } else if (typeof value === 'string') {
      bytes += value.length * 2;
    } else if (typeof value === 'number') {
      bytes += 8;
    } else if (
      typeof value === 'object' &&
      objectList.indexOf(value) === -1
    ) {
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

  var allCanvases = [
    'color',
    'depth',
    'raw-depth',
    'skeleton',
    'infrared',
    'le-infrared',
    'key',
  ];

  var element = evt.srcElement;
  var elementId = element.id;

  for (var i = 0; i < allCanvases.length; i++) {
    var currentCanvas = document.getElementById(
      allCanvases[i] + '-canvas',
    );
    var currentCanvasResolution = (
      currentCanvas.width / currentCanvas.height
    ).toFixed(1);

    switch (elementId) {
      case 'colorsubmit':
        if (currentCanvasResolution == 1.8) {
          currentCanvas.width =
            document.getElementById('colorwidth').value;
          currentCanvas.height =
            document.getElementById('colorheight').value;
        }
        break;

      case 'depthsubmit':
        if (currentCanvasResolution == 1.2) {
          currentCanvas.width =
            document.getElementById('depthwidth').value;
          currentCanvas.height =
            document.getElementById('depthheight').value;
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
  } else if (camera === 'stop-all') {
    if (currentCamera) {
      changeCameraState(currentCamera, 'stop');
      toggleButtonState(currentCamera, 'inactive');
      toggleFeedDiv(currentCamera, 'none');

      currentCamera = null;
      return;
    } else {
      return;
    }
  } else {
    if (currentCamera) {
      changingCameras = true;
      changeCameraState(currentCamera, 'stop');
      toggleButtonState(currentCamera, 'inactive');
      toggleFeedDiv(currentCamera, 'none');

      // Using this to avoid fatal error from node-addon-api
      // FATAL ERROR: ThreadSafeFunction::operator = You cannot assign a new TSFN because existing one is still alive.
      // I think this is it. Need to revisit
      // https://github.com/nodejs/node-addon-api/issues/524
      setTimeout(function () {
        changeCameraState(camera, 'start');
        toggleButtonState(camera, 'active');
        toggleFeedDiv(camera, 'block');

        currentCamera = camera;
      }, 500);
    }

    if (!changingCameras) {
      changeCameraState(camera, 'start');
      toggleButtonState(camera, 'active');
      toggleFeedDiv(camera, 'block');

      currentCamera = camera;
    }
  }
}

function toggleButtonState(buttonId, state) {
  var button = document.getElementById(buttonId);

  if (state == 'active') {
    button.style.background = BUTTONACTIVECLR;
  } else if (state == 'inactive') {
    button.style.background = BUTTONINACTIVECLR;
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

  for (var j = 0; j < divsToShow.length; j++) {
    var divId = divsToShow[j] + '-div';
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

    case 'depth-key':
      cameraCode = 'DepthKey';
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

    case 'rgbd':
      cameraCode = 'RGBD';
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
  var multiFrames = [];
  var result;

  if (incomingFrames) {
    frames = incomingFrames;
  } else {
    //find which feeds are checked
    var allCheckBoxes = document.getElementsByClassName('cb-multi');
    for (var i = 0; i < allCheckBoxes.length; i++) {
      if (allCheckBoxes[i].checked) {
        frames.push(allCheckBoxes[i].value);
      }
    }
  }

  // if no frames selected, return
  if (frames.length === 0) {
    alert('Select at least one frame.');
    return;
  }

  // Set global frames variable for use in preview message
  currentFrames = frames;

  // TODO Simplify the case and result per Shawn
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

  result = multiFrames.reduce(function (a, b) {
    return a | b;
  });
  toggleFeedDiv('multi', 'block');
  startMulti(result);
}

////////////////////////////////////////////////////////////////////////
//////////////////////////// Kinect Frames ////////////////////////////

function startColor() {
  console.log('starting color camera');

  // TODO: ideally refactor so globals not needed for azure

  resetCanvas('color');
  canvasState = 'color';
  setImageData();

  if (kinect.constructor.name === 'KinectAzure') {
    // KINECT AZURE
    if (kinect.open()) {
      kinect.startCameras({
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
      });

      let colorImageURL;

      kinect.startListening((data) => {
        const bufferCopy = Buffer.from(
          data.colorImageFrame.imageData,
        );

        // setting a data url leaks memory - Blobs seem to work fine
        // https://stackoverflow.com/questions/19298393/setting-img-src-to-dataurl-leaks-memory
        const imageBlob = new Blob([bufferCopy], {
          type: 'image/jpeg',
        });
        if (colorImageURL) {
          URL.revokeObjectURL(colorImageURL);
        }

        // color canvas processing and sending managed in colorImage on load event
        // see initAzureColorImageAndCanvas()
        colorImageURL = URL.createObjectURL(imageBlob);
        colorImage.src = colorImageURL;
      });
    }
    // Windows Kinect
  } else {
    const colorCanvas = document.getElementById('color-canvas');
    colorCanvas.width = colorwidth / 2;
    colorCanvas.height = colorheight / 2;
    const colorContext = colorCanvas.getContext('2d');

    // Kinect Windows
    if (kinect.open()) {
      kinect.on('colorFrame', function (newPixelData) {
        if (busy) {
          return;
        }
        busy = true;

        processColorBuffer(newPixelData);

        const packagedData = prepareDataToSend(
          colorCanvas,
          colorContext,
          'webp',
          imgQuality,
          'color',
        );
        sendToPeer('frame', packagedData);

        busy = false;
      });
    }
    kinect.openColorReader();
  }
}

function stopColor() {
  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure Code
    console.log('stopping color camera');
    kinect.stopCameras();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    console.log('stopping color camera');
    kinect.closeColorReader();
    kinect.removeAllListeners();
    canvasState = null;
    busy = false;
  }
}

function startDepth() {
  console.log('start depth camera');

  const depthCanvas = document.getElementById('depth-canvas');
  depthCanvas.width = depthwidth;
  depthCanvas.height = depthheight;
  const depthContext = depthCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();

  if (kinect.constructor.name === 'KinectAzure') {
    // KINECT AZURE CODE
    if (kinect.open()) {
      const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED;
      kinect.startCameras({
        depth_mode: depthMode,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
      });

      const depthModeRange = kinect.getDepthModeRange(depthMode);

      kinect.startListening((data) => {
        const newPixelData = Buffer.from(
          data.depthImageFrame.imageData,
        );
        processAzureDepthBuffer(newPixelData, depthModeRange);

        const packagedData = prepareDataToSend(
          depthCanvas,
          depthContext,
          'webp',
          imgQuality,
          'depth',
        );
        sendToPeer('frame', packagedData);
      });
    }
  } else {
    // KINECT WINDOWS CODE
    if (kinect.open()) {
      kinect.on('depthFrame', function (newPixelData) {
        processDepthBuffer(newPixelData);

        const packagedData = prepareDataToSend(
          depthCanvas,
          depthContext,
          'webp',
          imgQuality,
          'depth',
        );
        sendToPeer('frame', packagedData);
      });
    }
    kinect.openDepthReader();
  }
}

function stopDepth() {
  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure
    console.log('stopping depth camera');
    kinect.stopCameras();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    // Kinect Windows
    console.log('stopping depth camera');
    kinect.closeDepthReader();
    kinect.removeAllListeners();
    canvasState = null;
    busy = false;
  }
}

function startRawDepth() {
  console.log('start Raw Depth Camera');

  const rawDepthCanvas = document.getElementById('raw-depth-canvas');
  rawDepthCanvas.width = rawdepthwidth;
  rawDepthCanvas.height = rawdepthheight;
  const rawDepthContext = rawDepthCanvas.getContext('2d');

  resetCanvas('raw');
  canvasState = 'raw';
  setImageData();

  rawDepth = true;

  if (kinect.constructor.name === 'KinectAzure') {
    // KINECT AZURE CODE
    if (kinect.open()) {
      console.log('kinect open');
      // UNBINNED has higher depth resolution at 640x576
      // const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED;
      // BINNED has lower resolution at 320x288
      const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_2X2BINNED;
      kinect.startCameras({
        depth_mode: depthMode,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
      });

      // let depthModeRange = kinect.getDepthModeRange(depthMode);

      kinect.startListening((data) => {
        const newPixelData = Buffer.from(
          data.depthImageFrame.imageData,
        );

        processRawDepthBuffer(newPixelData);

        const packagedData = prepareDataToSend(
          rawDepthCanvas,
          rawDepthContext,
          'webp',
          1,
          'rawDepth',
        );

        sendToPeer('rawDepth', packagedData, true);
      });
    }
  } else {
    // Windows Kinect
    if (kinect.open()) {
      kinect.on('rawDepthFrame', function (newPixelData) {
        processRawDepthBuffer(newPixelData);

        const packagedData = prepareDataToSend(
          rawDepthCanvas,
          rawDepthContext,
          'webp',
          1,
          'rawDepth',
        );

        // no frame limiting
        // sendToPeer('rawDepth', packagedData, true);

        // we need to limit frames sent to avoid overwhelming client
        // limit raw depth to 15fps
        const framesPerSecond = 15;
        const sendEvery = 1000 / framesPerSecond;

        if (Date.now() > sentTime + sendEvery) {
          sendToPeer('rawDepth', packagedData, true);
          sentTime = Date.now();
        }
      });
    }
    kinect.openRawDepthReader();
  }
}

function stopRawDepth() {
  console.log('stopping raw depth camera');

  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure
    console.log('stopping depth camera');
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
  console.log('starting infrared camera');

  const infraredCanvas = document.getElementById('infrared-canvas');
  infraredCanvas.width = depthwidth;
  infraredCanvas.height = depthheight;
  const infraredContext = infraredCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();

  if (kinect.open()) {
    kinect.on('infraredFrame', function (newPixelData) {
      if (busy) {
        return;
      }
      busy = true;

      processDepthBuffer(newPixelData);

      const packagedData = prepareDataToSend(
        infraredCanvas,
        infraredContext,
        'webp',
        imgQuality,
        'infrared',
      );

      sendToPeer('frame', packagedData);

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

  const leInfraredCanvas = document.getElementById(
    'le-infrared-canvas',
  );
  leInfraredCanvas.width = depthwidth;
  leInfraredCanvas.height = depthheight;
  const leInfraredContext = leInfraredCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';
  setImageData();

  if (kinect.open()) {
    kinect.on('longExposureInfraredFrame', function (newPixelData) {
      if (busy) {
        return;
      }
      busy = true;

      processDepthBuffer(newPixelData);

      const packagedData = prepareDataToSend(
        leInfraredCanvas,
        leInfraredContext,
        'webp',
        imgQuality,
        'LEinfrared',
      );
      sendToPeer('frame', packagedData);

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

function startRGBD() {
  console.log('starting rgbd');

  const rgbdCanvas = document.getElementById('rgbd-canvas');
  rgbdCanvas.width = rgbdwidth;
  rgbdCanvas.height = rgbdheight;
  const rgbdContext = rgbdCanvas.getContext('2d');

  resetCanvas('rgbd');
  canvasState = 'rgbd';

  setImageData();

  if (kinect.constructor.name === 'KinectAzure') {
    // KINECT AZURE CODE
    if (kinect.open()) {
      const depthMode = KinectAzure.K4A_DEPTH_MODE_WFOV_2X2BINNED; // wfov does better with image doubling
      kinect.startCameras({
        depth_mode: depthMode,
        color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
        include_color_to_depth: true,
      });

      const depthModeRange = kinect.getDepthModeRange(depthMode);

      kinect.startListening((data) => {
        const newDepthPixelData = Buffer.from(
          data.depthImageFrame.imageData,
        );

        const newBGRAPixelData = Buffer.from(
          data.colorToDepthImageFrame.imageData,
        );

        if (data.colorToDepthImageFrame.height === 0) return;
        processAzureRGBDBuffer(
          newDepthPixelData,
          newBGRAPixelData,
          depthModeRange,
        );

        const packagedData = prepareDataToSend(
          rgbdCanvas,
          rgbdContext,
          'webp',
          1.0,
          'rgbd',
        );
        sendToPeer('frame', packagedData);
      });
    }
  } else {
    // KINECT WINDOWS CODE
    if (kinect.open()) {
      kinect.on('multiSourceFrame', function (frame) {
        if (busy) {
          return;
        }

        busy = true;

        let j = 0;
        for (let i = 0; i < imageDataSize; i += 4) {
          imageDataArray[i] = frame.depthColor.buffer[i];
          imageDataArray[i + 1] = frame.depthColor.buffer[i + 1];
          imageDataArray[i + 2] = frame.depthColor.buffer[i + 2];
          imageDataArray[i + 3] = frame.depth.buffer[j]; // set alpha channel as depth
          j++;
        }

        const rgbdImg = drawImageToCanvas(
          rgbdCanvas,
          rgbdContext,
          'rgbd',
          'webp',
          0.1,
        );

        const packagedData = prepareDataToSend(
          rgbdCanvas,
          rgbdContext,
          'webp',
          0.1,
          'rgbd',
        );

        sendToPeer('frame', packagedData);

        // TODO: Still needed?
        setTimeout(function () {
          busy = false;
        });
      });
    }
    kinect.openMultiSourceReader({
      frameTypes:
        Kinect2.FrameType.depth | Kinect2.FrameType.depthColor,
    });
  }
}

function stopRGBD() {
  console.log('stopping rgbd');
  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure
    kinect.stopCameras();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    kinect.closeMultiSourceReader();
    kinect.removeAllListeners();
    canvasState = null;
    busy = false;
  }
}

function startSkeletonTracking() {
  console.log('starting skeleton');

  const skeletonCanvas = document.getElementById('skeleton-canvas');
  skeletonCanvas.width = depthwidth;
  skeletonCanvas.height = depthheight;
  const skeletonContext = skeletonCanvas.getContext('2d');

  resetCanvas('depth');
  canvasState = 'depth';

  if (kinect.constructor.name === 'KinectAzure') {
    if (kinect.open()) {
      // TODO: looks like the cameras need to be open for the tracker to work. true?
      kinect.startCameras({
        depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_30,
      });
      kinect.createTracker();
      kinect.startListening(function handleData(data) {
        if (data.bodyFrame.numBodies === 0) {
          return;
        }
        // normalizing 2d coordinates & remove unneeded image buffers
        let processedBodyFrame = processBodyFrame(data.bodyFrame);

        if (sendAllBodies) {
          sendToPeer('bodyFrame', processedBodyFrame);
          if (doRecord) {
            processedBodyFrame.record_startime = recordStartTime;
            processedBodyFrame.record_timestamp =
              Date.now() - recordStartTime;
            bodyChunks.push(processedBodyFrame);
          }
        }

        skeletonContext.clearRect(
          0,
          0,
          skeletonCanvas.width,
          skeletonCanvas.height,
        );

        let index = 0;
        processedBodyFrame.bodies.forEach(function drawBody(body) {
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
        });
      }); // listening
    } // open
  } else {
    // for windows kinect
    if (kinect.open()) {
      kinect.on('bodyFrame', function (bodyFrame) {
        if (sendAllBodies) {
          sendToPeer('bodyFrame', bodyFrame);
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
          skeletonCanvas.height,
        );
        let index = 0;
        bodyFrame.bodies.forEach(function (body) {
          if (body.tracked) {
            if (!sendAllBodies) {
              sendToPeer('trackedBodyFrame', body);
              if (doRecord) {
                body.record_startime = recordStartTime;
                body.record_timestamp = Date.now() - recordStartTime;
                bodyChunks.push(body);
              }
            }
            drawSkeleton(
              skeletonCanvas,
              skeletonContext,
              body,
              index,
            );
            index++;
          }
        });
      });
      kinect.openBodyReader();
    }
  }
} //tracking

function processBodyFrame(bodyFrame) {
  bodyFrame = removeUnusedImageFrames(bodyFrame);
  bodyFrame = normalizeSkeletonCoords(bodyFrame);
  return bodyFrame;
}

// Need to remove unused image frames because of error in packing
// empty array in peerjs/packer
// in peerjs see:     var length = blob.length || blob.byteLength || blob.size; returns undefined
function removeUnusedImageFrames(bodyFrame) {
  delete bodyFrame.bodyIndexMapImageFrame;
  delete bodyFrame.bodyIndexMapToColorImageFrame;
  return bodyFrame;
}

function normalizeSkeletonCoords(bodyFrame) {
  bodyFrame.bodies.forEach(function (body) {
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
  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure Code
    console.log('stopping skeleton');
    kinect.stopCameras();
    kinect.destroyTracker();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    // Kinect Windows Code
    console.log('stopping skeleton');
    kinect.closeBodyReader();
    kinect.removeAllListeners();
    canvasState = null;
  }
}

function displayCurrentFrames() {
  var allFrameDisplay =
    document.getElementsByClassName('current-frames');

  for (var i = 0; i < allFrameDisplay.length; i++) {
    allFrameDisplay[i].innerHTML = currentFrames;
  }
}

function startMulti(multiFrames) {
  console.log('starting multi');

  let options = { frameTypes: multiFrames };
  let multiToSend = {};

  displayCurrentFrames();

  multiFrame = true;
  if (kinect.open()) {
    kinect.on('multiSourceFrame', function (frame) {
      if (busy) {
        return;
      }
      busy = true;

      let newPixelData;
      let temp;

      if (frame.color) {
        let colorCanvas = document.getElementById('color-canvas');
        colorCanvas.width = colorwidth / 2;
        colorCanvas.height = colorheight / 2;
        let colorContext = colorCanvas.getContext('2d');

        resetCanvas('color');
        canvasState = 'color';
        setImageData();

        newPixelData = frame.color.buffer;
        processColorBuffer(newPixelData);

        let tempCanvas = drawImageToCanvas(colorCanvas, colorContext);
        let dataUrl = createDataUrl(tempCanvas, 'webp', imgQuality);
        multiToSend.color = dataUrl;
      }

      if (frame.body) {
        let skeletonCanvas =
          document.getElementById('skeleton-canvas');
        skeletonCanvas.width = depthwidth;
        skeletonCanvas.height = depthheight;
        let skeletonContext = skeletonCanvas.getContext('2d');

        if (doRecord) {
          frame.body.record_startime = recordStartTime;
          frame.body.record_timestamp = Date.now() - recordStartTime;
          bodyChunks.push(frame.body);
        }

        // index used to change colors on draw
        let index = 0;

        // draw tracked bodies
        skeletonContext.clearRect(
          0,
          0,
          skeletonCanvas.width,
          skeletonCanvas.height,
        );
        frame.body.bodies.forEach(function (body) {
          if (body.tracked) {
            drawSkeleton(
              skeletonCanvas,
              skeletonContext,
              body,
              index,
            );
            index++;
          }
        });

        multiToSend.body = frame.body.bodies;
      }

      if (frame.depth) {
        let depthCanvas = document.getElementById('depth-canvas');
        depthCanvas.width = depthwidth;
        depthCanvas.height = depthheight;
        let depthContext = depthCanvas.getContext('2d');

        resetCanvas('depth');
        canvasState = 'depth';
        setImageData();

        newPixelData = frame.depth.buffer;
        processDepthBuffer(newPixelData);

        let tempCanvas = drawImageToCanvas(depthCanvas, depthContext);
        let dataUrl = createDataUrl(tempCanvas, 'webp', imgQuality);

        multiToSend.depth = dataUrl;
      }

      if (frame.rawDepth) {
        let rawDepthCanvas = document.getElementById(
          'raw-depth-canvas',
        );
        rawDepthCanvas.width = rawdepthwidth;
        rawDepthCanvas.height = rawdepthheight;
        let rawDepthContext = rawDepthCanvas.getContext('2d');

        resetCanvas('raw');
        canvasState = 'raw';
        setImageData();

        newPixelData = frame.rawDepth.buffer;
        processRawDepthBuffer(newPixelData);
        temp = drawImageToCanvas(
          rawDepthCanvas,
          rawDepthContext,
          null,
          'webp',
          1,
        );
        multiToSend.rawDepth = temp;
      }

      //Frame rate limiting
      // if (Date.now() > sentTime + 40) {
      //   sendToPeer('multiFrame', multiToSend);
      //   sentTime = Date.now();
      // }

      // No Framerate limiting
      sendToPeer('multiFrame', multiToSend, true);

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

  const keyCanvas = document.getElementById('key-canvas');
  keyCanvas.width = colorwidth / 2;
  keyCanvas.height = colorheight / 2;
  const keyContext = keyCanvas.getContext('2d');

  resetCanvas('color');
  canvasState = 'color';
  setImageData();

  if (kinect.constructor.name === 'KinectAzure') {
    // KINECT AZURE
    if (kinect.open()) {
      kinect.startCameras({
        depth_mode: KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
        color_format: KinectAzure.K4A_IMAGE_FORMAT_COLOR_BGRA32,
        color_resolution: KinectAzure.K4A_COLOR_RESOLUTION_720P,
        include_depth_to_color: true,
        include_body_index_map: true,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
      });
      depthModeRange = kinect.getDepthModeRange(
        KinectAzure.K4A_DEPTH_MODE_NFOV_UNBINNED,
      );
      kinect.createTracker();

      kinect.startListening((data) => {
        processAzureKeyBuffer(
          data.colorImageFrame,
          data.bodyFrame.bodyIndexMapToColorImageFrame,
        );
        const packagedData = prepareDataToSend(
          keyCanvas,
          keyContext,
          'webp',
          imgQuality,
          'key',
        );
        sendToPeer('frame', packagedData);
      });
    }
  } else {
    // KINECT WINDOWS
    if (kinect.open()) {
      kinect.on('multiSourceFrame', function (frame) {
        if (busy) {
          return;
        }
        busy = true;

        const closestBodyIndex = getClosestBodyIndex(
          frame.body.bodies,
        );
        if (closestBodyIndex !== trackedBodyIndex) {
          if (closestBodyIndex > -1) {
            kinect.trackPixelsForBodyIndices([closestBodyIndex]);
          } else {
            kinect.trackPixelsForBodyIndices(false);
          }
        } else {
          if (closestBodyIndex > -1) {
            if (
              frame.bodyIndexColor.bodies[closestBodyIndex].buffer
            ) {
              newPixelData =
                frame.bodyIndexColor.bodies[closestBodyIndex].buffer;

              for (let i = 0; i < imageDataSize; i++) {
                imageDataArray[i] = newPixelData[i];
              }

              const packagedData = prepareDataToSend(
                keyCanvas,
                keyContext,
                'webp',
                imgQuality,
                'key',
              );
              sendToPeer('frame', packagedData);
            }
          }
        }
        trackedBodyIndex = closestBodyIndex;
        busy = false;
      }); // kinect.on
    } // open
    kinect.openMultiSourceReader({
      frameTypes:
        Kinect2.FrameType.bodyIndexColor | Kinect2.FrameType.body,
    });
  }
}

function stopKey() {
  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure
    console.log('stopping key');
    kinect.stopCameras();
    kinect.destroyTracker();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  } else {
    // Kinect Windows
    console.log('stopping key');
    kinect.closeMultiSourceReader();
    kinect.removeAllListeners();
    canvasState = null;
    busy = false;
  }
}

function startDepthKey() {
  console.log('starting depth key');

  const depthKeyCanvas = document.getElementById('depth-key-canvas');
  depthKeyCanvas.width = rawdepthwidth;
  depthKeyCanvas.height = rawdepthheight;
  const depthKeyContext = depthKeyCanvas.getContext('2d');

  resetCanvas('raw');
  canvasState = 'raw';
  setImageData();

  if (kinect.constructor.name === 'KinectAzure') {
    // KINECT AZURE
    if (kinect.open()) {
      const depthMode = KinectAzure.K4A_DEPTH_MODE_NFOV_2X2BINNED;
      kinect.startCameras({
        depth_mode: depthMode,
        include_body_index_map: true,
        camera_fps: KinectAzure.K4A_FRAMES_PER_SECOND_15,
      });

      kinect.createTracker();

      kinect.startListening((data) => {
        const depthBuffer = Buffer.from(
          data.depthImageFrame.imageData,
        );
        const indexMapBuffer = Buffer.from(
          data.bodyFrame.bodyIndexMapImageFrame.imageData,
        );

        processAzureDepthKeyBuffer(depthBuffer, indexMapBuffer);

        const packagedData = prepareDataToSend(
          depthKeyCanvas,
          depthKeyContext,
          'webp',
          1,
          'depthkey',
        );
        sendToPeer('depthKey', packagedData, true);
      });
    }
  }
}

function stopDepthKey() {
  if (kinect.constructor.name === 'KinectAzure') {
    // Kinect Azure
    console.log('stopping key');
    kinect.stopCameras();
    kinect.destroyTracker();
    kinect.stopListening();
    canvasState = null;
    busy = false;
  }
}

function setImageData() {
  imageData = context.createImageData(canvas.width, canvas.height);
  imageDataSize = imageData.data.length;
  imageDataArray = imageData.data;
}

function resetCanvas(size) {
  context.clearRect(0, 0, canvas.width, canvas.height);

  switch (size) {
    case 'depth':
      canvas.width = depthwidth;
      canvas.height = depthheight;
      break;

    case 'color':
      canvas.width = colorwidth;
      canvas.height = colorheight;
      break;

    case 'raw':
      canvas.width = rawdepthwidth;
      canvas.height = rawdepthheight;
      break;

    case 'rgbd':
      canvas.width = rgbdwidth;
      canvas.height = rgbdheight;
      break;
  }
}

function prepareDataToSend(
  inCanvas,
  inContext,
  imageType,
  quality,
  frameType,
) {
  const tempCanvas = drawImageToCanvas(inCanvas, inContext);
  const dataUrl = createDataUrl(tempCanvas, imageType, quality);
  const packagedData = packageData(frameType, dataUrl);
  return packagedData;
}

function drawImageToCanvas(inCanvas, inContext) {
  context.putImageData(imageData, 0, 0);
  inContext.clearRect(0, 0, inCanvas.width, inCanvas.height);
  inContext.drawImage(canvas, 0, 0, inCanvas.width, inCanvas.height);

  return inCanvas;
}

function createDataUrl(inCanvas, imageType, quality) {
  let imageQuality = imgQuality; //use globally stored image quality variable

  if (typeof quality !== 'undefined') imageQuality = quality; // or replace image quality with stream default

  const outputCanvasData = inCanvas.toDataURL(
    'image/' + imageType,
    imageQuality,
  );

  return outputCanvasData;
}

function packageData(frameType, outputCanvasData) {
  const dataToSend = { name: frameType, imagedata: outputCanvasData };
  return dataToSend;
}

function processColorBuffer(newPixelData) {
  for (let i = 0; i < imageDataSize; i++) {
    imageDataArray[i] = newPixelData[i];
  }
}

function processDepthBuffer(newPixelData) {
  let j = 0;

  for (let i = 0; i < imageDataSize; i += 4) {
    imageDataArray[i] = newPixelData[j];
    imageDataArray[i + 1] = newPixelData[j];
    imageDataArray[i + 2] = newPixelData[j];
    imageDataArray[i + 3] = 0xff; // set alpha channel at full opacity
    j++;
  }
}

// creates grayscale 0-255 depth image
function processAzureDepthBuffer(newPixelData, depthRange) {
  let depthPixelIndex = 0;

  for (let i = 0; i < imageDataSize; i += 4) {
    // iterate by 4 through pixel array

    const depthValue =
      (newPixelData[depthPixelIndex + 1] << 8) |
      newPixelData[depthPixelIndex]; // get 16 bit depth value into an integer

    // map that integer from depth range to 255-0 / grayscale
    const normalizedValue = map(
      depthValue,
      depthRange.min,
      depthRange.max,
      255,
      0,
    );
    imageDataArray[i] = normalizedValue;
    imageDataArray[i + 1] = normalizedValue;
    imageDataArray[i + 2] = normalizedValue;
    imageDataArray[i + 3] = 0xff;

    depthPixelIndex += 2;
  }
}

function processAzureRGBDBuffer(depthBuffer, bgraBuffer, depthRange) {
  let depthPixelIndex = 0;

  for (let i = 0; i < imageDataSize; i += 4) {
    // iterate by 4 through pixel array

    const depthValue =
      (depthBuffer[depthPixelIndex + 1] << 8) |
      depthBuffer[depthPixelIndex]; // get 16 bit depth value into an integer

    // map that integer from depth range to 255-0 / grayscale
    const normalizedDepthValue = map(
      depthValue,
      depthRange.min,
      depthRange.max,
      255,
      0,
    );
    imageDataArray[i] = bgraBuffer[i + 2];
    imageDataArray[i + 1] = bgraBuffer[i + 1];
    imageDataArray[i + 2] = bgraBuffer[i + 0];
    imageDataArray[i + 3] = normalizedDepthValue;

    depthPixelIndex += 2;
  }
}

function processAzureDepthKeyBuffer(depthBuffer, bodyIndexBuffer) {
  let depthPixelIndex = 0;
  let bodyPixelIndex = 0;

  for (let i = 0; i < imageDataSize; i += 4) {
    const bodyIndexValue = bodyIndexBuffer[bodyPixelIndex]; // getting value from index map

    if (
      // this is not a body
      // see https://docs.microsoft.com/en-us/azure/kinect-dk/body-index-map
      bodyIndexValue !== KinectAzure.K4ABT_BODY_INDEX_MAP_BACKGROUND
    ) {
      imageDataArray[i] = depthBuffer[depthPixelIndex];
      imageDataArray[i + 1] = depthBuffer[depthPixelIndex + 1];
      imageDataArray[i + 2] = 0;
      imageDataArray[i + 3] = 0xff;
    } else {
      imageDataArray[i] = 0;
      imageDataArray[i + 1] = 0;
      imageDataArray[i + 2] = 0;
      imageDataArray[i + 3] = 0xff;
    }

    depthPixelIndex += 2;
    bodyPixelIndex++;
  }
}

// see body index map color mask example from https://github.com/wouterverweirder/kinect-azure/
function processAzureKeyBuffer(
  imageFrame,
  bodyIndexMapToColorImageFrame,
) {
  const newPixelData = Buffer.from(imageFrame.imageData); // color image buffer
  const newBodyIndexData = Buffer.from(
    bodyIndexMapToColorImageFrame.imageData,
  ); // body index map to color buffer
  let bodyIndexPixelIndex = 0;
  for (let i = 0; i < imageDataSize; i += 4) {
    // iterates the image pixels by 4
    const bodyIndexValue = newBodyIndexData[bodyIndexPixelIndex]; // gets value from body index map
    // if this is a body
    if (
      // this is not a body
      // see https://docs.microsoft.com/en-us/azure/kinect-dk/body-index-map
      bodyIndexValue !== KinectAzure.K4ABT_BODY_INDEX_MAP_BACKGROUND
    ) {
      // get the pixel data from the color image
      // image comes in bgra rather than rgba and needs to be reversed
      imageDataArray[i] = newPixelData[i + 2]; // r // b
      imageDataArray[i + 1] = newPixelData[i + 1]; // g // g
      imageDataArray[i + 2] = newPixelData[i]; // b //r
      imageDataArray[i + 3] = 0xff; //a //a
    } else {
      // otherwise it's black
      imageDataArray[i] = 0;
      imageDataArray[i + 1] = 0;
      imageDataArray[i + 2] = 0;
      imageDataArray[i + 3] = 0; // make it transparent
    }
    bodyIndexPixelIndex++; // iterates the body index pixels by 1
  }
}

const map = (value, inputMin, inputMax, outputMin, outputMax) => {
  return (
    ((value - inputMin) * (outputMax - outputMin)) /
      (inputMax - inputMin) +
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

function drawSkeleton(inCanvas, inContext, body, index) {
  // Skeleton variables
  let colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#00ffff',
    '#ff00ff',
  ];
  //draw joints

  // for azure kinect
  if (kinect.constructor.name === 'KinectAzure') {
    for (let i = 0; i < body.skeleton.joints.length; i++) {
      let joint = body.skeleton.joints[i];
      inContext.fillStyle = colors[index];
      inContext.fillRect(
        joint.depthX * inCanvas.width,
        joint.depthY * inCanvas.height,
        10,
        10,
      );
    }

    // for windows kinect
  } else {
    for (var jointType in body.joints) {
      var joint = body.joints[jointType];
      inContext.fillStyle = colors[index];
      inContext.fillRect(
        joint.depthX * inCanvas.width,
        joint.depthY * inCanvas.height,
        10,
        10,
      );
    }

    //draw hand states
    updateHandState(
      inContext,
      body.leftHandState,
      body.joints[Kinect2.JointType.handLeft],
    );
    updateHandState(
      inContext,
      body.rightHandState,
      body.joints[Kinect2.JointType.handRight],
    );
  }
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
  var handData = {
    depthX: jointPoint.depthX,
    depthY: jointPoint.depthY,
    handColor: handColor,
    handSize: HANDSIZE,
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
    true,
  );
  context.fill();
  context.closePath();
  context.globalAlpha = 1;
}
