/**
 * Debug configuration for Kinectron client
 * Controls logging output for different components
 */

export const DEBUG = {
  // Master switches for components
  RAW_DEPTH: false, // Master switch for raw depth logging

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
