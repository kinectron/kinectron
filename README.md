# Kinectron

Kinectron is an Electron-based application that enables real-time streaming of Microsoft Azure Kinect data into web browsers using WebRTC. It provides a simple way for creative coders, interactive designers, and researchers to access depth-sensing data in web applications without the need for native code.

## Kinectron Version 1.0.0

Kinectron is now at version 1.0.0, which fully supports the Azure Kinect with all data streams implemented and thoroughly tested. This release represents a complete rewrite of the codebase with a modern, modular architecture and improved performance.

### Version 1.0.0 Highlights:

- **Complete Stream Support**: All Azure Kinect data streams are fully implemented and working
- **Modern Architecture**: Modular JavaScript architecture with clear separation of concerns
- **Improved Performance**: Optimized data handling and transmission
- **Enhanced Security**: New "Block API Calls" feature for controlled access
- **Comprehensive Documentation**: Detailed guides and API documentation
- **Multiple Distribution Formats**: Support for ESM, CJS, and UMD with CDN availability

If you are looking for support for the Kinect 2 for Windows, see the legacy version 0 (unsupported as of May 2025).

## Features

- **Real-time Streaming**: Stream Azure Kinect data to web browsers with minimal latency
- **Multiple Data Streams**: Access color, depth, raw depth, body tracking, key, RGBD, and depth key
- **Remote Connections**: Connect to Kinect data from anywhere using Ngrok tunneling
- **Visualization Tools**: Built-in visualization examples using p5.js and Three.js
- **Broadcast Controls**: Block API calls while still allowing streaming data for teaching or performance broadcast

## Architecture

Kinectron consists of two main components:

1. **Application (`app/`)**: An Electron-based desktop application that interfaces with the Azure Kinect hardware and broadcasts data over WebRTC
2. **Client API (`client/`)**: A JavaScript library that connects to the Kinectron server and provides methods for accessing different data streams

```mermaid
flowchart TD
    subgraph "Kinectron App"
        KinectHW[Azure Kinect Hardware]
        KinectController[Kinect Controller]
        Processors[Stream Processors]
        Handlers[Stream Handlers]
        PeerManager[Peer Connection Manager]
    end

    subgraph "Web Clients"
        ClientAPI[Kinectron Client API]
        WebApp[Web Application]
    end

    KinectHW --> KinectController --> Processors --> Handlers --> PeerManager <--> ClientAPI --> WebApp
```

## Installation

### Hardware Requirements

