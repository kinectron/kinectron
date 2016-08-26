An Electron + Kinect2 Application and p5.js Library

Electron is node.js plus Chromium enabling the node.js Kinect2 library and Chromium's support for WebRTC to be used together to create an efficient means to stream kinect captured images and data over the network to web clients.

To build from source: 
* clone this repo
* Install Electron globally
* Run ``npm install`` to install dependencies (kinect2 and peer) (These might still need to be added to package.json)
* Update kinect2 for use with Electron (instructions on kinect2 README.md)
* ``electron .`` to run it the Kinect client/Electron app
* Run one of the examples (p5.html, p5minimal.html, etc..)

To package as a double clickable app:
electron-packager . kinectron --platform=win32 --arch=x64
