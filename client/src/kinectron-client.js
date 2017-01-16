(function(window) {

// Import Peer.js 
var Peer = require('peerjs');

Kinectron = function(arg1, arg2) {  
  this.img = null;
  this.feed = null;
  this.body = null;
  this.jointName = null;

  this.rgbCallback = null;
  this.depthCallback = null;
  this.rawDepthCallback = null;
  this.infraredCallback = null;
  this.leInfraredCallback = null; 
  this.bodiesCallback = null;
  this.trackedBodiesCallback = null;
  this.trackedJointCallback = null;
  this.keyCallback = null;
  this.fhCallback = null;
  this.multiFrameCallBack = null;

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
  
  // Processing raw depth indicator
  var busy = false;

  // Used to hold initital frame request when peer connection ready
  var ready = false;
  var holdInitFeed = null;

  // Peer variables and defaults 
  var peer = null;
  var connection = null;
  var peerNet = {host: 'localhost', port: 9001, path: '/'}; // Connect to localhost by default
  var peerId = 'kinectron'; // Connect to peer Id Kinectron by default 

  // Hidden div variables
  var myDiv = null;

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
  this.img = document.createElement("img");
  myDiv.appendChild(this.img);

  hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.width = 512;
  hiddenCanvas.height = 424;
  hiddenContext = hiddenCanvas.getContext("2d");
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
        break;
        
        // If skeleton data, send skeleton
        case 'bodyFrame':
          this.bodiesCallback(data);
        break;
 
        // If tracked skeleton data, send skeleton
        case 'trackedBodyFrame':
          this.body = data;

          // Check that joint exists
          // TO DO Why does joint come in as 0 when undefined
          if (this.jointName && this.trackedJointCallback && this.body.joints[this.jointName] !== 0) {
            var joint = this.body.joints[this.jointName]; 

            joint.trackingId  = this.body.trackingId;
            this.trackedJointCallback(joint);
            
          }

          if (this.trackedBodiesCallback) {
            this.trackedBodiesCallback(data);
          }
        break;

        // If floor height, draw left hand and height
        case 'floorHeightTracker':
          this.fhCallback(data);
        break;

        case 'rawDepth':
          var processedData = this._processRawDepth(data);
          this.rawDepthCallback(processedData);
        break;

        case 'multiFrame':
          if (data.rawDepth) {
            var processedRawDepthData = this._processRawDepth(data.rawDepth);
            data.rawDepth = processedRawDepthData;
           }

          if (this.multiFrameCallBack) {
            this.multiFrameCallBack(data);

          } else {
            if (data.color) {
              this.img.src = data.color;
              this.rgbCallback(this.img);
            }

            if (data.depth) {
              this.img.src = data.depth;
              this.depthCallback(this.img);
            }

            if (data.body) {
              this.bodiesCallback(data.body);
            }

            if (data.rawDepth) {
             this.rawDepthCallback(data.rawDepth);
            }

          }
        break;

      }
    }.bind(this));
  };

  this.startRGB = function(callback) {
    if (callback) { 
      this.rgbCallback = callback;
    }
    
    this._setFeed('rgb');
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
      this.multiFrameCallBack = callback;
    } else if (typeof callback == "undefined") {
      this.multiFrameCallBack = null;
    }

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

  this.startFloorHeight = function(callback) {
    if (callback) {
      this.fhCallback = callback;  
    }
    
    this._setFeed('fh-joint');
  };

  // Stop all feeds
  this.stopAll = function() {
    this._setFeed('stop-all');
  };

  // Set Callbacks 
  this.setRGBCallback = function(callback) {
    this.rgbCallback = callback;
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


  // Private functions //

  // Change feed on user input
  this._setFeed = function(feed) {
    var dataToSend = null;
   
    this.feed = feed;
    dataToSend = {
      feed: this.feed
    };
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
        this.rgbCallback(this.img);
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


  // TO DO -- Confirm output from rawDepth is correct
  this._processRawDepth = function(data) {
    if (busy) return;
    busy = true;
    var imageData;
    var depthBuffer;
    var processedData = [];

    hiddenImage.src = data;
    hiddenContext.clearRect(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
    hiddenContext.drawImage(hiddenImage, 0, 0);
    imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
    depthBuffer = imageData.data;

    for(var i = 0; i < depthBuffer.length; i+=4) {
      var depth = (depthBuffer[i+1] << 8) + depthBuffer[i]; //get uint16 data from buffer
      processedData.push(depth);
    }

    busy = false;
    return processedData;
  };
};

})(window);