- Microsoft Azure Kinect DK
- Windows 10/11 computer with USB 3.0 port
- Sufficient processing power for real-time data handling. See [Azure Kinect system requirements](https://learn.microsoft.com/en-us/previous-versions/azure/kinect-dk/system-requirements)

### Software Prerequisites

1. [Azure Kinect SDK](https://docs.microsoft.com/en-us/azure/kinect-dk/sensor-sdk-download)

### Application Installation Steps

**Option 1 - Download Release (Recommended)** Download the latest release from the [releases page](https://github.com/kinectron/kinectron/releases)

OR

**Option 2 - Clone and build from source (Advanced)**

1.  ```bash
    git clone https://github.com/kinectron/kinectron.git
    cd app
    npm install
    ```

````

2. Start the application:
```bash
npm start
````

## Getting Started

### Running the Application

1. Connect your Azure Kinect device to your computer
2. Launch the Kinectron application
3. The application will display the server IP address and port for client connections
4. Click the "Open Kinect" button to initialize the device

### Connecting Clients

#### Local Connection (Simplified - Recommended)

```javascript
// Include the Kinectron client library in your HTML
<script src="https://cdn.jsdelivr.net/gh/kinectron/kinectron@latest/client/dist/kinectron-client.js"></script>;

// Create a new Kinectron instance with just the server IP
const kinectron = new Kinectron('127.0.0.1'); // Enter IP address from application here!

// Set up connection event handler
kinectron.on('ready', () => {
  console.log('Connected to Kinectron server');
});

// Connect to the server
kinectron.peer.connect();
```

#### Local Connection (Advanced Configuration)

```javascript
// Create a new Kinectron instance with detailed configuration
const kinectron = new Kinectron({
  host: '127.0.0.1', // Enter IP address from application here!
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

1. Create a free account at [ngrok.com](https://ngrok.com/) and copy your authtoken
2. In the Kinectron application, enter your authtoken and click "Create Public Address"
3. Use the provided Ngrok URL in your client code:

```javascript
// Create a new Kinectron instance with just the Ngrok URL
const kinectron = new Kinectron('your-ngrok-url.ngrok-free.app');

// Set up connection event handler
kinectron.on('ready', () => {
  console.log('Connected to Kinectron server via Ngrok');

  // Set Kinect type (azure or windows)
  kinectron.setKinectType('azure');
});

// Connect to the server
kinectron.peer.connect();
```

### Block API Control

The Kinectron application includes a "Block API Calls" button that prevents clients from controlling the Kinect while still allowing streaming data. This is useful for public installations, teaching scenarios, or performances where you want to stream data but don't want to allow remote control of the device.

When API calls are blocked:

- Incoming API calls from clients are blocked
- Outgoing streams continue to function
- The button text toggles between "Block API Calls" and "Allow API Calls"
- The status text indicates whether API calls are allowed or blocked

## Available Streams

Kinectron provides access to the following data streams, all of which are fully implemented and working:

### Color Stream

RGB color image from the Azure Kinect camera.

```javascript
// Start the color stream
kinectron.startColor((colorFrame) => {
  // Process the color frame
  // colorFrame contains an image data URL
  document.getElementById('colorImage').src = colorFrame.src;
});
```

### Depth Stream

Processed 8-bit gray scale depth image from the Azure Kinect depth sensor.

```javascript
// Start the depth stream
kinectron.startDepth((depthFrame) => {
  // Process the depth frame
  // depthFrame contains an image data URL
  document.getElementById('depthImage').src = depthFrame.src;
});
```

### Raw Depth Stream

Native 16-bit depth data from the Azure Kinect depth sensor, useful for precise depth measurements and point cloud visualization.

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

Skeleton data for multiple tracked bodies, including joint positions and orientations.

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

Body segmentation data that separates people from the background.

```javascript
// Start the key stream
kinectron.startKey((keyFrame) => {
  // Process the key frame
  // keyFrame contains an image data URL with transparent background
  document.getElementById('keyImage').src = keyFrame.src;
});
```

### RGBD (Color + Depth)

Combined color and depth data, useful for creating colored point clouds. Alpha channel in RGBA image is used to store 8-bit depth data.

```javascript
// Start the RGBD stream
kinectron.startRGBD((rgbdFrame) => {
  // Process the RGBD frame
  // rgbdFrame contains aligned color and depth data
  document.getElementById('rgbdImage').src = rgbdFrame.src;
});
```

### Depth Key

Combined depth data with body segmentation, providing native 16-bit depth information only for detected bodies in the scene.

```javascript
// Start the depth key stream
kinectron.startDepthKey((depthKeyFrame) => {
  // Process the depth key frame
  // depthKeyFrame contains depth data only for people in the scene
  visualizeFilteredPointCloud(depthKeyFrame);
});
```

## Client API

The Kinectron client API provides methods for connecting to the server and accessing different data streams.

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

### Utility Methods

- `setKinectType(type)`: Sets the Kinect type ('azure' or 'windows')
- `getJoints(body)`: Gets joint positions from a body object
- `getHands(body)`: Gets hand states from a body object

## Examples

Kinectron includes examples to help you get started:

To run examples first install dev dependencies

```bash
cd client
npm install
```

### Stream Test Example

The Stream Test example provides a comprehensive interface for testing all available streams and visualizing the data using both p5.js and Three.js.

To run the Stream Test example:

```bash
cd client
npm run test:stream
```

This will:

1. Build the client library
2. Start a development server
3. Open the Stream Test example in your browser

### Simple Connection Test

The Simple Connection Test example provides a minimal implementation for testing the connection to the Kinectron server.

To run the Simple Connection Test:

```bash
cd client
npm run test
```

## Troubleshooting

### Common Issues

#### Kinect Device Not Found

If the Kinect device is not found when clicking "Open Kinect":

1. Ensure the Azure Kinect is properly connected to a USB 3.0 port
2. Check that the Azure Kinect SDK is installed
3. Verify that no other application is using the Kinect
4. Try restarting the Kinectron application

The application will display a modal dialog with troubleshooting steps if the Kinect device isn't connected. The "Open Kinect" button remains active even when initialization fails, allowing you to retry the connection.

#### Connection Issues

If clients cannot connect to the Kinectron server:

1. Ensure the client is using the correct IP address or Ngrok URL
2. Check that the client and server are on the same network (for local connections)
3. Verify that no firewall is blocking the connection
4. Try restarting both the server first, then the client

#### Stream Issues

If streams are not working correctly:

1. Check the console for error messages
2. Ensure the Kinect is properly initialized
3. Try stopping and restarting the stream
4. Verify that the client is properly handling the received data

### Debugging

Kinectron includes a comprehensive debugging system with flag-based controls. In the Stream Test example, you can enable different categories of debug logs:

- **FRAMES**: Logs related to frame processing and transmission
- **UI**: Logs related to UI interactions
- **PEER**: Logs related to peer connections
- **PERFORMANCE**: Logs related to performance metrics
- **DATA**: Logs related to data integrity
- **NETWORK**: Logs related to network operations
- **HANDLERS**: Logs related to stream handler operations

To enable debugging in your own application:

```javascript
// Enable all debug flags
window.DEBUG.enableAll();

// Or enable specific flags
window.DEBUG.FRAMES = true;
window.DEBUG.PERFORMANCE = true;
```

Essential logs (errors, warnings, important info) are always visible, while non-essential logs (debug, frame, UI) are only visible when the corresponding flags are enabled.

## Development

### Project Structure

```
kinectron/
├── app/                  # Electron application
│   ├── main/             # Main process code
│   │   ├── handlers/     # Stream handlers
│   │   ├── managers/     # Resource managers
│   │   └── processors/   # Stream processors
│   ├── preload/          # Preload scripts
│   └── renderer/         # Renderer process code
├── client/               # Client library
│   ├── examples/         # Example applications
│   │   ├── streamTest/   # Stream testing interface
│   │   └── test/         # Simple connection test
│   └── src/              # Client source code
│       ├── peer/         # Peer connection code
│       ├── streams/      # Stream handlers
│       └── utils/        # Utility functions
└── memory-bank/          # Project documentation
```

### Build Process

#### Building the Application

```bash
# From the root directory
npm install
npm start
```

#### Building the Client Library

```bash
# From the client directory
npm install
npm run build
```

This will create a bundled version of the client library in the `client/dist` directory.

### Development Workflow

1. Make changes to the code
2. Run the clean script to prevent Parcel caching issues: `npm run clean`
3. Test changes using the appropriate example
4. Build the client library if necessary
5. Commit changes with descriptive commit messages

For more detailed information about the development workflow, see the [DEVELOPMENT.md](client/DEVELOPMENT.md) file.

### Known Issues and Solutions

#### Data Structure and Naming Convention Inconsistencies

There are some inconsistencies in naming conventions between the server and client:

- Case differences (imageData vs. imagedata)
- Format differences (depth-key vs depthKey)
- Inconsistent use of hyphens vs camelCase

These issues have been addressed with workarounds for specific streams, but a systematic approach to standardize naming conventions is planned for future updates.

#### Raw Depth Visualization Quality

The depth data may appear in distinct planes rather than smooth contours, creating a banding/quantization effect in the point cloud visualization. While the data integrity is correct, visualization quality improvements are planned for future updates.

For a complete list of known issues and their solutions, see the [Known Issues](memory-bank/progress.md#known-issues) section in the progress.md file.

## Contributing

We welcome contributions to Kinectron! Please see [CONTRIBUTE.md](CONTRIBUTE.md) for guidelines on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [PeerJS](https://peerjs.com/) for WebRTC peer connection
- [Azure Kinect SDK](https://docs.microsoft.com/en-us/azure/kinect-dk/sensor-sdk-download) for hardware interface
- [Electron](https://www.electronjs.org/) for cross-platform desktop application
- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [Three.js](https://threejs.org/) and [p5.js](https://p5js.org/) for visualization examples
