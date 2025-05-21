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

### Stream-Specific Data Flows

#### Raw Depth Data Flow

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

#### Body Tracking Data Flow

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

### Stream Initialization Pattern

1. **Sequential Initialization**:

   - Stop any previous tracking
   - Start cameras with appropriate options
   - Create frame callback
   - Start listening for frames

2. **Error Handling**:

   - Try/catch blocks around critical operations
   - Graceful error recovery

3. **State Management**:
   - Track active state to prevent overlapping initialization
   - Ensure proper cleanup before starting new sessions

### Raw Depth Packing Strategy

- One 16-bit depth value per RGBA pixel
- Lower 8 bits stored in R channel
- Upper 8 bits stored in G channel
- Unpacking: `depth = (G << 8) | R`

### Frame Dropping and Buffering Strategy

- All streams use lossy transmission by default
- Frames are dropped when the network can't keep up
- Buffer checking prevents buffer bloat and reduces latency
- Prioritizes fresh data over complete data

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

## Debugging System Architecture

```mermaid
flowchart TD
    subgraph "Main Process"
        AppDebug[DEBUG Object]
        DebugFlags[Debug Flags]
        LogFunctions[Log Utility Functions]
    end

    subgraph "Renderer Process"
        RendererDebug[DEBUG Object]
        RendererFlags[Debug Flags]
        RendererLogFunctions[Log Utility Functions]
    end

    subgraph "Client"
        ClientDebug[DEBUG Object]
        ClientFlags[Debug Flags]
        ClientUI[Debug UI Controls]
        GlobalLog[window.log]
    end

    AppDebug --> DebugFlags --> LogFunctions
    RendererDebug --> RendererFlags --> RendererLogFunctions
    ClientDebug --> ClientFlags --> GlobalLog
    ClientUI --> ClientFlags
```

### Flag-Based Control

- Category-based flags for specific log types:
  - FRAMES: Frame processing and transmission logs
  - UI: UI-related logs
  - PEER: Peer connection logs
  - PERFORMANCE: Performance-related logs
  - DATA: Data integrity logs
  - NETWORK: Network-related logs
  - HANDLERS: Stream handler operations

## Module Export Pattern

```mermaid
flowchart TD
    subgraph "Export Strategy"
        SrcFiles[Source Files]
        DefaultExport[Default Export]
        ESM[ESM Format]
        CJS[CommonJS Format]
        UMD[UMD Format with PeerJS Bundled]
    end

    subgraph "Import Methods"
        ESImport[import Kinectron from 'kinectron-client']
        CJSImport[const Kinectron = require('kinectron-client')]
        ScriptImport[<script src="kinectron.umd.js"></script>]
    end

    SrcFiles --> DefaultExport
    DefaultExport --> ESM --> ESImport
    DefaultExport --> CJS --> CJSImport
    DefaultExport --> UMD --> ScriptImport
```

### Default Export Only

- The Kinectron class is exported as the default export only
- Follows best practices for libraries with a single primary class
- Provides a cleaner, more intuitive API for consumers
- PeerJS is bundled directly into the UMD build
