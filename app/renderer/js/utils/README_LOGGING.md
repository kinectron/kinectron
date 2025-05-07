# Kinectron Renderer Logging System

This document describes the logging system used in the Kinectron renderer process and how to control logging verbosity.

## Overview

The Kinectron renderer uses a flag-based logging system that allows developers to control the verbosity of logs. The system is designed to:

1. Keep essential logs (errors, warnings, important info) always visible
2. Hide verbose debug logs by default
3. Allow enabling specific categories of logs as needed
4. Provide consistent logging across the application

## Debug Flags

The logging system uses the following debug flags:

| Flag          | Purpose                                                            |
| ------------- | ------------------------------------------------------------------ |
| `FRAMES`      | Controls frame-related logs (processing frames, drawing to canvas) |
| `UI`          | Controls UI-related logs (DOM manipulation, UI updates)            |
| `PEER`        | Controls peer connection logs                                      |
| `PERFORMANCE` | Controls performance-related logs (FPS, timing)                    |
| `DATA`        | Controls data integrity logs                                       |
| `NETWORK`     | Controls network-related logs                                      |

All flags are disabled (`false`) by default, which means that only essential logs (errors, warnings, important info) will be shown.

## Logging Functions

The logging system provides the following functions:

| Function                   | Purpose                                   | Visibility                         |
| -------------------------- | ----------------------------------------- | ---------------------------------- |
| `log.error()`              | Log errors                                | Always visible                     |
| `log.warn()`               | Log warnings                              | Always visible                     |
| `log.info()`               | Log important information                 | Always visible                     |
| `log.frame()`              | Log frame-related information             | Only if `DEBUG.FRAMES` is true     |
| `log.ui()`                 | Log UI-related information                | Only if `DEBUG.UI` is true         |
| `log.peer()`               | Log peer-related information              | Only if `DEBUG.PEER` is true       |
| `log.debug(flag, message)` | Log debug information for a specific flag | Only if the specified flag is true |

## How to Use

### Importing

```javascript
import { DEBUG, log } from './utils/debug.js';
```

### Basic Logging

```javascript
// Always visible logs
log.info('Starting stream');
log.warn('Stream already active');
log.error('Failed to start stream', error);

// Conditional logs
log.frame('Processing depth frame');
log.ui('Updating button state');
log.peer('Peer connection established');
log.debug('PERFORMANCE', 'FPS:', frameCount);
```

### Controlling Verbosity

You can enable or disable specific debug flags in the browser console:

```javascript
// Enable frame logs
DEBUG.FRAMES = true;

// Enable UI logs
DEBUG.UI = true;

// Enable all logs
DEBUG.enableAll();

// Disable all logs
DEBUG.disableAll();
```

## Best Practices

1. Use `log.error()`, `log.warn()`, and `log.info()` for important messages that should always be visible
2. Use `log.frame()` for frame-related logs that would be too verbose to show by default
3. Use `log.ui()` for UI-related logs that would be too verbose to show by default
4. Use `log.peer()` for peer connection logs that would be too verbose to show by default
5. Use `log.debug()` with a specific flag for other types of debug logs
6. Keep the debug flags disabled by default in production code
7. Enable specific debug flags only when needed for debugging

## Implementation Details

The logging system is implemented in:

- `app/renderer/js/utils/debug.js`

This implementation is similar to the one used in the main process to ensure consistent logging behavior across the application.
