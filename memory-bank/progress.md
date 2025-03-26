# Progress

## What Works

- Peer-to-peer connection between server and client
- Color stream visualization
- Depth stream visualization (processed depth images)
- Body tracking
- Key (green screen) functionality
- RGBD (color + depth) visualization
- Raw depth data transmission from hardware to client
- Raw depth data unpacking on client side
- Basic point cloud visualization of raw depth data

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

## Partially Completed Features

### Raw Depth Stream Implementation

- **Status**: Partially completed
- **Implementation**:
  - Client-to-hardware data flow working (client requests properly activate the Kinect)
  - Raw depth image is properly displayed in the application UI
  - Hardware-to-client data flow successfully implemented with data packing solution
  - Implemented data packing to reduce message size by ~50% while preserving all depth data
  - Added metadata to indicate packed format for client-side unpacking
  - Successfully transmitting raw depth data from hardware to client
  - Implemented client-side unpacking of raw depth data
  - Created `_unpackRawDepthData` method in `kinectron-modern.js`
  - Implemented Three.js-based point cloud visualization
  - Added depth value analysis and statistics
  - Added test utilities for verifying packing/unpacking correctness
  - Confirmed that the packing/unpacking algorithm preserves all depth values exactly
  - Switched from lossy to lossless WebP compression to preserve depth precision
  - Added size logging to monitor message sizes
  - Implemented flag-controlled test value system for debugging
- **Current Behavior**:
  - Users can start the raw depth stream from the client, which activates the Kinect hardware
  - Raw depth data is successfully transmitted from hardware to client
  - Client unpacks the raw depth data into 16-bit depth values
  - Basic point cloud visualization is displayed but has quality issues
  - Encountering "Message too big for JSON channel" errors in PeerJS
- **Remaining Work**:
  - Address the PeerJS message size issue
  - Fix depth value quantization/banding issues in visualization
  - Enhance the point cloud visualization for better quality

## Known Issues

1. **Raw Depth Visualization Quality**:

   - **Issue**: Depth data appears in distinct planes rather than smooth contours
   - **Symptoms**: Banding/quantization effect in the point cloud visualization
   - **Attempted Fixes**:
     - Removed scaling operations that could reduce precision
     - Implemented more sophisticated color mapping
     - Added detailed depth statistics and analysis tools
     - Improved camera positioning and controls
     - Confirmed packing/unpacking algorithm works correctly (test values match exactly)
     - Identified lossy WebP compression as a source of data loss
     - Implemented lossless WebP compression to preserve all depth values
   - **Current Status**: Visualization issues may be resolved once transmission issues are fixed
   - **Next Steps**: Address transmission issues, then re-evaluate visualization quality

2. **PeerJS Message Size Limitation**:
   - **Issue**: "Message too big for JSON channel" error in PeerJS
   - **Symptoms**: Error occurs in the renderer process during PeerJS transmission
   - **Findings**:
     - Message size is approximately 51KB (after base64 encoding)
     - Removed test values from transmitted data to reduce size
     - Added size logging to monitor message sizes
   - **Current Status**: Issue persists despite message size being below theoretical limit
   - **Next Steps**: Investigate solutions for transmitting large messages via PeerJS

## Future Work

1. **Address PeerJS Message Size Issue**:

   - Resolve the "Message too big for JSON channel" error
   - Implement a solution for transmitting large messages

2. **Fix Raw Depth Visualization Issues**:
   - Once transmission issues are resolved, re-evaluate visualization quality
   - Explore alternative visualization techniques if needed
