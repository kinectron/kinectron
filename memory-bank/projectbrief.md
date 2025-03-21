# Kinectron Project Brief

## Project Overview

Kinectron is an open-source tool that enables real-time streaming of Microsoft Kinect data into web browsers and across networks. Originally released in 2016, the project is now being refactored to work exclusively with Azure Kinect, dropping support for Windows Kinect, while modernizing the codebase into modular JavaScript.

## Core Technology Stack

- **Application**: Electron-based desktop application
- **Client API**: Browser-based JavaScript API
- **Communication**: WebRTC via PeerJS for real-time data streaming
- **Hardware**: Microsoft Azure Kinect
- **Build Tools**: Parcel for client-side bundling

## Architecture

1. **Application (`app/`)**

   - Electron Main Process: Manages peer server and Kinect hardware
   - Electron Renderer Process: Handles UI
   - Stream processors and handlers for different data types

2. **Client API (`client/`)**
   - Modern JavaScript API (kinectron-modern.js)
   - Legacy backward-compatible API (kinectron-client.js)
   - Connects to Kinectron app via PeerJS
   - Processes and presents Kinect data to web applications

## Current Status

- Application refactoring is complete
- Peer communication is functional
- Color stream implementation is complete
- **Depth stream implementation is complete (mapped to 0-255 grayscale)**
- **Raw Depth stream implementation is in progress**
- **Additional streams planned: Key, Depth Key, RGBD**

## Data Flow Architecture

1. **Acquisition**: KinectController interfaces with Kinect hardware
2. **Processing**: Stream-specific processors convert raw data
3. **Distribution**: PeerConnectionManager broadcasts to clients
4. **Presentation**: Client API processes and delivers frames to applications

## Stream Types

1. **Color Stream**: RGB camera data (Implemented)
2. **Depth Stream**: Distance/depth map data, mapped to 0-255 grayscale (Implemented)
3. **Raw Depth**: Unprocessed depth values (In Progress)
4. **Key**: Color-based foreground extraction
5. **Depth Key**: Depth-based foreground extraction
6. **RGBD**: Combined RGB and depth data

## Implementation Pattern

Each stream follows a consistent pattern:

1. Server-side processor for raw data conversion
2. Server-side handler for frame management
3. Client-side API methods for starting/stopping streams
4. Client-side frame processing and callback delivery

## Testing Approach

1. **Peer Connection Testing**: Basic connectivity testing
2. **Stream Testing**: Dedicated tests for each stream type
3. **End-to-End Testing**: Complete workflow validation

## Key Challenges

1. Maintaining high frame rates for real-time applications
2. Efficient processing of large image/sensor data
3. Memory management and optimization
4. Backward compatibility with existing applications
5. Cross-platform reliability

## Project Goals

1. Create a modular, maintainable codebase
2. Improve performance and stability
3. Support modern JavaScript practices
4. Enable creative applications using Kinect data in web environments
5. Provide clear documentation and examples

## Next Steps

1. Complete raw depth stream implementation
2. Implement remaining stream types in priority order: Key, Depth Key, RGBD
3. Comprehensive testing across platforms
4. Performance optimization
5. Documentation and example applications
