// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

var myCanvas = null;
var beach;
var img;
var myDiv;

var processing = false;

// Declare Kinectron
var kinectron = null;

function preload() {
  beach = loadImage("images/beach.png");
}

function setup() {
  myCanvas = createCanvas(640, 426);
  background(255);

  // Define and create an instance of kinectron
  var yourKinectronIpAdress = ""; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron = new Kinectron(yourKinectronIpAdress);

  // CONNECT TO MIRCROSTUDIO
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Create connection between remote and application
  kinectron.makeConnection();

  // Start the greenscreen camera
  kinectron.startKey(goToBeach);
}

function draw() {

}

function goToBeach(img) {
  loadImage(img.src, function(loadedImage) {
    image(beach, 0, 0);
    image(loadedImage, 0, 0);
  });
}