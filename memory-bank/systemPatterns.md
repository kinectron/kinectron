# Kinectron System Patterns

## System Architecture

Kinectron uses a modular architecture separating hardware interaction, data processing, network communication, and debugging within an Electron application.

```mermaid
flowchart TD
    subgraph "Kinectron App"
        KinectHW[Azure Kinect Hardware]
        KinectController[Kinect Controller]
        Processors[Stream Processors]
        Handlers[Stream Handlers]
        PeerManager[Peer Connection Manager]
    end

    subgraph "Web Clients"
        ClientAPI[Kinectron Client API]
        WebApp[Web Application]
    end

    KinectHW --> KinectController --> Processors --> Handlers --> PeerManager <--> ClientAPI --> WebApp
```

## Core Patterns

### Handler/Processor Pattern

Each stream type follows this pattern:

1. **Base Classes**:

   - `BaseFrameProcessor`: Interface for processors
   - `BaseStreamHandler`: Interface for handlers

2. **Specialized Implementations**:

   - Processor classes (e.g., `DepthFrameProcessor`)
   - Handler classes (e.g., `DepthStreamHandler`)

3. **Responsibilities**:
   - **Processor**: Transforms raw Kinect data
   - **Handler**: Manages stream lifecycle and broadcasting

### Event-Driven Communication

1. **IPC Communication**: Main to renderer process via Electron IPC
2. **Peer Communication**: WebRTC-based for real-time streaming
3. **Client API**: Event-based interface with callbacks

## Stream Implementation

```mermaid
flowchart LR
    subgraph "Server-Side"
        SP[Stream Processor]
        SH[Stream Handler]
    end

    subgraph "Client-Side"
        API[API Methods]
        CB[Callback Processing]
    end

    SP --> SH --> API --> CB
```

### Implementation Steps:

1. **Server-Side Processor**: Extends `BaseFrameProcessor`, transforms data
2. **Server-Side Handler**: Extends `BaseStreamHandler`, manages lifecycle
3. **Client-Side API**: Implements stream control methods
4. **Client-Side Processing**: Delivers processed frames to callbacks

## Data Flow

```mermaid
flowchart LR
    KinectHW[Kinect Hardware] --> KinectController --> Processor --> Handler --> PeerManager --> ClientAPI --> UserCallback
```

### Raw Depth Data Flow

```mermaid
flowchart TD
    subgraph "Server-Side"
        KinectHW[Kinect Hardware] --> RawDepthData[Raw 16-bit Depth Data]
        RawDepthData --> PackingProcess[Packing Process]
        PackingProcess --> ImageEncoding[WebP Lossless Encoding]
        ImageEncoding --> DataURL[Data URL Creation]
    end

    subgraph "Client-Side"
        DataURL --> ImageDecoding[Image Decoding]
        ImageDecoding --> UnpackingProcess[Unpacking Process]
        UnpackingProcess --> Uint16Array[Restored 16-bit Depth Values]
        Uint16Array --> Visualization[Point Cloud Visualization]
    end
```

### Body Tracking Data Flow

```mermaid
flowchart TD
    subgraph "Server-Side"
        KinectHW[Kinect Hardware] --> BodyTracking[Body Tracking System]
        BodyTracking --> BodyProcessor[Body Frame Processor]
        BodyProcessor --> Normalization[Joint Coordinate Normalization]
        Normalization --> FramePackaging[Frame Packaging]
    end

    subgraph "Client-Side"
        FramePackaging --> ClientAPI[Client API]
        ClientAPI --> BodyFrameHandler[Body Frame Handler]
        BodyFrameHandler --> SkeletonVisualization[Skeleton Visualization]
    end
```

### Key Stream Data Flow

```mermaid
flowchart TD
    subgraph "Server-Side"
        KinectHW[Kinect Hardware] --> ColorImage[Color Image]
        KinectHW --> BodyIndex[Body Index Map]
        ColorImage --> KeyProcessor[Key Frame Processor]
        BodyIndex --> KeyProcessor
        KeyProcessor --> ImageCompression[Sharp Image Compression]
        ImageCompression --> DataURL[Data URL Creation]
        DataURL --> FramePackaging[Frame Packaging]
    end

    subgraph "Client-Side"
        FramePackaging --> ClientAPI[Client API]
        ClientAPI --> KeyFrameHandler[Key Frame Handler]
        KeyFrameHandler --> ImageProcessing[Image Processing]
        ImageProcessing --> KeyVisualization[Key Visualization]
    end
```

### RGBD Stream Data Flow

