/**
 * Debug configuration for Kinectron client
 * Controls logging output for different components
 *
 * @namespace DEBUG
 */

export const DEBUG = {
  /**
   * Master switch for frame-related logging
   * Controls logs about frame processing, transmission, and visualization
   * @type {boolean}
   */
  FRAMES: false,

  /**
   * Master switch for handler-related logging
   * Controls logs about stream handlers and event processing
   * @type {boolean}
   */
  HANDLERS: false,

  /**
   * Master switch for peer connection logs
   * Controls logs about WebRTC connections, state changes, and data channels
   * @type {boolean}
   */
  PEER: false,

  /**
   * For performance-related logs
   * Controls logs about timing, frame rates, and processing efficiency
   * @type {boolean}
   */
  PERFORMANCE: false,

  /**
   * For data integrity logs
   * Controls logs about data validation, transformation, and verification
   * @type {boolean}
   */
  DATA: false,

  /**
   * For network-related logs
   * Controls logs about network status, bandwidth, and transmission
   * @type {boolean}
   */
  NETWORK: false,

  /**
   * Enable all debug flags
   * Turns on all logging categories for comprehensive debugging
   * @returns {void}
   * @example
   * // Enable all debug logs
   * DEBUG.enableAll();
   */
  enableAll: function () {
    Object.keys(this).forEach((key) => {
      if (typeof this[key] === 'boolean') this[key] = true;
    });
  },

  /**
   * Disable all debug flags
   * Turns off all logging categories for clean console output
   * @returns {void}
   * @example
   * // Disable all debug logs
   * DEBUG.disableAll();
   */
  disableAll: function () {
    Object.keys(this).forEach((key) => {
      if (typeof this[key] === 'boolean') this[key] = false;
    });
  },
};

/**
 * Logging utility functions that check debug flags
 * Provides category-specific logging with automatic flag checking
 *
 * @namespace log
 */
export const log = {
  /**
   * Log error messages (always visible regardless of debug flags)
   * Use for critical errors that should always be visible
   *
   * @param {string} message - The error message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.error('Failed to connect to server:', error);
   */
  error: function (message, ...args) {
    console.error(message, ...args);
  },

  /**
   * Log warning messages (always visible regardless of debug flags)
   * Use for potential issues that should always be visible
   *
   * @param {string} message - The warning message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.warn('Connection attempt timed out, retrying...');
   */
  warn: function (message, ...args) {
    console.warn(message, ...args);
  },

  /**
   * Log informational messages (always visible regardless of debug flags)
   * Use for important status updates that should always be visible
   *
   * @param {string} message - The info message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.info('Connected to Kinectron server');
   */
  info: function (message, ...args) {
    console.log(message, ...args);
  },

  /**
   * Log debug messages for a specific category
   * Only logs if the specified debug flag is enabled
   *
   * @param {string} flag - The debug flag to check
   * @param {string} message - The debug message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.debug('PERFORMANCE', 'Frame processing took:', processingTime, 'ms');
   */
  debug: function (flag, message, ...args) {
    if (DEBUG[flag]) {
      console.debug(`[${flag}] ${message}`, ...args);
    }
  },

  /**
   * Log frame-related messages
   * Only logs if the FRAMES debug flag is enabled
   *
   * @param {string} message - The frame-related message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.frame('Received color frame with dimensions:', width, 'x', height);
   */
  frame: function (message, ...args) {
    if (DEBUG.FRAMES) {
      console.debug(`[FRAMES] ${message}`, ...args);
    }
  },

  /**
   * Log handler-related messages
   * Only logs if the HANDLERS debug flag is enabled
   *
   * @param {string} message - The handler-related message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.handler('Creating body handler with callback');
   */
  handler: function (message, ...args) {
    if (DEBUG.HANDLERS) {
      console.debug(`[HANDLERS] ${message}`, ...args);
    }
  },

  /**
   * Log peer connection-related messages
   * Only logs if the PEER debug flag is enabled
   *
   * @param {string} message - The peer-related message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.peer('Connected to peer:', peerId);
   */
  peer: function (message, ...args) {
    if (DEBUG.PEER) {
      console.debug(`[PEER] ${message}`, ...args);
    }
  },

  /**
   * Log performance-related messages
   * Only logs if the PERFORMANCE debug flag is enabled
   *
   * @param {string} message - The performance-related message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.performance('Frame rate:', frameRate, 'fps');
   */
  performance: function (message, ...args) {
    if (DEBUG.PERFORMANCE) {
      console.debug(`[PERFORMANCE] ${message}`, ...args);
    }
  },

  /**
   * Log data integrity-related messages
   * Only logs if the DATA debug flag is enabled
   *
   * @param {string} message - The data-related message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.data('Unpacking raw depth data with dimensions:', width, 'x', height);
   */
  data: function (message, ...args) {
    if (DEBUG.DATA) {
      console.debug(`[DATA] ${message}`, ...args);
    }
  },

  /**
   * Log network-related messages
   * Only logs if the NETWORK debug flag is enabled
   *
   * @param {string} message - The network-related message
   * @param {...any} args - Additional arguments to log
   * @returns {void}
   * @example
   * log.network('Data channel buffer size:', bufferAmount, 'bytes');
   */
  network: function (message, ...args) {
    if (DEBUG.NETWORK) {
      console.debug(`[NETWORK] ${message}`, ...args);
    }
  },
};
