(function(window) {

// Import Peer.js 
var Peer = require('peerjs');

// Width and height variables available for skeleton and floor height joint helper functions
var incomingW = null;
var incomingH = null;

// Skeleton variables for helper functions
var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];
var HANDSIZE = 40;
var HANDCLOSEDCOLOR = 'red';
var HANDOPENCOLOR = 'green';
var HANDLASSOCOLOR = 'blue';
var index = 0;

p5.Kinect2 = function(peerid, creds, canvas, feed, scale, callback) {  
  this.canvas = canvas;
  this.scaleDim = null;
  this.scaleSize = null;
  this.img = null;
  this.feed = null;
  this.callback = null;

   // All possible camera options 
  var cameraOptions = ['rgb', 'depth', 'key', 'infrared', 'le-infrared', 'fh-joint', 'scale', 'skeleton', 'stop-all'];

  // Peer variables 
  var peer = null;
  var connection = null;

  // Hidden div variables
  var myDiv = null;
  var img = null;

  // Create new peer
  peer = new Peer(creds);
  
  peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
  });

  peer.on('connection', function(connection) {
    connection.on('open', function() {
      console.log("Peer js is connected");
    });
  });
  
  // Create hidden image to draw to
  myDiv = createDiv();
  img = createImg(" ");
  img.parent(myDiv);
  myDiv.style("visibility: hidden");
  this.img = img;

  // Set initial camera feed if user sets one
  if (feed) {
    this.feed = feed;
  } 

  // Dimension defaults to 'height' if not set
  if (scale) {
    this.scaleDim = scale;
  } else {
    this.scaleDim = 'height';
  }

  // Function returns scale size based on dimension
  this._setScale = function(scale) {
    if (scale == 'width') {
      return this.canvas.width;
    } else {
      return this.canvas.height;
    }
  };

  // Set the size based on dimension
  this.scaleSize = this._setScale(this.scaleDim);

  // Set callback if user sets one
  if (callback) {
    console.log('setting callback');
    this.callback = callback;
  } 


  // Make peer connection
  this.makeConnection = function() {
    connection = peer.connect(peerid); // get a webrtc DataConnection
    connection.on('open', function(data) {
      console.log("Open data connection with server");
    });

    // Route incoming traffic from Kinectron
    connection.on('data', function(dataReceived) {
      var data = dataReceived.data;
      switch (dataReceived.event) {
        // Wait for ready from Kinectron to initialize
        case 'ready':
          var verified = false;
          var dataToSend = null;

          // Verify camera exists before sending data
          verified = this._verifyFeed(this.feed);
          if (verified || this.feed === null) {
            dataToSend = {
              feed: this.feed, 
              dimension: this.scaleDim, 
              size: this.scaleSize
            };
            this._sendToPeer('initfeed', dataToSend);
          } else {
            throw new Error('Error: Feed does not exist');
          }  
        break;
        // If image data draw image
        case 'frame':
          console.log(data.name);
          if (this.callback) {
            // Passing full data object because just image feed crashes when logged
            this.callback(data);
          } else {
            // Is it ok to clear the canvas on each frame?
            clear();
            this.img.elt.src = data.imagedata;
            image(this.img, 0, 0);
          }  
        break;
        // If new feed reset canvas and image
        case 'framesize':
          incomingW = data.width;
          incomingH = data.height;
          this._setImageSize(incomingW, incomingH);
        break;
        // If skeleton data, draw skeleton
        case 'bodyFrame':
          if (this.callback) {
            this.callback(data);
          } else {
            bodyTracked(data);
          }
        break;
        // If floor height, draw left hand and height
        case 'floorHeightTracker':
          showHeight(data);
        break;
      }
    }.bind(this));
  };

  // Start or change camera set by user
  this.startCamera = function(camera, callback) {
    var verified = false;
    this.callback = null;
    
    if (callback) {
      this.callback = callback;
    }

    verified = this._verifyFeed(camera);

    if (verified) {
      this._setFeed(camera);
    } else {
      throw new Error('Error: Feed does not exist');
    }
  };

  // this.startSkeleton = function(callback) {
  //   if (callback) {
  //     this.callback = callback;
  //   }

  //   this._setFeed('skeleton');

  // }
  
  // this.startFloorHeight = function() {
  //   if (callback) {
  //     this.callback = callback;
  //   }

  //   this._setFeed('fh-joint');
  // }

  // Stop all feeds
  this.stopAll = function() {
    console.log('stop it!');
    this._setFeed('stop-all');
  };

  // Private functions //

  // Change feed on user input
  this._setFeed = function(feed) {
    var dataToSend = null;
   
    this.feed = feed;
    dataToSend = {feed: this.feed};
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

  // Reset image size to correct dimension for kinect data
  this._setImageSize = function(width, height) {
    clear();
    this.img.elt.src = " ";
    img.style("width: " + width + "; height: " + height); 
  };

  // Verify camera feed is valid
  this._verifyFeed = function(name) {
    var nameExists = false; 
    for (var i = 0; i < cameraOptions.length; i++) {
      if (cameraOptions[i] == name) {
        nameExists = true;
      } 
    }
    return nameExists;
  };


};

// Helper functions //


// Draw skeleton 
function bodyTracked(body) {
  // clear canvas each time
  clear();
  // draw body joints
  for(var jointType in body.joints) {
    var joint = body.joints[jointType];
    stroke(colors[index]);
    fill(colors[index]);
    rect(joint.depthX * incomingW, joint.depthY * incomingH, 10, 10);
    //var skeletonJointData = {color: colors[index], depthX: joint.depthX, depthY: joint.depthY};
  }
  // draw hand states
  // 7 is left hand in Kinect2
  updateHandState(body.leftHandState, body.joints[7]);
  // 11 is right hand in Kinect2
  updateHandState(body.rightHandState, body.joints[11]);
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
  //var handData = {depthX: jointPoint.depthX, depthY: jointPoint.depthY, handColor: handColor, handSize: HANDSIZE};
  stroke(handColor);
  fill(handColor);
  ellipse(jointPoint.depthX * incomingW, jointPoint.depthY * incomingH, HANDSIZE, HANDSIZE);
}

// Show height in floor-height feed
function showHeight(data) {
  // clear canvas
  clear();
  // draw height
  fill("red");
  ellipse(data.joint.colorX * incomingW, data.joint.colorY * incomingH, 20, 20);
  textSize(48);
  textFont("sans");
  text(data.distance.toFixed(2) + "m", 20 + data.joint.colorX * incomingW, data.joint.colorY * incomingH);
}

// if (typeof(p5.Kinect2) === 'undefined') {
//   window.p5.Kinect2 =  
// }


})(window);