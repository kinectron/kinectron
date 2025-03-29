# Active Context

## Current Focus: Depth-Key and RGBD Stream Implementation

We've completed the raw depth stream implementation, added a comprehensive debugging system, finished refactoring the kinectron-modern client, fixed the skeleton feed initialization issue, successfully implemented the skeleton visualization in the streamTest client, and now completed the key stream implementation.

### Current Status

1. **UI Integration**:

   - All streams accessible from the application UI

2. **Stream Implementation**:

   - Color stream fully implemented and visualized correctly
   - Depth stream fully implemented
   - Raw depth stream fully implemented:
     - Client-to-hardware data flow working
     - Raw depth image properly displayed in the application UI
     - Hardware-to-client data flow working with data packing solution
     - Client-side unpacking of raw depth data working correctly
     - Point cloud visualization implemented
     - Lossless WebP compression preserving all depth values
     - "Stop Stream" button now working correctly in streamTest.html
   - Skeleton feed fully implemented:
     - Fixed initialization issue that prevented the feed from working on first button click
     - Implemented a more robust approach to starting and stopping the body tracking system
     - Improved error handling and state management
     - Body data now successfully streaming from application to client
   - Key stream fully implemented:
     - Fixed data structure mismatch between server and client (imageData vs. imagedata)
     - Implemented robust initialization pattern based on the body handler
     - Enhanced error handling and resource cleanup
     - Added detailed logging for better diagnostics
     - Ensured proper frame callback management
     - Successfully streaming key data from application to client

3. **Debugging System**:

   - Implemented flag-based debugging system for both application and client
   - Added UI controls in streamTest.html for toggling debug flags
   - Created categories for different types of logs (performance, data, network)
   - Reduced console noise by making logs conditional on debug flags
   - Enhanced logging in body tracking system for better diagnostics

4. **StreamTest Refactoring**:
   - Reorganized example files into dedicated examples/ directory structure
   - Moved streamTest and test files to their respective subdirectories
   - Updated all references and import paths to maintain functionality
   - Updated package.json scripts and documentation
   - Resolved Parcel caching issues affecting development workflow
   - Added clean script to package.json to prevent caching problems
   - Created DEVELOPMENT.md to document development workflows and known issues
   - Fixed Kinect initialization button functionality
   - Implemented proper p5.js instance mode usage
   - Fixed visualization issues with color stream
   - Resolved frameRate error in metrics controller

### Next Steps

- **Implement Depth-Key Stream in Client**

  - Add depth-key stream visualization to streamTest client
  - Ensure proper data handling and visualization
  - Apply lessons learned from key stream implementation

- **Implement RGBD Stream in Client**

  - Add RGBD stream visualization to streamTest client
  - Ensure proper data handling and visualization
  - Apply lessons learned from key stream implementation

- **Enhance Raw Depth Visualization**
  - Improve point cloud visualization quality
  - Explore alternative visualization techniques if needed

## Active Decisions

- **Handling data structure mismatches in stream handlers**:

  1. Identified critical issue where data structures don't match between event producers and consumers
  2. In bodyFrame handler, data was nested as `{data: {bodies: [...]}}` but handler expected `{bodies: [...]}`
  3. Fixed by extracting nested data with `const bodyData = eventData.data`
  4. Standardized approach across all stream handlers to handle both `imageData` and `imagedata` formats
  5. Added proper logging to prevent similar issues in the future

- **Using a consistent approach for all data streams**:

  1. Process data into image-compatible format
  2. Use Sharp for image compression and conversion
  3. Transmit data as dataURLs
  4. Maintain backward compatibility where possible

- **Implementing data packing for raw depth stream**:

  1. Pack one 16-bit depth value into each RGBA pixel (using R and G channels)
  2. Include metadata to indicate packed format for client-side unpacking

- **Using Three.js for point cloud visualization**:

  1. Create a point cloud representation of the depth values
  2. Implement color mapping based on depth values
  3. Add detailed depth statistics and analysis tools

- **Implementing a structured debugging system**:

  1. Flag-based approach with master and category-specific flags
  2. UI controls for toggling debug modes
  3. Console organization with console.group() for related logs
  4. Essential vs. non-essential message differentiation

- **Addressing build system challenges**:

  1. Use clean script to prevent Parcel caching issues
  2. Document development workflows for consistent results
  3. Implement proper UI state management for stream buttons

- **Implementing clear separation between core API and examples**:

  1. Core client API in `src/`, examples in `examples/` directory
  2. Improved maintainability through clearer project structure

- **Robust stream initialization pattern**:
  1. Follow a more sequential and predictable flow for starting streams
  2. Ensure proper cleanup of previous sessions before starting new ones
  3. Improve error handling and state management
  4. Use a simpler approach based on the legacy code pattern
  5. Add detailed logging at each step of the initialization process
  6. Implement proper resource cleanup on stream stop
