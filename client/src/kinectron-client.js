(function(window) {

// Import Peer.js 
var Peer = require('peerjs');

Kinectron = function(peerid, network) {  
  this.img = null;
  this.feed = null;
  this.body = null;

  this.rgbCallback = null;
  this.depthCallback = null;
  //this.rawDepthCallback = null;
  this.infraredCallback = null;
  this.leInfraredCallback = null; 
  this.bodiesCallback = null;
  this.trackedBodiesCallback = null;
  this.keyCallback = null;
  this.fhCallback = null;

  // Peer variables 
  var peer = null;
  var connection = null;
  var peerNet = null;
  var peerId = null;

  // Hidden div variables
  var myDiv = null;
  
  // Connect to peer over local host by default
  if (network) {
    peerNet = network;
  } else {
    peerNet = {host: 'localhost', port: 9001, path: '/'};
  }

  if (peerid) {
    peerId = peerid;
  } else {
    peerId = 'kinectron';
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

  // // Create hidden canvas to draw and process rawDepth
  // var hiddenDiv;
  // var hiddenCanvas;
  // var hiddenContext;
  // var hiddenImage;
  
  //hiddenDiv = document.createElement("div");
  //hiddenDiv.style.visibility = "hidden";

  hiddenCanvas = document.createElement("canvas");
  hiddenCanvas.width = 512;
  hiddenCanvas.height = 212;
  hiddenContext = hiddenCanvas.getContext("2d");
  hiddenImage = document.createElement("img");

  myDiv.appendChild(hiddenCanvas);
  myDiv.appendChild(hiddenImage);
  // hiddenDiv.appendChild(hiddenCanvas);
  // hiddenDiv.appendChild(hiddenImage);

  // FOR TESTING RAW DEPTH ONLY
  // var testCanvas = document.createElement("canvas");
  // testCanvas.width = 512;
  // testCanvas.height = 424;
  // var testContext = testCanvas.getContext("2d");
  // var imageData = testContext.createImageData(testCanvas.width, testCanvas.height);
  // var imageDataSize = imageData.data.length;
  // var imageDataArray = imageData.data;


  // Make peer connection
  this.makeConnection = function() {
    connection = peer.connect(peerId); // get a webrtc DataConnection
    connection.on('open', function(data) {
      console.log("Open data connection with server");
    });

    // Route incoming traffic from Kinectron
    connection.on('data', function(dataReceived) {
      var data = dataReceived.data;
      var processedData;
      
      switch (dataReceived.event) {
        // Wait for ready from Kinectron to initialize
        case 'ready':
          var dataToSend = null;
          dataToSend = {feed: this.feed};
          this._sendToPeer('initfeed', dataToSend);         
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
          this.trackedBodiesCallback(data);
        break;

        // If floor height, draw left hand and height
        case 'floorHeightTracker':
          this.fhCallback(data);
        break;

        // case 'rawDepth':
        //   processedData = this._processRawDepth(data);
        //   rawDepthCallback(processedData);
        // break;

        // case 'multiFrame':
        //   if (data.color) {
        //     this.img.src = data.color;
        //     this.rgbCallback(this.img);
        //   }

        //   if (data.depth) {
        //     this.img.src = data.depth;
        //     this.depthCallback(this.img);
        //   }

        //   if (data.body) {
        //     this.bodyCallback(data.body);
        //   }

        //   if (data.rawDepth) {
        //     processedData = this._processRawDepth(data.rawDepth);
        //     rawDepthCallback(processedData);
        //   }
        // break;
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

  // this.startMultiFrame = function(frames) {
      //if (callback) { this._sendToPeer('multi', frames); }
  //   
  // };

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

  // this.setRawDepthCallback = function(callback) {
  //   this.rawDepthCallback = callback;
  // };

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
  
  this.getJoints = function(callback) {
    var jointCallback = callback;
    var joint = null;

    for(var jointType in this.body.joints) {
      joint = this.body.joints[jointType];
      jointCallback(joint);
    }
  };

  this.drawFeed = function() {
    image(this.img, 0, 0);
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
    connection.send(dataToSend);
  };

  // Choose callbak for image-based frames
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
      break;

      case 1:
        return 'notTracked';
      break;

      case 2:
        return 'open';
      break;

      case 3:
        return 'closed';
      break;

      case 4:
        return 'lasso';
      break;
    }
  };


  // TO DO -- Confirm output from rawDepth is correct
  // this._processRawDepth = function(data) {
  //   console.log('k');
  //   var imageData;
  //   var depthBuffer;
  //   var processedData = [];

  //   hiddenImage.src = data;
  //   hiddenContext.clearRect(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
  //   hiddenContext.drawImage(hiddenImage, 0, 0);
  //   imageData = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
  //   depthBuffer = imageData.data;

  //   for(var i = 0; i < depthBuffer.length; i+=2) {
  //     var depth = (depthBuffer[i+1] << 8) + depthBuffer[i]; //get uint16 data from buffer
  //     processedData.push(depth);
  //   }

  //   return processedData;
  // };

  // FOR TESTING -- use this to show raw depth image on canvas
  // this._rawDepthTest = function(data) {
  //   var imageDataTemp;
  //   var depthBuffer;
  //   var newPixelData;
  //   var j = 0;

  //   hiddenImage.src = data;
  //   hiddenContext.clearRect(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
  //   hiddenContext.drawImage(hiddenImage, 0, 0);
  //   imageDataTemp = hiddenContext.getImageData(0, 0, hiddenContext.canvas.width, hiddenContext.canvas.height);
  //   newPixelData = imageDataTemp.data;
    
  //   for (var k = 0; k < imageDataSize; k+=4) {
  //     imageDataArray[k] = newPixelData[j];
  //     imageDataArray[k+1] = newPixelData[j+1];
  //     imageDataArray[k+2] = 0;
  //     imageDataArray[k+3] = 0xff; // set alpha cahannel at full opacity
  //     j+=2;
  //   }

  //   testContext.putImageData(imageData, 0, 0);
  //   var testCanvasData = testCanvas.toDataURL("image/png", 0.5);
  //   this.img.elt.src = testCanvasData;
  //   //this.callback(this.img);
  // };


};

})(window);