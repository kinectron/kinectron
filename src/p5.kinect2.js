(function(window) {

// Import Peer.js 
var Peer = require('peerjs');

p5.Kinect2 = function(peerid, network) {  
  this.img = null;
  this.feed = null;
  this.callback = null;

  // Peer variables 
  var peer = null;
  var connection = null;
  var peerNet = null;
  var peerId = null;

  // Hidden div variables
  var myDiv = null;
  var img = null;

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
  myDiv = createDiv();
  img = createImg("");
  img.parent(myDiv);
  myDiv.style("visibility: hidden");
  this.img = img;

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
          var dataToSend = null;
          dataToSend = {feed: this.feed};
          this._sendToPeer('initfeed', dataToSend);         
        break;

        // If image data draw image
        case 'frame':
          console.log(data.name);
          this.img.elt.src = data.imagedata;
          this.callback(this.img);
        break;
 
        // If skeleton data, draw skeleton
        case 'bodyFrame':
          this.callback(data);
        break;

        // If floor height, draw left hand and height
        case 'floorHeightTracker':
          this.callback(data);
        break;
      }
    }.bind(this));
  };

  this.startRGB = function(callback) {
    this.callback = callback;
    this._setFeed('rgb');
  };

  this.startDepth = function(callback) {
    this.callback = callback;
    this._setFeed('depth');
  };

  this.startInfrared = function(callback) {
    this.callback = callback;
    this._setFeed('infrared');
  };

  this.startLEInfrared = function(callback) {
    this.callback = callback;
    this._setFeed('le-infrared');
  };

  this.startSkeleton = function(callback) {
    this.callback = callback;
    this._setFeed('skeleton');
  };

  this.startKey = function(callback) {
    this.callback = callback;
    this._setFeed('key');
  };

  this.startScale = function(callback) {
    this.callback = callback;
    this._setFeed('scale');
  };

  this.startFloorHeight = function(callback) {
    this.callback = callback;
    this._setFeed('fh-joint');
  };

  // Stop all feeds
  this.stopAll = function() {
    console.log('stop it!');
    this._setFeed('stop-all');
  };

  this.drawFeed = function() {
    image(this.img, 0, 0);
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

};



// if (typeof(p5.Kinect2) === 'undefined') {
//   window.p5.Kinect2 =  
// }


})(window);