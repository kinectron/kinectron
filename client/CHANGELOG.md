# Changelog

All notable changes to the Kinectron Client will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-05-09

### Added

- Modern ES module implementation
- Support for all Azure Kinect data streams:
  - Color stream
  - Depth stream
  - Raw depth stream with 16-bit precision
  - Body tracking (skeleton) stream
  - Key (green screen) stream
  - Depth key stream
  - RGBD (color + depth) stream
- Comprehensive debugging system with flag-based controls
- Multiple output formats (ESM, CJS, UMD) for different environments
- CDN distribution via jsDelivr and unpkg
- Improved error handling and notifications

### Changed

- Complete rewrite of the client API
- Removed legacy API code
- Simplified exports to only include the Kinectron class
- Improved data handling for all streams
- Enhanced visualization tools for depth data

### Fixed

- Data structure mismatches between server and client
- Naming convention inconsistencies
- Frame dropping and buffering issues
- Raw depth data packing and unpacking
