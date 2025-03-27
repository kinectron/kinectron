# Active Context

## Current Focus: Raw Depth Processing and Visualization

We're currently working on implementing the raw depth stream processing and visualization. The color and depth streams are fully implemented, and we've made significant progress on the raw depth stream implementation but are facing some challenges with data integrity.

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
     - Confirmed that the packing/unpacking algorithm works correctly on the server side
     - Identified that lossy WebP compression was causing data loss in depth values
     - Implemented lossless WebP compression which should preserve all depth values
     - Added size logging which shows messages are ~51KB
     - Resolved "Message too big for JSON channel" errors in PeerJS by changing serialization method from JSON to binary
     - Created a utility for testing data packing/unpacking
     - Added a flag-controlled test value system for debugging
     - Currently facing data integrity issues where unpacked values don't match original values
     - Test values show significant discrepancies (e.g., Original: 3016, Unpacked: 185)
     - Values near zero are preserved correctly, but larger values show major differences
     - Tried PNG format as an alternative to WebP but encountered similar issues
     - Reverted back to WebP after PNG didn't resolve the data integrity issues

### Next Steps

- **Continue investigating and debugging the client side until we find the root of the issue**
  - Add more detailed logging to understand what's happening during unpacking
  - Compare the client-side unpacking with the server-side packing in more detail
  - Examine how the image data is being processed in the browser
  - Test with different approaches to isolate the problem

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

- Focusing on resolving data integrity issues before moving to visualization improvements
- Prioritizing performance and reliability in the streaming pipeline