```mermaid
flowchart TD
    subgraph "Server-Side"
        KinectHW[Kinect Hardware] --> ColorImage2[Color Image]
        KinectHW --> DepthData[Depth Data]
        ColorImage2 --> RGBDProcessor[RGBD Frame Processor]
        DepthData --> RGBDProcessor
        RGBDProcessor --> AlignmentProcess[Alignment Process]
        AlignmentProcess --> ImageCompression2[Sharp Image Compression]
        ImageCompression2 --> DataURL2[Data URL Creation]
        DataURL2 --> FramePackaging2[Frame Packaging]
    end

    subgraph "Client-Side"
        FramePackaging2 --> ClientAPI2[Client API]
        ClientAPI2 --> RGBDFrameHandler[RGBD Frame Handler]
        RGBDFrameHandler --> ImageProcessing2[Image Processing]
        ImageProcessing2 --> RGBDVisualization[RGBD Visualization]
    end
```

### Body Tracking Initialization Pattern

1. **Sequential Initialization**:

   - First, ensure any previous tracking is stopped
   - Start cameras with the right options
   - Create the body tracker
   - Create the frame callback
   - Start listening for frames

2. **Error Handling**:

   - Try/catch blocks around critical operations
   - Graceful error recovery
   - Detailed logging for diagnostics

3. **State Management**:
   - Track active state to prevent multiple overlapping initialization attempts
   - Ensure proper cleanup before starting new sessions

### Robust Stream Initialization Pattern

This pattern was developed for the key stream and should be applied to all streams:

1. **Sequential Initialization**:

   ```javascript
   // First, ensure any previous tracking is stopped
   if (this.isActive) {
     console.log('Stopping previous session');
     await this.stopStream();

     // Wait a bit to avoid ThreadSafeFunction error when switching feeds
     await new Promise((resolve) => setTimeout(resolve, 500));
   }

   // Start cameras with the right options
   const success = this.kinectController.startKeyCamera({
     ...KinectOptions.KEY,
   });

   if (success) {
     this.isActive = true;

     // Wait for body tracker to initialize if needed
     await new Promise((resolve) => setTimeout(resolve, 1000));

     // Create the frame callback
     this.createFrameCallback(event);

     // Start listening for frames
     if (!this.isMultiFrame) {
       this.kinectController.startListening(this.frameCallback);
     }
   }
   ```

2. **Comprehensive Error Handling**:

   ```javascript
   try {
     // Stream initialization code
   } catch (error) {
     console.error('Error in stream initialization:', error);
     return this.handleError(error, 'starting stream');
   }
   ```

3. **Robust Stream Stopping**:

   ```javascript
   async stopStream() {
     try {
       // Only try to stop listening if we have a callback
       if (this.frameCallback) {
         try {
           await this.kinectController.stopListening();
         } catch (error) {
           console.warn('Error stopping listening (may be normal):', error.message);
         }
         this.frameCallback = null;
       }

       // Stop cameras
       try {
         await this.kinectController.stopCameras();
       } catch (error) {
         console.warn('Error stopping cameras:', error.message);
       }

       this.isActive = false;

       // Notify peers that stream has stopped
       if (this.peerManager && this.peerManager.isConnected) {
         this.peerManager.broadcast('feed', {
           feed: 'stop',
           type: 'key',
         });
       }
     } catch (error) {
       console.error('Error in stopStream:', error);
       this.handleError(error, 'stopping stream');
     }
   }
   ```

4. **Detailed Logging**:
   - Log each step of the initialization process
   - Log success or failure of each operation
   - Include relevant data in logs for debugging

### Raw Depth Packing Strategy

1. **Current Implementation**:
   - One 16-bit depth value per RGBA pixel
   - Lower 8 bits stored in R channel
   - Upper 8 bits stored in G channel
   - B and A channels unused (set to 0 and 255)
   - Unpacking: `depth = (G << 8) | R`

## Component Relationships

1. **KinectController**: Manages hardware interface
2. **Stream Processors**: Transform specific data types
3. **Stream Handlers**: Manage stream lifecycle
4. **PeerConnectionManager**: Handles WebRTC connections
5. **Client API**: Provides interface for web applications
6. **Debugging System**: Controls logging and diagnostics

## Design Patterns Used

1. **Factory Pattern**: Creating processors and handlers
2. **Observer Pattern**: Event handling and notification
3. **Strategy Pattern**: Different processing strategies
4. **Template Method**: Base classes defining algorithms
5. **Adapter Pattern**: Converting between data formats
6. **Facade Pattern**: Simplified debugging interface
7. **Singleton Pattern**: NotificationManager for centralized error handling

