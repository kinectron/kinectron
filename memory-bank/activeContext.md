# Active Context

## Current Focus: Raw Depth Processing and Visualization

We're currently working on implementing the raw depth stream processing and visualization. The color and depth streams are fully implemented, and we've successfully implemented the raw depth stream with a new approach.

### Current Status

1. **UI Integration**:

   - All streams accessible from the application UI

2. **Stream Implementation**:
   - Color stream fully implemented
   - Depth stream fully implemented
   - Raw depth stream successfully implemented:
     - Client-to-hardware data flow working (client requests properly activate the Kinect)
     - Raw depth image is properly displayed in the application UI
     - Hardware-to-client data flow successfully implemented with data packing solution
     - Client-side unpacking of raw depth data implemented and working correctly
     - Basic point cloud visualization implemented
     - Successfully switched from putting two depth values into a 4-channel pixel to only putting one depth value per four channels
     - Confirmed that the packing/unpacking algorithm works correctly on both server and client sides
     - Implemented lossless WebP compression which preserves all depth values
     - Added size logging which shows messages are ~51KB
     - Resolved "Message too big for JSON channel" errors in PeerJS by changing serialization method from JSON to binary
     - Created a utility for testing data packing/unpacking
     - Added a flag-controlled test value system for debugging
     - Issue with "Stop Stream" button in streamTest.html - it stops the stream in the UI but doesn't stop the stream on the server side

### Next Steps

- **Fix the "Stop Stream" button in streamTest.html**
  - Ensure it properly stops the raw depth stream on the server side
  - Compare with the working implementation in app.js

## Active Decisions

- Using a consistent approach for all data streams:

  1. Process data into image-compatible format
  2. Use Sharp for image compression and conversion
  3. Transmit data as dataURLs
  4. Maintain backward compatibility where possible

- Implementing data packing for raw depth stream:

  1. Pack one 16-bit depth value into each RGBA pixel (using R and G channels)
  2. Include metadata to indicate packed format for client-side unpacking

- Using Three.js for point cloud visualization:

  1. Create a point cloud representation of the depth values
  2. Implement color mapping based on depth values
  3. Add detailed depth statistics and analysis tools

- Prioritizing performance and reliability in the streaming pipeline
