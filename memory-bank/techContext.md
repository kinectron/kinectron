# Kinectron Technical Context

## Technology Stack

Kinectron is built using a modern JavaScript technology stack that enables real-time streaming of Kinect data to web browsers:

### Core Technologies

1. **Electron**:

   - Cross-platform desktop application framework
   - Enables JavaScript/Node.js to access native system capabilities
   - Provides both main process (Node.js) and renderer process (Chromium)
   - Used for the Kinectron application that interfaces with the Kinect hardware

2. **WebRTC via PeerJS**:

   - Real-time communication protocol for browser-to-browser connections
   - Enables low-latency streaming of video and data
   - PeerJS library simplifies WebRTC implementation
   - Used for streaming Kinect data from the application to web clients

3. **Azure Kinect SDK**:

   - Native SDK for interfacing with the Azure Kinect hardware
   - Provides access to color camera, depth sensor, and body tracking
   - Accessed through the Node.js binding `kinect-azure`
   - Core data source for all streams

4. **Modern JavaScript (ES6+)**:

   - ES modules for code organization
   - Classes and inheritance for object-oriented design
   - Async/await for asynchronous operations
   - Arrow functions, destructuring, and other modern features

5. **Parcel**:
   - Zero-configuration bundler for client-side code
   - Used to package the client API for browser use
   - Handles dependencies and optimizations

## Development Environment

### Required Components

1. **Hardware**:

   - Microsoft Azure Kinect DK
   - Computer with USB 3.0 port and sufficient processing power
   - Windows 10 or 11 (for Azure Kinect SDK compatibility)

2. **Software**:

   - Node.js (v14+)
   - npm or yarn package manager
   - Azure Kinect SDK (installed separately)
   - Visual Studio Code (recommended editor)
   - Git for version control

3. **Development Dependencies**:
   - electron-reload for live reloading during development
   - electron-builder for packaging the application
   - eslint for code linting
   - prettier for code formatting

### Build and Run Process

1. **Development Workflow**:

   - Clone repository
   - Install dependencies with `npm install`
   - Run the application with `npm start`
   - Changes to code trigger automatic reload via electron-reload

2. **Client Library Development**:

   - Client code is located in the `client/` directory
   - Build the client library with `npm run build-client`
   - Test using the provided example pages

3. **Testing**:
   - Use `streamTest.html` for testing different stream types
   - Example applications in `examples/` directory demonstrate usage
   - Manual testing with real Kinect hardware is essential

## Technical Constraints

### Hardware Limitations

1. **Azure Kinect Constraints**:

   - Maximum color resolution: 3840×2160 (4K) at 30 FPS
   - Maximum depth resolution: 1024×1024 at 15 FPS
   - Field of view limitations (color: 90°×59°, depth: 120°×120°)
   - USB 3.0 bandwidth requirements
   - Processing power needed for body tracking

2. **Performance Considerations**:

   - Frame rate vs. resolution tradeoffs
   - CPU/GPU usage for real-time processing
   - Memory consumption for large frame buffers
   - Network bandwidth for streaming

3. **Compatibility**:
   - Azure Kinect SDK requires Windows
   - Limited backward compatibility with Windows Kinect applications
   - Browser compatibility for WebRTC features

### Software Limitations

1. **WebRTC Constraints**:

   - Browser support and compatibility
   - Network traversal challenges (firewalls, NAT)
   - Bandwidth limitations for high-resolution streams
   - Latency considerations for real-time applications

2. **Electron Considerations**:

   - Application size and resource usage
   - Security considerations for IPC communication
   - Performance overhead compared to native applications

3. **JavaScript Limitations**:
   - Single-threaded nature of JavaScript
   - Garbage collection pauses affecting real-time performance
   - Memory management for large data structures
   - Limited access to low-level optimizations

## Dependencies

### Core Dependencies

1. **Application Dependencies**:

   - `electron`: Desktop application framework
   - `kinect-azure`: Node.js binding for Azure Kinect SDK
   - `peer`: PeerJS server implementation
   - `sharp`: Image processing library for optimizing frame data
   - `express`: Web server for serving client files and examples

2. **Client Dependencies**:

   - `peerjs`: WebRTC client library
   - No external runtime dependencies for basic functionality
   - Optional integration with p5.js, Three.js, etc.

3. **Development Dependencies**:
   - `electron-builder`: Application packaging and distribution
   - `electron-reload`: Live reloading during development
   - `parcel`: Client library bundling
   - `eslint` and `prettier`: Code quality tools

### Dependency Management

1. **Version Control**:

   - Dependencies are locked via package-lock.json
   - Peer dependencies are explicitly documented
   - Version ranges are specified to balance stability and updates

2. **Security Considerations**:

   - Regular updates to address security vulnerabilities
   - Minimized use of third-party dependencies
   - Careful evaluation of dependency licenses

3. **Bundling Strategy**:
   - Client library is bundled for browser use
   - Dependencies are included in the bundle where appropriate
   - External dependencies are documented for users

## Platform Compatibility

### Supported Platforms

1. **Application (Kinectron Server)**:

   - Windows 10/11 (required for Azure Kinect SDK)
   - macOS and Linux not supported for Azure Kinect

2. **Client Library**:

   - All modern browsers with WebRTC support
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers with WebRTC support
   - Node.js environments for server-side processing

3. **Example Applications**:
   - Browser-based examples using p5.js and Three.js
   - Compatible with various JavaScript frameworks
   - Adaptable to different screen sizes and devices

### Cross-Platform Considerations

1. **Network Connectivity**:

   - Local network connections for optimal performance
   - Internet connections via TURN servers when necessary
   - Ngrok integration for simplified remote connections

2. **Browser Compatibility**:

   - Feature detection for WebRTC capabilities
   - Fallbacks for unsupported features where possible
   - Consistent API across different browsers

3. **Performance Variations**:
   - Different performance characteristics across platforms
   - Optimization strategies for specific environments
   - Graceful degradation on less powerful devices

## Build and Deployment

### Build Process

1. **Application Building**:

   - Electron application is packaged using electron-builder
   - Builds are created for Windows platform
   - Dependencies are bundled with the application
   - Native modules are rebuilt for the target platform

2. **Client Library Building**:

   - Client code is bundled using Parcel
   - ES modules and CommonJS versions are provided
   - Minified production builds reduce file size
   - Source maps are generated for debugging

3. **Documentation Generation**:
   - API documentation is generated from JSDoc comments
   - Examples are maintained separately
   - Markdown documentation for setup and usage

### Deployment Considerations

1. **Application Distribution**:

   - Distributed as installable package for Windows
   - Self-contained application with all dependencies
   - Update mechanism for future versions

2. **Client Library Distribution**:

   - Published to npm for easy installation
   - CDN links provided for direct browser use
   - Version management follows semantic versioning

3. **Development Workflow**:
   - GitHub-based development workflow
   - Issue tracking and feature requests
   - Pull request process for contributions
   - Continuous integration for testing
