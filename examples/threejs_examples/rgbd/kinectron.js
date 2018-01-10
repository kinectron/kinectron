var kinectron;

// Use canvas to draw incoming feed
var canvas; 
var ctx; 

// set a fixed 2:1 for the image
var CANVW = 768;
var KIMGW = 512;
var CANVH = 424;
var canv1XStart = 30;
var busy = false;
var photo = false;

function initKinectron() {

	// Define and create an instance of kinectron
  var kinectronIpAddress = "10.0.1.5"; // FILL IN YOUR KINECTRON IP ADDRESS HERE

  kinectron = new Kinectron(kinectronIpAddress);
  kinectron.makeConnection();

  // start the rgbd feed and send the data to change canvas callback
  kinectron.startRGBD(changeCanvas);
}

// Use '9' key to stop kinect from running 
window.addEventListener('keydown', function(event){
	
	if (event.keyCode === 57) {
		  kinectron.stopAll();
	}

  if (event.keyCode === 56) {
      photo = true;
  }

});


function changeCanvas(data) {
	if (busy) {
    return;
  }

	// Image data needs to be draw to img element before canvas
  // Only draw if there is an image from kinectron
  if (data.src) {
    busy = true; 
    var img1 = new Image();

    img1.src = data.src; // get color and depth image from kinectron data

    if (photo) {
      console.log(img1);
      debugger;
    }

    // when image loads clear the canvas and draw the new image
    img1.onload = function() {
       ctx.clearRect(0, 0, CANVW, CANVH);
       ctx.drawImage(img1,canv1XStart,0, KIMGW, CANVH);  
    };
    
    // clear the callstack to avoid stack overflow 
    // see https://stackoverflow.com/questions/8058612/does-calling-settimeout-clear-the-callstack
    setTimeout(function() {
      busy = false;
    });
  } 
}
