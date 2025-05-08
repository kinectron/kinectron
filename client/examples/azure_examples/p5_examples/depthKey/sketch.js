// Copyright (c) 2019 Kinectron
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
  createCanvas(640 / 2, 576 / 2);
  pixelDensity(1);

  colorMode(HSB);
  // white background
  background(255);

  // set color mode to HSB with range of 0-255
  colorMode(HSB, 255);

  // create an instance of kinectron
  kinectron = new Kinectron(kinectronServerIPAddress);

  // set kinect type to azure
  kinectron.setKinectType('azure');

  // connect with application over peer
  kinectron.makeConnection();

  // define callbacks for all feeds
  kinectron.setDepthKeyCallback(drawDepth);
  kinectron.startDepthKey();
}

// draw() is a p5.js function
// after setup() runs once, draw() runs on a loop
function draw() {}

// callback function when feed sends a new depth buffer
function drawDepth(depthBuffer) {
  // get the depth buffer
  const depthArray = depthBuffer;

  // white background
  background(255);

  // load the canvas pixels
  loadPixels();

  // set canvas pixel index at 0
  let pixelIndex = 0;

  // go through all values in the depth array
  // there's one value per pixel
  for (let i = 0; i < depthArray.length; i++) {
    // if there's a depth value
    if (depthArray[i] > 0) {
      // map the depth value to range 0-1 for hue
      // the kinect depth value can go up to 8000,
      // play with the depth range numbers (0,3000) for different results
      const newClr = map(depthArray[i], 0, 3000, 0, 1.0);
      // get rgb from hsv
      const newRGB = HSVtoRGB(newClr, 1.0, 1.0);
      // assign the new pixels
      pixels[pixelIndex + 0] = newRGB.r;
      pixels[pixelIndex + 1] = newRGB.g;
      pixels[pixelIndex + 2] = newRGB.b;
      pixels[pixelIndex + 3] = 255;
    } else {
      // or make it transparent
      pixels[pixelIndex + 0] = 0;
      pixels[pixelIndex + 1] = 0;
      pixels[pixelIndex + 2] = 0;
      pixels[pixelIndex + 3] = 0;
    }

    // increment the pixel index by 4 (rgba for each pixel)
    pixelIndex += 4;
  }

  // update the canvas pixel array
  updatePixels();
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
