// Copyright (c) 2020 Kinectron
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Kinectron Example
Kinect Azure depth key feed using p5.js
=== */
//

// declare variable for kinectron
let kinectron = null;

// ip address is a string containing four numbers
// each number is between 0 and 255 and separated with periods
// since it is a string, it goes between double quotes
// we put as example here "1.2.3.4"
// replace it with the kinectron server ip address
// remember to keep the double quotes
const kinectronServerIPAddress = '127.0.0.1';

// setup() is a p5.js function
// setup() runs once, at the beginning
function setup() {
  // create canvas the size of depth image
  createCanvas(640, 576);
  pixelDensity(1);

  // set color mode to HSB with range of 0-255
  colorMode(HSB, 255);

  // create an instance of kinectron
  kinectron = new Kinectron(kinectronServerIPAddress);

  // set kinect type to azure
  kinectron.setKinectType('azure');

  // connect with application over peer
  kinectron.makeConnection();

  // define callback for depth feed
  kinectron.setDepthCallback(drawImage);
  kinectron.startDepth();
}

// draw() is a p5.js function
// after setup() runs once, draw() runs on a loop
function draw() {}

// callback function when feed sends a new frame
function drawImage(newFrame) {
  // loadImage() is a p5.js function
  // load new frame from feed and then place it on p5.js canvas
  loadImage(newFrame.src, function (depthImage) {
    // white background
    background(255);
    // load depth pixels
    depthImage.loadPixels();
    // get the depth pixels
    let depthPixels = depthImage.pixels;
    // go through all of the depth pixels
    for (let i = 0; i < depthPixels.length; i += 4) {
      // if there's a depth value
      if (depthPixels[i] > 0) {
        // map the depth value to range 0-1 for hue
        // the kinect depth value can go up to 8000,
        // play with the depth range numbers (0,500) for different results
        const newClr = map(depthPixels[i], 0, 500, 0, 1.0);
        // get rgb from hsv
        const newRGB = HSVtoRGB(newClr, 1.0, 1.0);

        // assign the new pixels
        depthPixels[i] = newRGB.r;
        depthPixels[i + 1] = newRGB.g;
        depthPixels[i + 2] = newRGB.b;
        depthPixels[i + 3] = 255;
      }
    }

    // update the depth pixels
    depthImage.updatePixels();
    // place the depth image at (0,0)
    image(depthImage, 0, 0);
  });
}

// formula from
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
 */
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    (s = h.s), (v = h.v), (h = h.h);
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}
