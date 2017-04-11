(function(window) {

// Import Peer.js 
var Peer = require('peerjs');

Kinectron = function(arg1, arg2) {  
  this.img = null;
  this.feed = null;
  this.body = null;
  this.jointName = null;

  this.rgbCallback = null; // rgb depricated 3/16/17 use color instead
  this.colorCallback = null;
  this.depthCallback = null;
  this.rawDepthCallback = null;
  this.infraredCallback = null;
  this.leInfraredCallback = null; 
  this.bodiesCallback = null;
  this.trackedBodiesCallback = null;
  this.trackedJointCallback = null;
  this.keyCallback = null;
  this.fhCallback = null;
  this.multiFrameCallback = null;

  // Joint Name Constants
  this.SPINEBASE = 0;
  this.SPINEMID = 1;
  this.NECK = 2;
  this.HEAD = 3;
  this.SHOULDERLEFT = 4;
  this.ELBOWLEFT = 5;
  this.WRISTLEFT = 6;
  this.HANDLEFT = 7;
  this.SHOULDERRIGHT = 8;
  this.ELBOWRIGHT = 9;
  this.WRISTRIGHT = 10;
  this.HANDRIGHT = 11;
  this.HIPLEFT = 12;
  this.KNEELEFT = 13;
  this.ANKLELEFT = 14;
  this.FOOTLEFT = 15;
  this.HIPRIGHT = 16;
  this.KNEERIGHT = 17;
  this.ANKLERIGHT = 18;
  this.FOOTRIGHT = 19;
  this.SPINESHOULDER = 20;
  this.HANDTIPLEFT  = 21;
  this.THUMBLEFT = 22;
  this.HANDTIPRIGHT = 23;
  this.THUMBRIGHT = 24;

  var COLORWIDTH = 960;
  var COLORHEIGHT = 540;

  var DEPTHWIDTH = 512;
  var DEPTHHEIGHT = 424; 
  
  // Processing raw depth indicator
  var busy = false;

  // Running multiframe indicator
  var multiFrame = false;
  var currentFrames = [];

  // Hold initital frame request until peer connection ready
  var ready = false;
  var holdInitFeed = null;

  // Peer variables and defaults 
  var peer = null;
  var connection = null;
  var peerNet = {host: 'localhost', port: 9001, path: '/'}; // Connect to localhost by default
  var peerId = 'kinectron'; // Connect to peer Id Kinectron by default 

  // Hidden div variables
  var myDiv = null;

  // Record variables
  var doRecord = false;
  var recordStartTime = 0;
  var bodyChunks = [];
  var rawDepthChunks = [];
  var mediaRecorders = [];

  // Check for ip address in "quickstart" method  
  if (typeof arg1 !=="undefined" && typeof arg2 == "undefined") {
    var host = arg1;
    peerNet.host = host;

    // Check for new network provided by user
  } else if (typeof arg1 !== "undefined" && typeof arg2 !== "undefined") {
    var peerid = arg1;
    var network = arg2;
    peerId = peerid;
    peerNet = network;
  } 

  // Create new peer
  peer = new Peer(peerNet);
  
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

  peer.on('connection', function(connection) {
    connection.on('open', function() {
      console.log("Peer js is connected");
    });
  });
  
  // Create hidden image to draw to
  myDiv = document.createElement("div");
  myDiv.style.visibility = "hidden";
  document.body.appendChild(myDiv);

  this.img = document.createElement("img");
  myDiv.appendChild(this.img);

  // Used for raw depth processing. 
  // TO DO refactor: create dynamically in process raw depth
  hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.width = 512;
  hiddenCanvas.height = 424;
  hiddenContext = hiddenCanvas.getContext("2d");
  hiddenContext.fillStyle = 'green';
  hiddenContext.fillRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
  hiddenImage = document.createElement("img");

  myDiv.appendChild(hiddenCanvas);
  myDiv.appendChild(hiddenImage);

  // Make peer connection
  this.makeConnection = function() {
    connection = peer.connect(peerId); // get a webrtc DataConnection
    connection.on('open', function(data) {
      console.log("Open data connection with server");
    });

    // Route incoming traffic from Kinectron
    connection.on('data', function(dataReceived) {
      var data = dataReceived.data;
      
      switch (dataReceived.event) {
        // Wait for ready from Kinectron to initialize
        case 'ready':
          ready = true;

          if (holdInitFeed) {
            connection.send(holdInitFeed);
            holdInitFeed = null;
          }

        break;

        // If image data draw image
        case 'frame':
          this.img.src = data.imagedata;
          this._chooseCallback(data.name);
          
          if (doRecord) this._drawImageToCanvas(data.name);
        break;
        
        // If receive all bodies, send all bodies
        case 'bodyFrame':
          this.bodiesCallback(data);

          if (doRecord) {
            data.record_startime = recordStartTime;
            data.record_timestamp = Date.now() - recordStartTime;
            bodyChunks.push(data);  
          }
        break;
 
        // If receive tracked skeleton data, send skeleton
        case 'trackedBodyFrame':
          this.body = data;

          // If joint specified send joint and call joint callback
          if (this.jointName && this.trackedJointCallback && this.body.joints[this.jointName] !== 0) {
            var joint = this.body.joints[this.jointName]; 
            joint.trackingId  = this.body.trackingId;
            this.trackedJointCallback(joint);
            
            if (doRecord) {
              joint.record_startime = recordStartTime;
              joint.record_timestamp = Date.now() - recordStartTime;
              bodyChunks.push(joint);
            }
          // Or call tracked bodies callback on invidual tracked body
          } else if (this.trackedBodiesCallback) {
            this.trackedBodiesCallback(data);

            if (doRecord) {
              data.record_startime = recordStartTime;
              data.record_timestamp = Date.now() - recordStartTime;
              bodyChunks.push(data);
            }
          }
        break;

        // If floor height, draw left hand and height
        case 'floorHeightTracker':
          this.fhCallback(data);
        break;

        case 'rawDepth':
          var processedData = this._processRawDepth(data);
          this.rawDepthCallback(processedData);

          if (doRecord) {
            var recordedData = {};
            recordedData.data = processedData;
            recordedData.record_startime = recordStartTime;
            recordedData.record_timestamp = Date.now() - recordStartTime;
            rawDepthChunks.push(recordedData);
          }

        break;

        case 'multiFrame':
          if (data.rawDepth) {
            var processedRawDepthData = this._processRawDepth(data.rawDepth);
            data.rawDepth = processedRawDepthData;
           }

          if (this.multiFrameCallback) {
            this.multiFrameCallback(data);

            if (doRecord) {
              if (data.color) {
                this.img.src = data.color;
                this._drawImageToCanvas('color');
              } 
              
              if (data.depth) {
                this.img.src = data.depth;
                this._drawImageToCanvas('depth');
              } 

              if (data.body) {
                data.body.record_startime = recordStartTime;
                data.body.record_timestamp = Date.now() - recordStartTime;
                bodyChunks.push(data.body);  
              } 

              if (data.rawDepth) {
                var recordedData2 = {};
                recordedData2.data = data.rawDepth;
                recordedData2.record_startime = recordStartTime;
                recordedData2.record_timestamp = Date.now() - recordStartTime;
                rawDepthChunks.push(recordedData2);
              }
            }
          } else {
            if (data.color) {
              this.img.src = data.color;
              this.colorCallback(this.img);
              
              if (doRecord) this._drawImageToCanvas('color');
            }

            if (data.depth) {
              this.img.src = data.depth;
              this.depthCallback(this.img);
             
              if (doRecord) this._drawImageToCanvas('depth');
            }

            if (data.body) {
              this.bodiesCallback(data.body);
              
              if (doRecord) {
                data.body.record_startime = recordStartTime;
                data.body.record_timestamp = Date.now() - recordStartTime;
                bodyChunks.push(data.body);  
              }
            }

            if (data.rawDepth) {
             this.rawDepthCallback(data.rawDepth);

              if (doRecord) {
                var recordedData3 = {};
                recordedData3.data = data.rawDepth;
                recordedData3.record_startime = recordStartTime;
                recordedData3.record_timestamp = Date.now() - recordStartTime;
                rawDepthChunks.push(recordedData3);
              }
            }

          }
        break;
      }
    }.bind(this));
  };

  // Changed RGB to Color to be consistent with SDK, RGB depricated 3/16/17
  this.startRGB = function(callback) {
    console.warn('startRGB no longer in use. Use startColor instead');
    if (callback) { 
      this.colorCallback = callback;
    }
    
    this._setFeed('color');
  };

  this.startColor = function(callback) {
    if (callback) {
      this.colorCallback = callback;
    }
    this._setFeed('color');
  };

  this.startDepth = function(callback) {
    if (callback) {
      this.depthCallback = callback;  
    } 

    this._setFeed('depth');
  };

  this.startRawDepth = function(callback) {
    if (callback) {
      this.rawDepthCallback = callback;  
    } 

    this._setFeed('raw-depth');
  };


  this.startInfrared = function(callback) {
    if (callback) {
      this.infraredCallback = callback;
    }
    
    this._setFeed('infrared');
  };

  this.startLEInfrared = function(callback) {
    if (callback) {
      this.leInfraredCallback = callback;  
    }
    
    this._setFeed('le-infrared');
  };

  this.startBodies = function(callback) {
    if (callback) {
      this.bodiesCallback = callback;  
    }
    
    this._setFeed('body');
  };

  this.startTrackedBodies = function(callback) {
    if (callback) {
      this.trackedBodiesCallback = callback;  
    }
    
    // Reset tracked joint variables
    this.jointName = null;
    this.trackedJointCallback = null;

    this._setFeed('skeleton');
  };
  
  this.startTrackedJoint = function(jointName, callback) {
    if (typeof jointName == 'undefined') {
       console.warn("Joint name does not exist.");
       return;
    }

    if (jointName && callback) {
      this.jointName = jointName;
      this.trackedJointCallback = callback;
    }

    this._setFeed('skeleton');
  };

  this.startMultiFrame = function(frames, callback) {
    if (typeof callback !== "undefined") {
      this.multiFrameCallback = callback;
    } else if (typeof callback == "undefined") {
      this.multiFrameCallback = null;
    }

    multiFrame = true;
    currentFrames = frames;

    this._sendToPeer('multi', frames);     
  };

  this.startKey = function(callback) {
    if (callback) {
      this.keyCallback = callback;  
    }
    
    this._setFeed('key');
  };

  // this.startScale = function(callback) {
  //   this.callback = callback;
  //   this._setFeed('scale');
  // };

  // this.startFloorHeight = function(callback) {
  //   if (callback) {
  //     this.fhCallback = callback;  
  //   }
    
  //   this._setFeed('fh-joint');
  // };

  // Stop all feeds
  this.stopAll = function() {
    this._setFeed('stop-all');
  };

  // Set Callbacks 

  // Changed RGB to Color to be consistent with SDK, RGB depricated 3/16/17
  this.setRGBCallback = function(callback) {
    console.warn('setRGBCallback no longer in use. Use setColorCallback instead');
    this.colorCallback = callback;
  };

  this.setColorCallback = function(callback) {
    this.colorCallback = callback;
  };

  this.setDepthCallback = function(callback) {
    this.depthCallback = callback;
  };

  this.setRawDepthCallback = function(callback) {
    this.rawDepthCallback = callback;
  };

  this.setInfraredCallback = function(callback) {
    this.infraredCallback = callback;  
  };
  
  this.setLeInfraredCallback = function(callback) {
    this.leInfraredCallback = callback; 
  };

  this.setBodiesCallback = function(callback) {
    this.bodiesCallback = callback;  
  };
  
  this.setTrackedBodiesCallback = function(callback) {
    this.trackedBodiesCallback = callback;  
  };
  
  this.setKeyCallback = function(callback) {
    this.keyCallback = callback;
  };

  this.setFhCallback = function(callback) {
    this.fhCallback = callback;  
  };

  this.setMultiFrameCallback = function(callback) {
    this.multiFrameCallback = callback;
  };
  
  this.getJoints = function(callback) {
    var jointCallback = callback;
    var joint = null;

    for(var jointType in this.body.joints) {
      joint = this.body.joints[jointType];
      jointCallback(joint);
    }
  };
  
  this.getHands = function(callback) {
    var handCallback = callback;
    var leftHand = this.body.joints[7];
    var rightHand = this.body.joints[11];
    var leftHandState = this._getHandState(this.body.leftHandState);
    var rightHandState = this._getHandState(this.body.rightHandState);
    var hands = { 
      leftHand: leftHand,
      rightHand: rightHand,
      leftHandState: leftHandState,
      rightHandState: rightHandState
    };

    handCallback(hands);
  };

  this.startRecord = function() {
    console.log('Starting record');
    this._record();
  };

  this.stopRecord = function() {
    console.log('Ending record');
    this._record();
  };

  this.startServerRecord = function() {
    console.log('Starting recording on your server');
    this._sendToPeer('record', 'start');
  };

  this.stopServerRecord = function() {
    console.log('Ending recording on your server');
    this._sendToPeer('record', 'stop');
  };


  // Private functions //

  // Change feed on user input
  this._setFeed = function(feed) {
    var dataToSend = null;
    this.feed = feed;
    dataToSend = {
      feed: this.feed
    };

    // Reset multiframe
    multiFrame = false;

    this._sendToPeer('feed', dataToSend);
  };

  // Send data to peer
  this._sendToPeer = function(evt, data) {
    var dataToSend = {
      event: evt, 
      data: data
    };

    // If connection not ready, wait for connection
    if (!ready) { 
      holdInitFeed = dataToSend;
      return;
    }
    connection.send(dataToSend);
  };

  // Choose callback for image-based frames
  this._chooseCallback = function(frame) {
    switch (frame) {
      case 'color':
        this.colorCallback(this.img);
      break;

      case 'depth':
        this.depthCallback(this.img);
      break;

      case 'infrared':
        this.infraredCallback(this.img);
      break;

      case 'LEinfrared':
        this.leInfraredCallback(this.img);
      break;

      case 'key':
        this.keyCallback(this.img);
      break;
    }
  };

  // Make handstate more readable
  this._getHandState = function(handState) {
    switch (handState) {
      case 0:
        return 'unknown';

      case 1:
        return 'notTracked';

      case 2:
        return 'open';

      case 3:
        return 'closed';

      case 4:
        return 'lasso';
    }
  };

  this._processRawDepth = function(data) {
    if (busy) return;
    busy = true;
    var imageData;
    var depthBuffer;
    var processedData = [];

    var newImg = new Image();
    newImg.src = data;

    newImg.onload = function () {
      hiddenContext.clearRect(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
      hiddenContext.drawImage(newImg, 0, 0);
    }.bind(this);

    imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
    
    for(var i = 0; i < imageData.data.length; i+=4) {
      var depth = (imageData.data[i+1] << 8) + imageData.data[i]; //get uint16 data from buffer
      processedData.push(depth);
    }

    busy = false;
    return processedData;
  };

    // Toggle Recording
  this._record = function() {
    if (!doRecord) {

      // If no feed started, send warning and return
      if ((multiFrame === false && this.feed === null) || this.feed === 'stop-all') {
        console.warn("Record does not work until a feed is started");
        return;
      }

      var framesToRecord = [];

      // How many recorders needed
      if (multiFrame) {
        for (var i = 0; i < currentFrames.length; i++) {
          framesToRecord.push(currentFrames[i]);
        }
      } else {
        framesToRecord.push(this.feed);
      }

      // Create one media recorder for each feed
      for (var j = 0; j < framesToRecord.length; j++) {
        mediaRecorders.push(this._createMediaRecorder(framesToRecord[j]));
      }
      
      recordStartTime = Date.now();
      doRecord = true;

    } else {
      doRecord = false;
      
      // Stop all mediarecorders and remove them from array
      for (var k = mediaRecorders.length - 1; k >= 0; k--) {
        mediaRecorders[k].stop();  
        mediaRecorders.splice(k, 1);
      } 

    }
  };

  this._drawImageToCanvas = function(frame) {
    var tempContext;

    // Look through media recorders for the correct canvas to draw to
    for (var k = 0; k < mediaRecorders.length; k++) {
      var id = mediaRecorders[k].canvas.id;
      if (id.indexOf(frame) >= 0) {
       tempContext = mediaRecorders[k].canvas.getContext("2d"); 
      }
    }
    
    // Draw to the appropriate canvas
    tempContext.drawImage(this.img, 0, 0);
  };

  this._createMediaRecorder = function(frame) {
    var newMediaRecorder;

    // Create hidden canvas to draw to
    newHiddenCanvas = document.createElement("canvas");
    newHiddenCanvas.setAttribute('id', frame + Date.now());

    if (frame == 'color' || frame == 'key') {
      newHiddenCanvas.width = COLORWIDTH;
      newHiddenCanvas.height = COLORHEIGHT;
    } else {
      newHiddenCanvas.width = DEPTHWIDTH;
      newHiddenCanvas.height = DEPTHHEIGHT;
    }

    newHiddenContext = hiddenCanvas.getContext("2d");
    newHiddenContext.fillRect(0, 0, newHiddenCanvas.width, newHiddenCanvas.height);
    
    // Add canvas to hidden div
    myDiv.appendChild(newHiddenCanvas);

    // Create media recorder, add canvas to recorder
    newMediaRecorder = new MediaRecorder(newHiddenCanvas.captureStream());
    newMediaRecorder.canvas = newHiddenCanvas;
    
    var mediaChunks = [];

    newMediaRecorder.onstop = function (e) {

      // If skeleton data is being tracked, write out the body frames to JSON
      if (frame == 'body' || frame == 'skeleton') {
        var blobJson = new Blob([JSON.stringify(bodyChunks)], {type : 'application/json'});
        var jsonUrl = URL.createObjectURL(blobJson);
        var a2 = document.createElement('a');
        document.body.appendChild(a2);
        a2.style = 'display: none';
        a2.href = jsonUrl;
        a2.download = frame + Date.now() + '.json';
        a2.click();
        window.URL.revokeObjectURL(jsonUrl);

        // Reset body chunks
        bodyChunks.length = 0;   
      
      // If raw depth data tracked, write out to JSON       
      } else if (frame == 'raw-depth') {
        var blobJsonRd = new Blob([JSON.stringify(rawDepthChunks)], {type : 'application/json'});
        var jsonRdUrl = URL.createObjectURL(blobJsonRd);
        var a3 = document.createElement('a');
        document.body.appendChild(a3);
        a3.style = 'display: none';
        a3.href = jsonRdUrl;
        a3.download = frame + Date.now() + '.json';
        a3.click();
        window.URL.revokeObjectURL(jsonRdUrl);

        // Reset body chunks
        rawDepthChunks.length = 0;  

      // If video display the video on the page
      } else {
        
        // The video as a blob
        var blobVideo = new Blob(mediaChunks, { 'type' : 'video/webm' });

        // Draw video to screen
        // var videoElement = document.createElement('video');
        // videoElement.setAttribute("id", Date.now());
        // videoElement.controls = true;
        // document.body.appendChild(videoElement);
        // videoElement.src = window.URL.createObjectURL(blobVideo);

        // Download the video 
        var url = URL.createObjectURL(blobVideo);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = frame + Date.now() + '.webm';
        a.click();
        window.URL.revokeObjectURL(url);

        // Reset media chunks
        mediaChunks.length = 0;    
      }


    }.bind(this);

    // When video data is available
    newMediaRecorder.ondataavailable = function(e) {
      mediaChunks.push(e.data);
    };

    // Start recording
    newMediaRecorder.start();
    return newMediaRecorder;
  };


  
};

})(window);