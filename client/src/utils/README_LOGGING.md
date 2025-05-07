# Kinectron Client Logging System

This document describes the logging system used in the Kinectron client library and how to control logging verbosity.

## Overview

The Kinectron client uses a flag-based logging system that allows developers to control the verbosity of logs. The system is designed to:

1. Keep essential logs (errors, warnings, important info) always visible
2. Hide verbose debug logs by default
3. Allow enabling specific categories of logs as needed
4. Provide consistent logging across the client library

## Debug Flags

The logging system uses the following debug flags:

| Flag          | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `FRAMES`      | Controls frame-related logs (processing frames, frame data)     |
| `HANDLERS`    | Controls handler-related logs (stream handlers, initialization) |
| `PEER`        | Controls peer connection logs                                   |
| `PERFORMANCE` | Controls performance-related logs (FPS, timing)                 |
| `DATA`        | Controls data integrity logs                                    |
| `NETWORK`     | Controls network-related logs                                   |

All flags are disabled (`false`) by default, which means that only essential logs (errors, warnings, important info) will be shown.

## Logging Functions

The logging system provides the following functions:

| Function                   | Purpose                                   | Visibility                          |
| -------------------------- | ----------------------------------------- | ----------------------------------- |
| `log.error()`              | Log errors                                | Always visible                      |
| `log.warn()`               | Log warnings                              | Always visible                      |
| `log.info()`               | Log important information                 | Always visible                      |
| `log.frame()`              | Log frame-related information             | Only if `DEBUG.FRAMES` is true      |
| `log.handler()`            | Log handler-related information           | Only if `DEBUG.HANDLERS` is true    |
| `log.peer()`               | Log peer-related information              | Only if `DEBUG.PEER` is true        |
| `log.performance()`        | Log performance-related information       | Only if `DEBUG.PERFORMANCE` is true |
| `log.data()`               | Log data integrity information            | Only if `DEBUG.DATA` is true        |
| `log.network()`            | Log network-related information           | Only if `DEBUG.NETWORK` is true     |
| `log.debug(flag, message)` | Log debug information for a specific flag | Only if the specified flag is true  |

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
log.handler('Setting up stream handler');
log.peer('Peer connection established');
log.performance('FPS:', frameCount);
log.data('Processing image data from data URL');
log.network('Sending data to peer');
log.debug('CUSTOM_FLAG', 'Custom debug message');
```

### Controlling Verbosity

You can enable or disable specific debug flags in the browser console:

```javascript
// Enable frame logs
DEBUG.FRAMES = true;

// Enable handler logs
DEBUG.HANDLERS = true;

// Enable all logs
DEBUG.enableAll();

// Disable all logs
DEBUG.disableAll();
```

## Best Practices

1. Use `log.error()`, `log.warn()`, and `log.info()` for important messages that should always be visible
2. Use `log.frame()` for frame-related logs that would be too verbose to show by default
3. Use `log.handler()` for handler-related logs that would be too verbose to show by default
4. Use `log.peer()` for peer connection logs that would be too verbose to show by default
5. Use `log.performance()` for performance-related logs that would be too verbose to show by default
6. Use `log.data()` for data integrity logs that would be too verbose to show by default
7. Use `log.network()` for network-related logs that would be too verbose to show by default
8. Use `log.debug()` with a specific flag for other types of debug logs
9. Keep the debug flags disabled by default in production code
10. Enable specific debug flags only when needed for debugging

## Implementation Details

The logging system is implemented in:

- `client/src/utils/debug.js`

This implementation is similar to the one used in the application to ensure consistent logging behavior across the entire Kinectron system.
