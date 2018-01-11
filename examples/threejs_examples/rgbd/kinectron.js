var kinectron;

// Use image to draw incoming feed
var img1 = new Image();

// set a fixed 2:1 for the image
var CANVW = 768;
var KIMGW = 512;
var CANVH = 424;
var canv1XStart = 30;
var busy = false;
var photo = false;
var feedStarted = false;

function initKinectron() {

	// Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.218.87"; // FILL IN YOUR KINECTRON IP ADDRESS HERE

  kinectron = new Kinectron(kinectronIpAddress);
  kinectron.makeConnection();

  // start the rgbd feed and send the data to change canvas callback
  kinectron.startRGBD(drawKinectImg);
}

// Use '9' key to stop kinect from running 
// 8 key for snapshot and debugger
window.addEventListener('keydown', function(event){
	
	if (event.keyCode === 57) {
		  kinectron.stopAll();
	}

  if (event.keyCode === 56) {
      photo = true;
  }

});


function drawKinectImg(data) {

	if (busy) {
    return;
  }

	// Image data needs to be draw to img element before canvas
  // Only draw if there is an image from kinectron
  if (data.src) {
    busy = true; 

    img1.src = data.src; // get color and depth image from kinectron data

    if (photo) {
      console.log(img1);
      debugger;
    }

    // when image loads clear the canvas and draw the new image
    img1.onload = function() {
      material.needsUpdate = true;
      texture.needsUpdate = true;
    };
    
    // clear the callstack to avoid stack overflow 
    // see https://stackoverflow.com/questions/8058612/does-calling-settimeout-clear-the-callstack
    setTimeout(function() {
      busy = false;
    });
  } 
}
