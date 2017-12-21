var kinectron1;
// var kinectron2;

// Use two canvases to draw incoming feeds
var canvas; 
var ctx; 
var canvas2; 
var ctx2; 

// set a fixed 2:1 for the images
var CANVW = 768;
var KIMGW = 512;
var CANVH = 424;
var canv1XStart = 30;
var canv2XStart = 256 - 30;
var busy = false;

function initKinectron() {

	// Define and create an instance of kinectron
  //var kinectronIpAddress1 = (); // FILL IN YOUR KINECTRON IP ADDRESS HERE
  //var kinectronIpAddress2 = "10.0.1.14";

  kinectron1 = new Kinectron();
  kinectron1.makeConnection();
  kinectron1.startRGBD(changeCanvas1);
  //kinectron1.startMultiFrame(["depth", "depth-color"], changeCanvas1);

  // kinectron2 = new Kinectron(kinectronIpAddress2);
  // kinectron2.makeConnection();
  // kinectron2.startMultiFrame(["depth", "depth-color"], changeCanvas2);
}

// Use '9' key to stop kinects from running 
window.addEventListener('keydown', function(event){
	
	if (event.keyCode === 57) {
		  kinectron1.stopAll();
		  //kinectron2.stopAll();
	}

});


function changeCanvas1(data) {
	if (busy) {
    return;
  }

	// Image data needs to be draw to img element before canvas
  if (data.src) {
    busy = true; 
    var img1 = new Image();

    img1.src = data.src; // get color image from kinectron data

    img1.onload = function() {
       ctx.clearRect(0, 0, CANVW, CANVH);
       ctx.drawImage(img1,canv1XStart,0, KIMGW, CANVH);  
    };
     
    setTimeout(function() {
      busy = false;
    });
  } else {
    console.log("no src");
  } 
}


// function changeCanvas2(data) {

//   if (busy) return;

//   busy = true; 

//   if (!data.depthColor) return;

//   // Image data needs to be draw to img element before canvas
//   var img2 = new Image();
//   img2.src = data.depthColor; // get color image from kinectron data

//   img2.onload = function() {
//     ctx2.clearRect(0, 0, CANVW, CANVH);
//     ctx2.drawImage(img2, canv2XStart, 0, KIMGW, CANVH); 
//   };

//   setTimeout(function() {
//     busy = false;
//   });
          

// }