## Notification System Architecture

```mermaid
flowchart TD
    subgraph "Notification System"
        NM[NotificationManager]
        Modal[Modal Dialog]
        Status[Status Indicator]
        Console[Console Fallback]
    end

    subgraph "Application Components"
        App[App.js]
        PeerController[PeerController.js]
        KinectInit[Kinect Initialization]
        ErrorHandling[Error Handling]
    end

    NM --> Modal
    NM --> Status
    NM --> Console

    App --> NM
    PeerController --> NM
    KinectInit --> ErrorHandling --> NM
```

### Notification System Implementation

1. **Singleton Pattern**:

   - Single NotificationManager instance shared across the application
   - Ensures consistent notification handling regardless of entry point
   - Prevents multiple modal dialogs from appearing simultaneously

2. **DOM-Aware Initialization**:

   ```javascript
   initializeModal() {
     // Check if document is already loaded
     if (
       document.readyState === 'complete' ||
       document.readyState === 'interactive'
     ) {
       this._setupModalElements();
     } else {
       // Wait for DOM to be fully loaded
       document.addEventListener('DOMContentLoaded', () => {
         this._setupModalElements();
       });
     }
   }
   ```

3. **Fallback Mechanism**:

   ```javascript
   showModal(options) {
     // Ensure modal elements are initialized
     if (!this._ensureInitialized()) {
       console.error('Modal elements could not be initialized');
       // Fallback to console notification
       console.warn(
         'NOTIFICATION:',
         options.title,
         '-',
         options.message,
       );
       if (options.details) {
         console.warn('Details:', options.details);
       }
       return;
     }

     // Modal display code...
   }
   ```

4. **Asynchronous DOM Handling**:

   - Uses setTimeout to ensure the DOM is ready before showing notifications
   - Prevents race conditions between initialization and notification display
   - Ensures consistent behavior across different initialization paths

5. **User Experience Considerations**:
   - Keeps the "Open Kinect" button active even when initialization fails
   - Provides clear troubleshooting steps for users
   - Ensures consistent error handling between direct and peer-to-peer initialization paths

## Refresh Handling Pattern

```mermaid
flowchart TD
    subgraph "Refresh Process"
        Refresh[Ctrl+R Refresh] --> WillNavigate[will-navigate Event]
        WillNavigate --> CleanupIPC[Clean up IPC Handlers]
        CleanupIPC --> CloseKinect[Close Kinect Resources]
        CloseKinect --> ClosePeer[Close Peer Resources]
        ClosePeer --> Reload[Renderer Reloads]
        Reload --> DidFinishLoad[did-finish-load Event]
        DidFinishLoad --> ReinitPeer[Reinitialize Peer Server]
        ReinitPeer --> ReinitIPC[Reinitialize IPC Handler]
    end
```

1. **Sequential Cleanup**:

   - First clean up the StreamManager to remove all IPC handlers
   - Then close Kinect and peer resources
   - Allow the renderer process to reload

2. **Comprehensive IPC Handler Removal**:

   ```javascript
   // Remove all stream-specific handlers
   const streamTypes = [
     'color',
     'depth',
     'raw-depth',
     'skeleton',
     'key',
     'depth-key',
     'rgbd',
   ];

   streamTypes.forEach((type) => {
     ipcMain.removeHandler(`start-${type}-stream`);
   });

   // Also remove handlers with different naming patterns
   ipcMain.removeHandler('start-body-tracking');
   ```

3. **Resource Reinitialization**:
   - Check if peer server needs to be reinitialized after reload
   - Reinitialize IPC handler to ensure all event listeners are set up
   - Ensure proper error handling during reinitialization

## Data Structure Handling Patterns

### Event Data Structure Mismatches

A critical pattern to be aware of is the potential mismatch between data structures in the event pipeline:

```mermaid
flowchart LR
    Server[Server Event] --> PeerConn[Peer Connection] --> ClientAPI[Client API] --> Handler[Stream Handler] --> Callback[User Callback]
```

**Problem**: Data structures can be nested differently than expected between event producers and consumers.

**Example 1**: In the bodyFrame handler, data was coming in as:

```javascript
{
  data: {
    bodies: [...],
    numBodies: 1
  },
  name: "bodyFrame",
  timestamp: 1743208345517
}
```

But the handler was looking for `data.bodies` directly, causing the callback to never be called.

**Solution**: Extract the nested data before processing:

