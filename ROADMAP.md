# Kinectron API Modernization Roadmap

This document outlines the steps to modernize the Kinectron API for public release.

> **IMPORTANT NOTE**: The project documentation (README.md, CONTRIBUTE.md) is currently out of date and should not be used as a reference until it's updated in Phase 5.

## Progress Tracking

- [x] Simplify API exports (completed)
  - [x] Changed from mixed exports to default export only
  - [x] Updated import statements in example files
  - [x] Eliminated Rollup warning about mixing named and default exports
- [x] Reorganize examples and tools (completed)
- [x] Phase 1: Build System Modernization (completed)
- [x] Phase 2: Documentation Enhancement (completed)
- [x] Phase 3: NPM Publishing Setup (completed)
- [x] Phase 4: CDN Distribution (completed)
- [ ] Phase 5: Update Project Documentation

## Detailed Phases

### Phase 1: Build System Modernization

**Goal**: Create a modern, multi-format build system for the library

**Tasks**:

- Install Rollup and necessary plugins
- Create rollup.config.js for ESM, CJS, and UMD outputs
- Update package.json with proper entry points and scripts
- Test all output formats

**Implementation**:

```javascript
// rollup.config.js
export default [
  {
    input: 'src/index.js',
    output: [
      { file: 'dist/kinectron.esm.js', format: 'esm' },
      { file: 'dist/kinectron.cjs.js', format: 'cjs' },
      {
        file: 'dist/kinectron.umd.js',
        format: 'umd',
        name: 'Kinectron',
      },
    ],
  },
];
```

```json
// package.json updates
{
  "main": "dist/kinectron.cjs.js",
  "module": "dist/kinectron.esm.js",
  "browser": "dist/kinectron.umd.js",
  "exports": {
    "import": "./dist/kinectron.esm.js",
    "require": "./dist/kinectron.cjs.js",
    "default": "./dist/kinectron.umd.js"
  },
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  }
}
```

### Phase 2: Documentation Enhancement

**Goal**: Improve API documentation for developers

**Tasks**:

- Add JSDoc comments to all public methods
- Generate API documentation
- Create basic usage guide

**Example**:

```javascript
/**
 * Kinectron client for connecting to Kinectron server
 * @class
 */
export class Kinectron {
  /**
   * Create a new Kinectron instance
   * @param {Object|string} networkConfig - Network configuration or server IP
   */
  constructor(networkConfig) {
    // Implementation
  }
}
```

### Phase 3: NPM Publishing Setup

**Goal**: Configure the package for NPM publishing

**Tasks**:

- Update package.json with publishing metadata
- Create .npmignore file
- Test publishing workflow

**Implementation**:

```json
{
  "name": "kinectron",
  "version": "1.0.0",
  "description": "Client for Kinectron peer server",
  "keywords": ["kinect", "azure-kinect", "motion-tracking"],
  "homepage": "https://github.com/kinectron/kinectron#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/kinectron/kinectron.git"
  },
  "license": "MIT",
  "files": ["dist", "README.md", "LICENSE"]
}
```

### Phase 4: CDN Distribution

**Goal**: Enable CDN access for browser users

**Tasks**:

- Configure package.json for jsDelivr and unpkg
- Test CDN access
- Document CDN usage

**Implementation**:

```json
{
  "unpkg": "dist/kinectron.umd.js",
  "jsdelivr": "dist/kinectron.umd.js"
}
```

**Usage Example**:

```html
<script src="https://cdn.jsdelivr.net/npm/kinectron@1.0.0/dist/kinectron.umd.js"></script>
```

### Phase 5: Update Project Documentation

**Goal**: Ensure all project documentation is accurate and up-to-date

**Tasks**:

- Update README.md with current installation and usage instructions
- Update CONTRIBUTE.md with modern development workflow
- Create CHANGELOG.md to track version changes
- Review and update any other documentation files
