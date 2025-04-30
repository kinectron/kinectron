# Active Context

## Current Focus: Enhancing User Experience and Error Handling

We've completed all stream implementations including color, depth, raw depth, skeleton, key, RGBD, and depth key. All streams are working correctly in both the application and client API. We've now implemented a robust notification system for error handling and improved the user experience when the Kinect device isn't connected. Our focus continues to be on enhancing visualizations, improving error handling, and addressing technical debt such as inconsistent naming conventions.

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
   - RGBD stream fully implemented:
     - Added event listener for rgbd-frame events in app.js
     - Added RGBD canvas div to streamTest HTML
     - Ensured proper data handling and visualization
     - Successfully streaming RGBD data from application to client
   - Depth key stream fully implemented:
     - Fixed naming convention mismatch between server and client
     - Updated server to use 'depth-key' consistently in both frame name and broadcast event
     - Updated client to register handler with 'depth-key' to match server's broadcast event name
     - Implemented Three.js point cloud visualization with body pixel filtering
     - Modified ThreeVisualizer to support filtering out zero values
     - Successfully streaming depth key data from application to client
     - Visualization shows only the person's depth information with background filtered out

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

5. **Error Notification System**:
   - Implemented a reusable notification system for the application
   - Created a NotificationManager class using the singleton pattern
   - Added modal dialog for displaying error messages and troubleshooting steps
   - Implemented DOM-aware initialization that works regardless of when the code runs
   - Added fallback to console notifications when the modal can't be shown
   - Fixed inconsistency between server and renderer error handling
   - Improved user experience by keeping the "Open Kinect" button active even when initialization fails
   - Added clear troubleshooting steps for users when the Kinect device isn't connected

### Next Steps

- **Enhance Visualizations**

  - Improve point cloud visualization quality for depth-based streams
  - Explore alternative visualization techniques if needed
  - Consider adding smoothing or filtering options

- **Address Technical Debt**

  - Review all stream naming conventions across the codebase
  - Standardize on a single naming pattern (either hyphenated or camelCase)
  - Create a comprehensive refactoring plan to implement consistent naming

- **Consider Advanced Features**
  - Joint tracking confidence visualization
  - Motion tracking and analysis
  - Gesture recognition
  - Recording and playback of skeleton data

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

- **Addressing naming convention inconsistencies**:

  1. Identified critical issue where naming conventions don't match between server and client
  2. For depth key stream, server was using 'depthKey' but client expected 'depth-key'
  3. Fixed by updating server to use 'depth-key' consistently
  4. Recognized need for systematic approach to naming conventions
  5. Added to known issues and future work for comprehensive resolution

- **Implementing a robust notification system**:

  1. Created a reusable NotificationManager class using the singleton pattern
  2. Implemented DOM-aware initialization that works regardless of when the code runs
  3. Added fallback to console notifications when the modal can't be shown
  4. Used setTimeout to ensure the DOM is ready before showing notifications
  5. Kept the "Open Kinect" button active even when initialization fails for better UX
  6. Added clear troubleshooting steps for users when the Kinect device isn't connected
  7. Ensured consistent error handling between direct and peer-to-peer initialization paths

- **Implementing robust refresh handling**:
  1. Identified issue where Ctrl+R refresh didn't properly clean up IPC handlers
  2. Implemented comprehensive cleanup in StreamManager to remove all stream-specific handlers
  3. Added special handling for 'start-body-tracking' which follows a different naming pattern
  4. Modified the main process to properly sequence cleanup operations during refresh
  5. Ensured proper reinitialization of resources after renderer reload