```javascript
export function createBodyHandler(callback) {
  return (eventData) => {
    const bodyData = eventData.data;
    if (bodyData && bodyData.bodies) {
      callback({
        bodies: bodyData.bodies,
        timestamp: bodyData.timestamp || Date.now(),
        floorClipPlane: bodyData.floorClipPlane,
        trackingId: bodyData.trackingId,
      });
    }
  };
}
```

**Example 2**: In the key stream handler, the server was sending `imageData` (capital 'D') but the client was expecting `imagedata` (lowercase 'd').

**Solution**: Normalize the data structure in the client to handle both formats:

```javascript
// Check for both imagedata and imageData formats
const imageData = frameData.imagedata || frameData.imageData;

if (imageData && imageData.data) {
  // Process the image data
}
```

**Best Practices**:

1. Add proper logging at the beginning of handler functions to verify data structure
2. Standardize data extraction across all handlers
3. Make handlers resilient to different data formats
4. Use consistent naming conventions for data properties
5. Document expected data structures in code comments

## Debugging System Architecture

```mermaid
flowchart TD
    subgraph "Main Process"
        AppDebug[DEBUG Object]
        DebugFlags[Debug Flags]
        LogFunctions[Log Utility Functions]
        ConditionalLogs[Conditional Logging]
    end

    subgraph "Renderer Process"
        RendererDebug[DEBUG Object]
        RendererFlags[Debug Flags]
        RendererLogFunctions[Log Utility Functions]
        RendererLogs[Conditional Logging]
    end

    subgraph "Client"
        ClientDebug[DEBUG Object]
        ClientFlags[Debug Flags]
        ClientUI[Debug UI Controls]
        ClientLogs[Conditional Logging]
    end

    AppDebug --> DebugFlags --> LogFunctions --> ConditionalLogs
    RendererDebug --> RendererFlags --> RendererLogFunctions --> RendererLogs
    ClientDebug --> ClientFlags --> ClientLogs
    ClientUI --> ClientFlags
```

### Debugging System Implementation

1. **Flag-Based Control**:

   - Category-based flags for specific log types:
     - FRAMES: For frame processing and transmission logs
     - UI: For UI-related logs
     - PEER: For peer connection logs
     - PERFORMANCE: For performance-related logs
     - DATA: For data integrity logs
     - NETWORK: For network-related logs
     - HANDLERS: For stream handler operations
   - All flags default to false (disabled)
   - Helper methods to enable/disable all flags at once

2. **Log Utility Functions**:

   - `log.error()`: Always visible, for error messages
   - `log.warn()`: Always visible, for warning messages
   - `log.info()`: Always visible, for important information
   - `log.frame()`: Only visible when FRAMES flag is enabled
   - `log.ui()`: Only visible when UI flag is enabled
   - `log.peer()`: Only visible when PEER flag is enabled
   - `log.debug(flag, message)`: Only visible when specified flag is enabled
   - `log.handler()`: Only visible when HANDLERS flag is enabled

3. **UI Integration**:

   - Checkbox controls in streamTest.html
   - Master toggle enables/disables all debugging
   - Category toggles for fine-grained control

4. **Conditional Logging**:
   - Console logs wrapped with flag checks
   - Console.group() for organizing related logs
   - Essential logs (errors, warnings, important info) always visible
   - Non-essential logs (debug, frame, UI) only visible when flags are enabled
   - Consistent logging pattern across all components

## Build System and Development Workflow

```mermaid
flowchart TD
    subgraph "Development Process"
        Clean[Clean Cache]
        Build[Build Client Library]
        Serve[Serve StreamTest]
        Test[Test in Browser]
    end

    subgraph "File Organization"
        SrcFiles[ES Module Source Files (src/)]
        ExampleFiles[Example Applications (examples/)]
        HTMLFiles[HTML Entry Points]
        StyleFiles[CSS Files]
    end

    Clean --> Build --> Serve --> Test
    SrcFiles --> Build
    ExampleFiles --> Serve
    HTMLFiles --> Serve
    StyleFiles --> Serve
```

### Build System Implementation

1. **Parcel Bundler**:

   - Zero-configuration bundler for web applications
   - Handles JavaScript, HTML, CSS, and assets
   - Provides development server with hot module replacement
   - Requires cache management for direct script includes

2. **File Organization**:

   - `src/`: Core client API files (ES modules)
   - `examples/`: Example applications and testing interfaces
     - `streamTest/`: Stream testing interface with visualization tools
     - `test/`: Simple connection testing interface
   - `dist/`: Build output directory (generated by Parcel)

3. **Development Workflow**:
   - Clean script removes cache and build artifacts
   - Build process compiles ES modules into browser-compatible code
   - Serve process starts development server with live reloading
   - Browser testing validates functionality
