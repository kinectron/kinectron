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
  - Fixed data structure mismatch in bodyFrame handler by extracting nested data
  - Implemented proper skeleton visualization in the client
- **Current Behavior**:
  - Users can start the skeleton feed from the client, which activates the Kinect body tracking
  - The skeleton feed works correctly on the first button click
  - Body data is successfully transmitted from hardware to client
  - Skeleton visualization is displayed in the client with joints and connections
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

### Key Stream Implementation

- **Status**: Completed and working correctly
- **Implementation**:
  - Fixed data structure mismatch between server and client:
    - Server was sending `imageData` (capital 'D') but client was expecting `imagedata` (lowercase 'd')
    - Updated client code to handle both formats for backward compatibility
    - Added normalization in client to ensure consistent data structure
  - Implemented robust initialization pattern based on the body handler:
    - Ensured proper cleanup of previous sessions before starting new ones
    - Added sequential and predictable flow for starting the key stream
    - Improved error handling with try/catch blocks around critical operations
    - Enhanced state management to prevent multiple overlapping initialization attempts
  - Added detailed logging throughout the initialization and streaming process
  - Improved frame callback management to ensure proper resource cleanup
  - Enhanced error handling in the stopStream method to gracefully handle errors
  - Fixed issue with the key stream turning off after a few seconds
  - Successfully streaming key data from application to client
- **Current Behavior**:
  - Users can start the key stream from the client, which activates the Kinect hardware
  - The key stream works correctly on the first button click and stays active
  - Key data (body segmentation) is successfully transmitted from hardware to client
  - Key visualization is displayed in the client
  - The "Stop Stream" button properly stops the stream on both client and server sides

### RGBD Stream Implementation

- **Status**: Completed and working correctly
- **Implementation**:
  - Added event listener for rgbd-frame events in app.js to handle frames from the main process
  - Added RGBD canvas div to streamTest HTML for visualization
  - Added all necessary canvas divs for other streams to maintain consistency
  - Ensured proper data handling and visualization in the client
  - Implemented the same robust initialization pattern used for key stream
  - Applied the same data structure normalization approach to handle both `imageData` and `imagedata` formats
  - Successfully streaming RGBD data from application to client
- **Current Behavior**:
  - Users can start the RGBD stream from the client, which activates the Kinect hardware
  - The RGBD stream works correctly on the first button click and stays active
  - RGBD data is successfully transmitted from hardware to client
  - RGBD visualization is displayed in the client
  - The "Stop Stream" button properly stops the stream on both client and server sides

### Depth Key Stream Implementation

- **Status**: Completed and working correctly
- **Implementation**:
  - Fixed data structure mismatch between server and client:
    - Server was using 'depthKey' (camelCase) but client expected 'depth-key' (hyphenated)
    - Updated server to use 'depth-key' consistently in both frame name and broadcast event
    - Updated client to register handler with 'depth-key' to match server's broadcast event name
  - Implemented robust initialization pattern based on the key handler:
    - Ensured proper cleanup of previous sessions before starting new ones
    - Added sequential and predictable flow for starting the depth key stream
    - Improved error handling with try/catch blocks around critical operations
    - Enhanced state management to prevent multiple overlapping initialization attempts
  - Added detailed logging throughout the initialization and streaming process
  - Implemented Three.js-based point cloud visualization:
    - Modified ThreeVisualizer to support filtering out zero values
    - Added special handling for depth key data to only show body pixels
    - Reused the same visualization approach as raw depth for consistency
  - Used Sharp for image compression with identical settings to raw depth:
    - Lossless WebP compression to preserve depth precision
    - Consistent image processing pipeline for all depth-based streams
  - Successfully streaming depth key data from application to client
- **Current Behavior**:
  - Users can start the depth key stream from the client, which activates the Kinect hardware
  - The depth key stream works correctly on the first button click and stays active
  - Depth key data is successfully transmitted from hardware to client
  - Point cloud visualization shows only the person's depth information (background filtered out)
  - The "Stop Stream" button properly stops the stream on both client and server sides

## In Progress

1. **UI Refinements**:
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

3. **Data Structure and Naming Convention Inconsistencies**:

   - **Issue**: Inconsistent naming conventions between server and client:
     - Case differences (imageData vs. imagedata)
     - Format differences (depth-key vs depthKey)
     - Inconsistent use of hyphens vs camelCase
   - **Symptoms**:
     - Stream handlers fail to process data correctly
     - "No handler found for event" errors
     - Data not being properly visualized
   - **Solution**:
     - Implemented workarounds for specific streams
     - Added normalization code to handle both formats for backward compatibility
   - **Current Status**: Working with current solutions, but needs a systematic approach
   - **Next Steps**:
     - Review all stream naming conventions across the codebase
     - Standardize on a single naming pattern (either hyphenated or camelCase)
     - Create a comprehensive refactoring plan to implement consistent naming

4. **Unpacking Issues in Client Handlers**:

   - **Issue**: Raw data unpacking can be error-prone if not handled consistently
   - **Symptoms**: Incorrect depth values or visualization artifacts
   - **Solution**: Implemented robust unpacking methods with validation
   - **Current Status**: Working correctly but requires careful implementation for each stream type
   - **Next Steps**: Consider creating a unified unpacking utility for all stream types

5. **Stream Initialization Pattern**:
   - **Issue**: Stream initialization can be complex and error-prone
   - **Symptoms**: Streams fail to start or stop correctly
   - **Solution**: Implemented robust initialization pattern with proper cleanup
   - **Current Status**: Working correctly but requires careful implementation for each stream type
   - **Next Steps**: Consider creating a unified initialization utility for all stream types

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

3. **Standardize Naming Conventions**:
   - Review all stream names, event names, and data structure properties
   - Choose a consistent naming convention (hyphenated or camelCase)
   - Implement changes systematically across all files
   - Update documentation to reflect standardized naming
