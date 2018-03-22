# How to contribute

This project is still a work in progress, but we hope that you will contribute!

## Getting Started 

If you want to help develop this library, here are the steps to get started with:

1. Fork the repository to your account, and then clone it your computer:
  ```bash
  git clone https://github.com/YOURGITHUBHANDLE/kinectron.git
  ```

2. Make sure you have [node](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. 

From here, you can choose to develop independently on the client-side API or the server application. 

## Contribute to API

You can develop on the client-side API from Mac or PC. 

1. Install dependencies.

  ```bash
  cd client 
  npm install
  ```

2. Make changes in ```client/src/kinectron.js``` 

3. Build the library with changes.

  Kinectron is developed using [Browserify](http://browserify.org/). Browserify is a module bundler that bundles several files into one file. 

  Kinectron requires [PeerJS](http://peerjs.com/) to send data over the network. Browserify makes sure that the PeerJS files are included in the Kinectron library. To create the bundle, run the build script.

  ```bash 
  npm run build
  ```
  The final bundled library is created at ```client/bin/kinectron.bundle.js```

  OR 

  If you'd like to make several changes over time, [Watchify](https://github.com/browserify/watchify) will watch your file for changes, and simultaneously bundle them. Watchify will continue to watch for changes as long as it is running. To start this process run the start script. 

  ```bash
  npm start 
  ```

  Use control + C to stop this process. 

## Contribute to Server Application 

You can develop on the server application from **Windows only**. This has only been tested on Windows 10.

1. Install dependencies.

  After you've forked and cloned the repository, move into the ```app``` folder and install all dependencies.

  ```bash
  cd app
  npm install
  ```
2. Build Kinect 2 for Electron 

  **You will need to have node-gyp & it's dependencies installed (https://github.com/nodejs/node-gyp) before you can continue.**

  Node-gyp was installed with the previous ```npm install``` command. Follow the [installation instructions on the node-gyp github repo](https://github.com/nodejs/node-gyp#installation) to install the dependencies.

  Now you are ready to build Kinect 2 for Electron. 

  ```bash

  // run this with target set to your electron version and arch set to your system architecture
  // find electron version in your package.json file
  // this is what I will run with electron version 1.4.13 and a 64-bit system  
  
  node .\node_modules\kinect2\tools\electronbuild.js --target=1.4.13 --arch=x64
  ```
  
  This will say ```gyp info ok``` at the end if it has built correctly.

3. Run the electron application with npm start.

  ```bash
  npm start
  ```

4. To create a new release / packaged application. Run electron-packager from inside the application folder

  ```bash
  cd app
  npm run package
  ```

  This will make an application for the platform and architecture for the computer you are working on. To learn more about packaging options read the [Electron Packager documentation](https://github.com/electron-userland/electron-packager).


## Additional Resources

- [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
- [How to Write an Open Source JavaScript Library](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)