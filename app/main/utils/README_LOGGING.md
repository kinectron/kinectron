# Kinectron Logging System

This document describes the logging system used in Kinectron and how to control logging verbosity.

## Overview

Kinectron uses a flag-based logging system that allows developers to control the verbosity of logs. The system is designed to:

1. Keep essential logs (errors, warnings, important info) always visible
2. Hide verbose debug logs by default
3. Allow enabling specific categories of logs as needed
4. Provide consistent logging across both the application and client

## Debug Flags

The logging system uses the following debug flags:

| Flag          | Purpose                                                         |
| ------------- | --------------------------------------------------------------- |
| `FRAMES`      | Controls frame-related logs (broadcasting frames, frame data)   |
| `HANDLERS`    | Controls handler-related logs (stream handlers, initialization) |
| `PEER`        | Controls peer connection logs                                   |
| `PERFORMANCE` | Controls performance-related logs (FPS, timing)                 |
| `DATA`        | Controls data integrity logs                                    |
| `NETWORK`     | Controls network-related logs                                   |

All flags are disabled (`false`) by default, which means that only essential logs (errors, warnings, important info) will be shown.

## Logging Functions

The logging system provides the following functions:

| Function                   | Purpose                                   | Visibility                         |
| -------------------------- | ----------------------------------------- | ---------------------------------- |
| `log.error()`              | Log errors                                | Always visible                     |
| `log.warn()`               | Log warnings                              | Always visible                     |
| `log.info()`               | Log important information                 | Always visible                     |
| `log.frame()`              | Log frame-related information             | Only if `DEBUG.FRAMES` is true     |
| `log.handler()`            | Log handler-related information           | Only if `DEBUG.HANDLERS` is true   |
| `log.debug(flag, message)` | Log debug information for a specific flag | Only if the specified flag is true |

## How to Use

### Importing

```javascript
import { DEBUG, log } from '../utils/debug.js';
```

### Basic Logging

```javascript
// Always visible logs
log.info('Starting stream');
log.warn('Stream already active');
log.error('Failed to start stream', error);

// Conditional logs
log.frame('Broadcasting frame data');
log.handler('Setting up stream handler');
log.debug('PERFORMANCE', 'FPS:', frameCount);
```

### Controlling Verbosity

You can enable or disable specific debug flags:

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

## Example

See `debugExample.js` for a complete example of how to use the logging system.

## Best Practices

1. Use `log.error()`, `log.warn()`, and `log.info()` for important messages that should always be visible
2. Use `log.frame()` for frame-related logs that would be too verbose to show by default
3. Use `log.handler()` for handler-related logs that would be too verbose to show by default
4. Use `log.debug()` with a specific flag for other types of debug logs
5. Keep the debug flags disabled by default in production code
6. Enable specific debug flags only when needed for debugging

## Implementation Details

The logging system is implemented in:

- `app/main/utils/debug.js` (application)
- `client/src/utils/debug.js` (client)

Both implementations are identical to ensure consistent logging behavior across the application and client.
