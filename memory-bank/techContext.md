# Kinectron Technical Context

## Technology Stack

### Core Technologies

1. **Electron**: Cross-platform desktop application framework
2. **WebRTC via PeerJS**: Real-time communication for browser connections
3. **Azure Kinect SDK**: Native SDK for interfacing with hardware
4. **Modern JavaScript (ES6+)**: Classes, modules, async/await
5. **Parcel**: Zero-configuration bundler for client-side code

## Development Environment

### Required Components

1. **Hardware**: Azure Kinect DK, Windows computer with USB 3.0
2. **Software**: Node.js (v14+), Azure Kinect SDK, Git
3. **Development Tools**: VS Code, npm/yarn, eslint, prettier

### Build Process

1. Install dependencies with `npm install`
2. Run application with `npm start`
3. Build client library with `npm run build-client`
4. Test using example pages

## Technical Constraints

### Hardware Limitations

1. **Azure Kinect**: Resolution/FPS tradeoffs, USB bandwidth requirements
2. **Performance**: CPU/GPU usage, memory consumption, network bandwidth

### Software Limitations

1. **WebRTC**: Browser compatibility, network traversal, bandwidth limitations
2. **Electron**: Application size, security considerations
3. **JavaScript**: Single-threaded nature, garbage collection pauses

## Dependencies

### Core Dependencies

1. **Application**: electron, kinect-azure, peer, sharp, express
2. **Client**: peerjs (optional integration with p5.js, Three.js)
3. **Development**: electron-builder, parcel, eslint, prettier

## Platform Compatibility

### Supported Platforms

1. **Application**: Windows 10/11 (required for Azure Kinect SDK)
2. **Client Library**: All modern browsers with WebRTC support
3. **Examples**: Browser-based examples using p5.js and Three.js

### Cross-Platform Considerations

1. **Network**: Local network for optimal performance, Ngrok for remote
2. **Browser**: Feature detection, consistent API across browsers
3. **Performance**: Optimization strategies for specific environments
