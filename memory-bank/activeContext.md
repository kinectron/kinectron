# Active Context

## Current Focus: Raw Depth Processing and Visualization

We're currently working on implementing the raw depth stream processing and visualization. The color and depth streams are fully implemented, and we've made significant progress on the raw depth stream implementation but are facing some challenges with the visualization quality.

### Current Status

1. **UI Integration**:

   - All streams accessible from the application UI

2. **Stream Implementation**:
   - Color stream fully implemented
   - Depth stream fully implemented
   - Raw depth stream partially implemented:
     - Client-to-hardware data flow working (client requests properly activate the Kinect)
     - Raw depth image is properly displayed in the application UI
     - Hardware-to-client data flow successfully implemented with data packing solution
     - Client-side unpacking of raw depth data implemented
     - Basic point cloud visualization implemented
     - Facing issues with depth value quantization/banding in visualization
     - Confirmed that the packing/unpacking algorithm works correctly (test values match exactly)
     - Identified that lossy WebP compression was causing data loss in depth values
     - Implemented lossless WebP compression which preserves all depth values exactly
     - Added size logging which shows messages are ~51KB
     - Encountering "Message too big for JSON channel" errors in PeerJS
     - Created a utility for testing data packing/unpacking
     - Added a flag-controlled test value system for debugging

### Next Steps

1. **Address PeerJS Message Size Issue**:

   - Resolve the "Message too big for JSON channel" error in PeerJS
   - Investigate solutions for transmitting large messages

2. **Fix Raw Depth Visualization Issues**:

   - Once transmission issues are resolved, return to visualization quality issues
   - Try different rendering techniques for the point cloud
   - Experiment with mesh-based visualization instead of points
   - Consider applying smoothing or interpolation to the depth data

3. **Streaming Optimization**:

   - Optimize data transmission between application and client
   - Reduce latency in stream delivery
   - Improve compression for better performance

## Active Decisions

- Using a consistent approach for all data streams:

  1. Process data into image-compatible format
  2. Use Sharp for image compression and conversion
  3. Transmit data as dataURLs
  4. Maintain backward compatibility where possible

- Implementing data packing for raw depth stream:

  1. Pack two 16-bit depth values into each RGBA pixel (using all 4 channels)
  2. Reduce message size by approximately 50% while preserving all depth data
  3. Include metadata to indicate packed format for client-side unpacking

- Using Three.js for point cloud visualization:

  1. Create a point cloud representation of the depth values
  2. Implement color mapping based on depth values
  3. Add detailed depth statistics and analysis tools

- Focusing on completing all stream types before moving to additional features
- Prioritizing performance and reliability in the streaming pipeline
