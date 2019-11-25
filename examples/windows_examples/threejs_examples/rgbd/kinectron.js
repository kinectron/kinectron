// Declare kinectron
var kinectron;

// Use image to draw incoming feed
var img1 = new Image();

// Control image processing
var busy = false;

function initKinectron() {

	// Define and create an instance of kinectron
  var kinectronIpAddress = "172.16.222.192"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(kinectronIpAddress);

  // Open connection to Kinectron app
  kinectron.makeConnection();

  // Start rgbd feed and send received data to callback
  kinectron.startRGBD(drawKinectImg);
}

// Use '9' key to stop kinect from running 
window.addEventListener('keydown', function(event){
	
	if (event.keyCode === 57) {
		  kinectron.stopAll();
	}

});


function drawKinectImg(data) {

  // Return if currently processing an image
	if (busy) {
    return;
  }

	// Image data needs to be draw to img element before texture
  // Only draw if there is an image from Kinectron
  if (data.src) {

    busy = true; 

    // get color and depth image from kinectron data
    img1.src = data.src; 

    // when image loads update texture
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
