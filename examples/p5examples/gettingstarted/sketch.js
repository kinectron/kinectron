var myCanvas = null;

// Declare kinectron 
var kinectron = null;

function setup() {
  myCanvas = createCanvas(500, 500);
  background(0);

  // Define and create an instance of kinectron
  var yourKinectronIpAdress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(yourKinectronIpAdress);

  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Connect with application over peer
  kinectron.makeConnection();

  // Set callbacks
  kinectron.setRGBCallback(drawFeed);
  kinectron.setDepthCallback(drawFeed);
  kinectron.setRawDepthCallback(drawRawDepthFeed);
  kinectron.setInfraredCallback(drawFeed);
}

function draw() {

}

// Choose camera to start based on key pressed
function keyPressed() {
  if (keyCode === ENTER) {
    kinectron.startRGB();
  } else if (keyCode === UP_ARROW) {
    kinectron.startDepth();
  } else if (keyCode === DOWN_ARROW) {
    kinectron.startInfrared();
  } else if (keyCode === LEFT_ARROW) {
    kinectron.startRawDepth();
  } else if (keyCode === RIGHT_ARROW) {
    kinectron.stopAll();
  }
}

function drawFeed(img) {
  // Draws feed using p5 load and display image functions  
  loadImage(img.src, function(loadedImage) {
    image(loadedImage, 0, 0);
  });
}

function drawRawDepthFeed(img) {
  // Draws feed using p5 load and display image functions  
  loadImage(img.src, function(loadedImage) {
    //clear background for png tranparency
    background(255);
    image(loadedImage, 0, 0);
  });
}