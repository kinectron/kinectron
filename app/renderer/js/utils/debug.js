/**
 * Debug configuration for Kinectron renderer
 * Controls logging output for different components
 */

export const DEBUG = {
  // Master switches for components
  FRAMES: false, // Master switch for frame-related logging
  UI: false, // Master switch for UI-related logging
  PEER: false, // Master switch for peer connection logs

  // Specific logging categories
  PERFORMANCE: false, // For performance-related logs
  DATA: false, // For data integrity logs
  NETWORK: false, // For network-related logs

  // Helper method to enable all logs
  enableAll: function () {
    Object.keys(this).forEach((key) => {
      if (typeof this[key] === 'boolean') this[key] = true;
    });
  },

  // Helper method to disable all logs
  disableAll: function () {
    Object.keys(this).forEach((key) => {
      if (typeof this[key] === 'boolean') this[key] = false;
    });
  },
};

/**
 * Logging utility functions that check debug flags
 */
export const log = {
  // Always log errors regardless of debug flags
  error: function (message, ...args) {
    console.error(message, ...args);
  },

  // Always log warnings regardless of debug flags
  warn: function (message, ...args) {
    console.warn(message, ...args);
  },

  // Always log info messages regardless of debug flags
  info: function (message, ...args) {
    console.log(message, ...args);
  },

  // Only log if the specified debug flag is enabled
  debug: function (flag, message, ...args) {
    if (DEBUG[flag]) {
      console.debug(`[${flag}] ${message}`, ...args);
    }
  },

  // Only log frame-related messages if FRAMES flag is enabled
  frame: function (message, ...args) {
    if (DEBUG.FRAMES) {
      console.debug(`[FRAMES] ${message}`, ...args);
    }
  },

  // Only log UI-related messages if UI flag is enabled
  ui: function (message, ...args) {
    if (DEBUG.UI) {
      console.debug(`[UI] ${message}`, ...args);
    }
  },

  // Only log peer-related messages if PEER flag is enabled
  peer: function (message, ...args) {
    if (DEBUG.PEER) {
      console.debug(`[PEER] ${message}`, ...args);
    }
  },
};
