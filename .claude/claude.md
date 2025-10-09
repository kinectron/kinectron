# Kinectron Project Context

## Overview
Kinectron streams Microsoft Azure Kinect data to web browsers via WebRTC. It's an Electron desktop app (server) + JavaScript client library (browser) that enables creative coders, researchers, and interactive designers to access depth-sensing data in web applications.

**Current Status**: Version 1.0.0 - All streams implemented and working

## Architecture

```
Azure Kinect Hardware
  → KinectController (app/main)
  → Stream Processors (app/main/processors)
  → Stream Handlers (app/main/handlers)
  → PeerConnectionManager (WebRTC)
  → Kinectron Client API (browser)
  → Web Applications
```

### Components
- **App (`app/`)**: Electron application (Windows only, requires Azure Kinect SDK)
  - Main process: Kinect interface, stream processing, WebRTC server
  - Renderer process: UI, peer connection UI
- **Client (`client/`)**: Browser JavaScript library (cross-platform dev)
  - Multi-format build: ESM, CJS, UMD
  - WebRTC peer connection via PeerJS
  - Stream handlers for all data types

## Tech Stack
- **Electron**: Desktop app framework
- **PeerJS/WebRTC**: Real-time browser communication
- **Azure Kinect SDK**: Native hardware interface (Windows)
- **Parcel**: Client library bundler
- **Rollup**: Multi-format module builds
- **Sharp**: Server-side image processing
- **ES6+ JavaScript**: Modern classes, async/await, modules

## Available Streams
All streams fully implemented:
1. **Color**: RGB camera feed (1280x720)
2. **Depth**: 8-bit grayscale depth (640x576)
3. **Raw Depth**: 16-bit depth data (320x288) for precise measurements
4. **Body Tracking**: Skeleton joint positions/orientations
5. **Key**: Body segmentation (green screen effect)
6. **RGBD**: Color + depth combined (alpha channel = depth)
7. **Depth Key**: 16-bit depth data only for detected bodies

## Development Workflows

### Application Development (Windows Only)
**Prerequisites**: Azure Kinect SDK, Visual Studio Build Tools, USB 3.0

```bash
npm install              # From root (installs all workspaces)
npm run start:app        # Run Electron app
npm run build:app        # Package application
```

**Important**: After `npm install`, ensure DLL/ONNX files copied from `node_modules/kinect-azure` to `app/` folder:
- onnxruntime.dll, dnn_model_2_0.onnx, cublas64_100.dll, cudart64_100.dll, vcomp140.dll, cudnn64_7.dll

### Client Library Development (Cross-Platform)
```bash
npm run build:client     # Build library to client/dist
npm run dev:client       # Watch mode for development
npm run test:stream      # Run stream tester tool
npm run test             # Run connection tester
npm run publish:client   # Publish to npm
```

### Examples
```bash
npm run examples:umd     # UMD example (script tags)
npm run examples:module  # ES module example
```

## Stream Implementation Pattern
When adding/modifying streams:
1. **Processor** (`app/main/processors/`): Extends `BaseFrameProcessor`, converts Kinect data
2. **Handler** (`app/main/handlers/`): Extends `BaseStreamHandler`, manages frame transmission
3. **Client API** (`client/src/kinectron.js`): Add public methods (e.g., `startColor()`)
4. **Client Handler** (`client/src/streams/streamHandlers.js`): Process incoming frames
5. **Test**: Use stream tester tool

## Debugging System
Flag-based logging system in both app and client:

**Categories**: FRAMES, UI, PEER, PERFORMANCE, DATA, NETWORK, HANDLERS

```javascript
// Enable all debugging
DEBUG.enableAll()

// Enable specific categories
DEBUG.FRAMES = true
DEBUG.PERFORMANCE = true

// Use category-specific loggers
log.frame('Processing frame')
log.performance('Frame took 16ms')
```

## Key Files
- `app/main/kinectController.js`: Kinect hardware interface
- `app/main/managers/peerConnectionManager.js`: WebRTC broadcast
- `app/main/managers/streamManager.js`: Stream lifecycle management
- `client/src/kinectron.js`: Main client API
- `client/src/peer/peerConnection.js`: Client WebRTC connection
- `client/src/streams/streamHandlers.js`: Frame processing

## Monorepo Structure (npm workspaces)
```
kinectron/
├── app/           # Electron application
├── client/        # Client library + tools
│   ├── src/       # Library source
│   └── tools/     # stream-tester, connection-tester
├── examples/      # Example applications
└── memory-bank/   # Legacy Cline docs (to be removed)
```

## Common Issues

### Kinect Won't Open
- Check USB 3.0 connection
- Verify Azure Kinect SDK installed
- Ensure no other app using Kinect
- Check DLL/ONNX files in `app/` folder

### Client Connection Fails
- Verify IP address from app UI
- Check same network (local) or Ngrok configured (remote)
- Firewall blocking connection?
- Enable `DEBUG.PEER = true` for diagnostics

### Parcel Cache Issues
Client changes not reflecting? Run `npm run clean:client` then rebuild

### Naming Convention Inconsistencies
Known issue: Case/format differences between server and client (e.g., "imageData" vs "imagedata", "depth-key" vs "depthKey"). Workarounds exist in stream handlers.

## Remote Connections
Use Ngrok for remote access:
1. Create free account at ngrok.com
2. Enter authtoken in app
3. Click "Create Public Address"
4. Use ngrok URL in client: `new Kinectron('your-url.ngrok-free.app')`

## Block API Feature
"Block API Calls" button prevents clients from controlling Kinect while still streaming data. Useful for performances, teaching, public installations.

## Target Users
- Creative coders (artists, educators)
- Interactive designers
- Researchers (computer vision, HCI)
- Web developers (JavaScript/WebGL)

## Project Goals
1. Modular, maintainable codebase
2. High performance, low latency streaming
3. Simple, intuitive API
4. Modern JavaScript practices
5. Clear documentation

## Contributing
Follow existing patterns, use debugging system (not console.log), add JSDoc comments, test thoroughly with stream tester tool.
