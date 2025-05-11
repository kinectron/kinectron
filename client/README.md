# Kinectron Client

Kinectron Client is a JavaScript library that enables web browsers to connect to the Kinectron server and receive real-time Microsoft Azure Kinect data streams using WebRTC. This library makes it easy for creative coders, interactive designers, and researchers to access depth-sensing data in web applications without native code.

## Usage

Kinectron Client must be used with the Kinectron Server. Download instructions can be found here https://github.com/kinectron/kinectron

## Installation

### NPM

```bash
npm install kinectron-client
```

### CDN

```html
<!-- UMD build (global variable: Kinectron) -->
<script src="https://cdn.jsdelivr.net/npm/kinectron-client@latest/dist/kinectron.umd.js"></script>
```

## Getting Started

### Connecting to a Kinectron Server

#### Basic Connection (Simplified)

```javascript
// Create a new Kinectron instance with just the server IP
const kinectron = new Kinectron('127.0.0.1'); // Enter IP address from Kinectron application

// Set up connection event handler
kinectron.on('ready', () => {
  console.log('Connected to Kinectron server');
});

// Connect to the server
kinectron.peer.connect();
```

#### Advanced Connection Configuration

```javascript
// Create a new Kinectron instance with detailed configuration
const kinectron = new Kinectron({
  host: '127.0.0.1', // Enter IP address from Kinectron application
  port: 9001, // Custom port if needed
  path: '/', // Custom path if needed
  secure: false, // Use true for HTTPS connections
});

// Set up connection event handler
kinectron.on('ready', () => {
  console.log('Connected to Kinectron server');
});

// Connect to the server
kinectron.peer.connect();
```

#### Remote Connection (using Ngrok)

```javascript
// Create a new Kinectron instance with just the Ngrok URL
const kinectron = new Kinectron('your-ngrok-url.ngrok-free.app');

// Set up connection event handler
kinectron.on('ready', () => {
  console.log('Connected to Kinectron server via Ngrok');

  // Set Kinect type (azure)
  kinectron.setKinectType('azure');
});

// Connect to the server
kinectron.peer.connect();
```

## Available Streams

Kinectron provides access to the following data streams:

### Color Stream

```javascript
// Start the color stream
kinectron.startColor((colorFrame) => {
  // Process the color frame
  // colorFrame contains an image data URL
  document.getElementById('colorImage').src = colorFrame.src;
});
```

### Depth Stream

```javascript
// Start the depth stream
kinectron.startDepth((depthFrame) => {
  // Process the depth frame
  // depthFrame contains an image data URL
  document.getElementById('depthImage').src = depthFrame.src;
});
```

### Raw Depth Stream

```javascript
// Start the raw depth stream
kinectron.startRawDepth((rawDepthFrame) => {
  // Process the raw depth frame
  // rawDepthFrame contains already unpacked depth data in the depthValues property
  const depthData = rawDepthFrame.depthValues;

  // Use the depth data for visualization or analysis
  visualizePointCloud(depthData);
});
```

### Body Tracking

```javascript
// Start the body tracking stream
kinectron.startBodies((bodyFrame) => {
  // Process the body frame
  // bodyFrame.bodies contains an array of skeleton data
  if (bodyFrame.bodies.length > 0) {
    drawSkeleton(bodyFrame.bodies[0]);
  }
});
```

### Key (Green Screen)

```javascript
// Start the key stream
kinectron.startKey((keyFrame) => {
  // Process the key frame
  // keyFrame contains an image data URL with transparent background
  document.getElementById('keyImage').src = keyFrame.src;
});
```

### RGBD (Color + Depth)

```javascript
// Start the RGBD stream
kinectron.startRGBD((rgbdFrame) => {
  // Process the RGBD frame
  // rgbdFrame contains aligned color and depth data
  document.getElementById('rgbdImage').src = rgbdFrame.src;
});
```

### Depth Key

```javascript
// Start the depth key stream
kinectron.startDepthKey((depthKeyFrame) => {
  // Process the depth key frame
  // depthKeyFrame contains depth data only for people in the scene
  visualizeFilteredPointCloud(depthKeyFrame);
});
```

## API Reference

### Connection Methods

- `peer.connect()`: Establishes a connection to the Kinectron server
- `on(event, callback)`: Registers a callback for specific events:
  - `'ready'`: Fired when connection is established
  - `'error'`: Fired when an error occurs
  - `'stateChange'`: Fired when connection state changes
  - `'data'`: Fired when data is received
- `getState()`: Returns the current connection state
- `isConnected()`: Returns whether the client is connected to the server
- `close()`: Closes the connection and cleans up resources

### Stream Control Methods

- `startColor(callback)`: Starts the color stream
- `startDepth(callback)`: Starts the depth stream
- `startRawDepth(callback)`: Starts the raw depth stream
- `startBodies(callback)`: Starts the body tracking stream
- `startKey(callback)`: Starts the key (green screen) stream
- `startRGBD(callback)`: Starts the RGBD stream
- `startDepthKey(callback)`: Starts the depth key stream
- `stopAll()`: Stops all active streams

## Debugging

Kinectron includes a comprehensive debugging system with flag-based controls:

```javascript
// Enable all debug flags
window.DEBUG.enableAll();

// Or enable specific flags
window.DEBUG.FRAMES = true;
window.DEBUG.PERFORMANCE = true;
```

## More Information

For more detailed information about Kinectron, including the server application, examples, and development guidelines, please visit the [Kinectron GitHub repository](https://github.com/kinectron/kinectron).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
