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
    subgraph "Application"
        AppDebug[DEBUG Object]
        DebugFlags[Debug Flags]
        LogFunctions[Conditional Logging]
    end

    subgraph "Client"
        ClientDebug[DEBUG Object]
        ClientFlags[Debug Flags]
        ClientUI[Debug UI Controls]
        ClientLogs[Conditional Logging]
    end

    AppDebug --> DebugFlags --> LogFunctions
    ClientDebug --> ClientFlags --> ClientLogs
    ClientUI --> ClientFlags
```

### Debugging System Implementation

1. **Flag-Based Control**:

   - Master flags for component-level control (e.g., RAW_DEPTH)
   - Category flags for specific log types (PERFORMANCE, DATA, PEER)
   - All flags default to false (disabled)

2. **UI Integration**:

   - Checkbox controls in streamTest.html
   - Master toggle enables/disables all debugging
   - Category toggles for fine-grained control

3. **Conditional Logging**:
   - Console logs wrapped with flag checks
   - Console.group() for organizing related logs
   - Essential vs. non-essential message differentiation

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
