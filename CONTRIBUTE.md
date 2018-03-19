# How to contribute

This project is still a work in progress, but we hope that you will contribute!

## Getting Started 

If you want to help develop this library, here are the steps to get started with:

1. Fork the repository to your account, and then clone it your computer:
```bash
git clone https://github.com/YOURGITHUBHANDLE/kinectron.git
```

From here, you can choose to develop independently on the client-side API or the server application. 

### Contribute to API

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

### Contribute to Server Application 

Coming soon....

## Additional Resources

- [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
- [How to Write an Open Source JavaScript Library](https://egghead.io/courses/how-to-write-an-open-source-javascript-library)