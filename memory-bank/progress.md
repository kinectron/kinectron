# Progress

## What Works

- Peer-to-peer connection between server and client
- Color stream visualization
- Depth stream visualization (processed depth images)
- Body tracking and skeleton feed
- Key (green screen) functionality
- RGBD (color + depth) visualization
- Raw depth data transmission from hardware to client
- Raw depth data unpacking on client side
- Point cloud visualization of raw depth data
- Debugging system with flag-based controls

## Completed Features

### UI Integration for Streams

- **Status**: Completed and working correctly
- **Implementation**: All available streams accessible from application UI buttons
- **Current Behavior**: Users can activate streams directly from the application interface
- **Streams Available**: Color, Depth, Raw Depth, Body, Key, RGBD

### Color Stream Implementation

- **Status**: Completed and working correctly
- **Implementation**: Full pipeline from hardware to client
- **Current Behavior**: Server captures, processes, and transmits color data; client receives and visualizes

### Depth Stream Implementation

- **Status**: Completed and working correctly
- **Implementation**: Full pipeline from hardware to client
- **Current Behavior**: Server captures, processes, and transmits depth data; client receives and visualizes

### Raw Depth Stream Implementation

- **Status**: Completed and working correctly
- **Implementation**:
  - Client-to-hardware data flow working (client requests properly activate the Kinect)
  - Raw depth image is properly displayed in the application UI
  - Hardware-to-client data flow successfully implemented with data packing solution
  - Successfully switched from putting two depth values into a 4-channel pixel to only putting one depth value per four channels
  - Added metadata to indicate packed format for client-side unpacking
  - Successfully transmitting raw depth data from hardware to client
  - Implemented client-side unpacking of raw depth data
  - Created `_unpackRawDepthData` method in `kinectron-modern.js`
  - Implemented Three.js-based point cloud visualization
  - Added depth value analysis and statistics
  - Added test utilities for verifying packing/unpacking correctness
  - Confirmed that the packing/unpacking algorithm works correctly on both server and client sides
  - Switched from lossy to lossless WebP compression to preserve depth precision
  - Added size logging to monitor message sizes
  - Implemented flag-controlled test value system for debugging
  - Resolved "Message too big for JSON channel" errors by changing PeerJS serialization method from JSON to binary
  - Fixed "Stop Stream" button in streamTest.html to properly stop the stream on the server side
- **Current Behavior**:
  - Users can start the raw depth stream from the client, which activates the Kinect hardware
  - Raw depth data is successfully transmitted from hardware to client
  - Client unpacks the raw depth data into 16-bit depth values correctly
  - Point cloud visualization is displayed
  - The "Stop Stream" button in streamTest.html properly stops the stream on both client and server sides

### Skeleton Feed Implementation

- **Status**: Completed and working correctly
- **Implementation**:
  - Fixed initialization issue that prevented the feed from working on first button click
  - Simplified the body tracking initialization process based on the legacy code pattern
  - Implemented a more robust approach to starting and stopping the body tracking system
  - Improved error handling with try/catch blocks and more graceful error recovery
  - Enhanced state management to prevent multiple overlapping initialization attempts
  - Added detailed logging to help diagnose issues
  - Ensured proper cleanup of previous tracking sessions before starting new ones
- **Current Behavior**:
  - Users can start the skeleton feed from the client, which activates the Kinect body tracking
  - The skeleton feed works correctly on the first button click
  - Body data is successfully transmitted from hardware to client
  - Basic skeleton visualization is displayed in the client
  - The "Stop Stream" button properly stops the stream on both client and server sides

### Debugging System Implementation

- **Status**: Completed and working correctly
- **Implementation**:
  - Created debug.js files for both application and client
  - Implemented a consistent DEBUG object structure across both environments
  - Added flag-based controls for different logging categories:
    - RAW_DEPTH: Master switch for raw depth logging
    - PERFORMANCE: For performance-related logs
    - DATA: For data integrity logs
    - PEER: For peer connection logs
  - Added UI controls in streamTest.html for toggling debug flags
  - Wrapped console logs with appropriate debug flag checks
  - Used console.group() for better organization of related logs
  - Added essential vs. non-essential message differentiation in debug panel
  - Implemented conditional logging in peerConnection.js using DEBUG.PEER flag
  - Added PEER debug checkbox to streamTest UI
  - Enhanced logging in body tracking system for better diagnostics
- **Current Behavior**:
  - Debug logging is disabled by default
  - Users can enable specific categories of logging as needed
  - Console output is clean and organized when debugging is enabled
  - Debug panel only shows essential information by default
  - Peer connection logs can be toggled independently from other debug logs

### StreamTest Refactoring

- **Status**: Completed and working correctly
- **Implementation**:
  - Refactored streamTest.html into modular components
  - Created separate controller files for different functionalities
  - Reorganized file structure with dedicated examples/ directory
  - Updated references, paths, and documentation
  - Resolved Parcel caching issues affecting development workflow
  - Added clean script to package.json to prevent caching problems
  - Created DEVELOPMENT.md to document development workflows
  - Implemented proper UI button state management with isKinectInitialized flag
  - Fixed Kinect initialization button functionality
  - Implemented proper p5.js instance mode usage
  - Fixed visualization issues with color stream
  - Resolved frameRate error in metrics controller by using p5 instance
- **Current Behavior**:
  - Peer connection established automatically on page load
  - Initialize Kinect button only initializes the Kinect hardware
  - Color, depth, raw depth, and skeleton streams working correctly
  - Proper visualization of all streams
  - Accurate metrics display with correct frameRate calculation

## In Progress

1. **Skeleton Visualization Enhancement**:

   - **Status**: In progress
   - **Current Focus**:
     - Improving the visualization of skeleton data in the client
     - Adding more features like joint labels or different visualization modes
     - Ensuring proper rendering of multiple bodies
   - **Next Steps**:
     - Enhance the P5 visualizer to better represent the skeleton data
     - Add options for different visualization styles
     - Implement proper handling of multiple bodies

2. **UI Refinements**:
   - **Status**: In progress
   - **Current Focus**:
     - Ensuring consistent UI behavior across all components
     - Improving error handling and user feedback
   - **Next Steps**:
     - Complete the refactoring of remaining components
     - Implement comprehensive testing of all UI interactions

## Known Issues

1. **Raw Depth Visualization Quality**:

   - **Issue**: Depth data appears in distinct planes rather than smooth contours
   - **Symptoms**: Banding/quantization effect in the point cloud visualization
   - **Attempted Fixes**:
     - Removed scaling operations that could reduce precision
     - Implemented more sophisticated color mapping
     - Added detailed depth statistics and analysis tools
     - Improved camera positioning and controls
   - **Current Status**: Visualization quality can be improved now that data integrity issues are resolved
   - **Next Steps**: Enhance visualization techniques for better quality

2. **Parcel Build System Caching**:
   - **Issue**: Parcel's caching mechanism can cause issues with directly included JavaScript files
   - **Symptoms**: Changes to files in the `examples/streamTest/js/controllers/` directory don't appear in the browser
   - **Solution**: Added clean script to package.json and documented the issue in DEVELOPMENT.md
   - **Current Status**: Resolved with workaround, but requires awareness during development

## Future Work

1. **Enhance Raw Depth Visualization**:

   - Improve point cloud visualization quality
   - Explore alternative visualization techniques if needed
   - Consider adding smoothing or filtering options

2. **Add Advanced Features**:
   - Joint tracking confidence visualization
   - Motion tracking and analysis
   - Gesture recognition
   - Recording and playback of skeleton data
