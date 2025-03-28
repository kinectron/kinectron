# Active Context

## Current Focus: Skeleton Feed Implementation

We've completed the raw depth stream implementation, added a comprehensive debugging system for both application and client, and finished refactoring the kinectron-modern client.

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

3. **Debugging System**:

   - Implemented flag-based debugging system for both application and client
   - Added UI controls in streamTest.html for toggling debug flags
   - Created categories for different types of logs (performance, data, network)
   - Reduced console noise by making logs conditional on debug flags

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

- **Implement Skeleton Feed**

  - Add body tracking and skeleton data streaming
  - Implement visualization for skeleton data
  - Ensure compatibility with existing streams

- **Enhance Raw Depth Visualization**
  - Improve point cloud visualization quality
  - Explore alternative visualization techniques if needed

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

- Implementing a structured debugging system:

  1. Flag-based approach with master and category-specific flags
  2. UI controls for toggling debug modes
  3. Console organization with console.group() for related logs
  4. Essential vs. non-essential message differentiation

- Addressing build system challenges:

  1. Use clean script to prevent Parcel caching issues
  2. Document development workflows for consistent results
  3. Implement proper UI state management for stream buttons

- Implementing clear separation between core API and examples:
  1. Core client API in `src/`, examples in `examples/` directory
  2. Improved maintainability through clearer project structure
