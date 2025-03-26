# Kinectron Project Brief

## Project Overview

Kinectron enables real-time streaming of Microsoft Azure Kinect data into web browsers using WebRTC. The project is a refactored version supporting Azure Kinect with a modular JavaScript architecture.

## Core Technology

- **App**: Electron-based desktop application
- **Client**: Browser JavaScript API
- **Communication**: WebRTC via PeerJS
- **Hardware**: Microsoft Azure Kinect

## Architecture

1. **Application (`app/`)**: Electron main/renderer processes, stream processors and handlers
2. **Client API (`client/`)**: Modern and legacy-compatible APIs

## Current Status

- Application refactoring complete
- Peer communication functional
- Color and Depth streams implemented
- Raw Depth stream implementation fixed
- Planned: Key, Depth Key, RGBD

## Data Flow

1. **Acquisition**: KinectController interfaces with hardware
2. **Processing**: Stream-specific processors convert data
3. **Distribution**: PeerConnectionManager broadcasts to clients
4. **Presentation**: Client API delivers frames to applications

## Implementation Pattern

Each stream follows:

1. Server-side processor for data conversion
2. Server-side handler for frame management
3. Client-side API methods
4. Client-side frame processing

## Project Goals

1. Create modular, maintainable codebase
2. Improve performance and stability
3. Support modern JavaScript practices
4. Enable creative web applications using Kinect data
5. Provide clear documentation and examples
