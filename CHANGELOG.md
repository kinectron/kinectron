# Changelog

All notable changes to the Kinectron project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-10

### Added

- Support for all Azure Kinect data streams:
  - Color stream
  - Depth stream
  - Raw depth stream with 16-bit precision
  - Body tracking (skeleton) stream
  - Key (green screen) stream
  - Depth key stream
  - RGBD (color + depth) stream
- Modern ES module implementation for client library
- Comprehensive debugging system with flag-based controls
- Multiple output formats (ESM, CJS, UMD) for client library
- CDN distribution via jsDelivr and unpkg
- Improved error handling and notification system
- "Block API Calls" feature for enhanced security
- Robust stream initialization pattern for all streams
- Frame dropping and buffering strategy for better performance
- Detailed JSDoc documentation for all public methods
- Reorganized examples and tools for better usability
- NPM workspaces configuration for monorepo structure

### Changed

- Complete rewrite of the client API
- Removed legacy API code
- Simplified exports to only include the Kinectron class
- Improved data handling for all streams
- Enhanced visualization tools for depth data
- Standardized logging system across application and client
- Reorganized project structure for better maintainability
- Updated build system with Rollup for client library
- Improved error notification system with modal dialogs

### Fixed

- Data structure mismatches between server and client
- Naming convention inconsistencies
- Frame dropping and buffering issues
- Raw depth data packing and unpacking
- Initialization issues with body tracking
- Refresh handling in Electron application
- NgrokClientState transition errors
- Excessive console logging in example code
