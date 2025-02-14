/**
 * Base class for ngrok-related errors
 */
export class NgrokError extends Error {
  /**
   * @param {string} message - Error message
   * @param {Object} details - Additional error details
   */
  constructor(message, details = {}) {
    super(message);
    this.name = 'NgrokError';
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.troubleshooting = [
      'Verify the ngrok tunnel is running',
      'Check if the ngrok URL is correct',
      'Ensure the Kinectron application is running',
    ];
  }
}

/**
 * Error for ngrok connection failures
 */
export class NgrokConnectionError extends NgrokError {
  constructor(message, details = {}) {
    super(message, {
      ...details,
      type: 'connection_error',
    });
    this.name = 'NgrokConnectionError';
    this.troubleshooting = [
      'Check if the ngrok tunnel is still active',
      'Verify your internet connection',
      'Try restarting the ngrok tunnel',
      'Ensure no firewall is blocking the connection',
    ];
  }
}

/**
 * Error for ngrok connection timeouts
 */
export class NgrokTimeoutError extends NgrokError {
  constructor(message, details = {}) {
    super(message, {
      ...details,
      type: 'timeout_error',
    });
    this.name = 'NgrokTimeoutError';
    this.troubleshooting = [
      'The connection attempt timed out',
      'Check your internet connection speed',
      'Verify the Kinectron server is running',
      'Try increasing the connection timeout',
    ];
  }
}

/**
 * Error for invalid ngrok configuration or URLs
 */
export class NgrokValidationError extends NgrokError {
  constructor(message, details = {}) {
    super(message, {
      ...details,
      type: 'validation_error',
    });
    this.name = 'NgrokValidationError';
    this.troubleshooting = [
      'Ensure the URL includes "ngrok-free.app"',
      'Copy the URL directly from the Kinectron application',
      'Make sure to include the full domain name',
    ];
  }
}

/**
 * Error codes and their descriptions
 */
export const NgrokErrorCodes = {
  INVALID_URL: {
    code: 'NGROK_001',
    message: 'Invalid ngrok URL format',
  },
  CONNECTION_FAILED: {
    code: 'NGROK_002',
    message: 'Failed to establish ngrok connection',
  },
  CONNECTION_TIMEOUT: {
    code: 'NGROK_003',
    message: 'Connection attempt timed out',
  },
  TUNNEL_CLOSED: {
    code: 'NGROK_004',
    message: 'Ngrok tunnel was closed',
  },
  SERVER_UNREACHABLE: {
    code: 'NGROK_005',
    message: 'Unable to reach Kinectron server',
  },
};
