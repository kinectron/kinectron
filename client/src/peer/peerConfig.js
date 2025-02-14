import { NgrokValidationError, NgrokErrorCodes } from './errors.js';

/**
 * Validates a ngrok URL format
 * @param {string} url - The URL to validate
 * @throws {NgrokValidationError} If URL is invalid
 */
function validateNgrokUrl(url) {
  if (!url.includes('ngrok-free.app')) {
    throw new NgrokValidationError(
      NgrokErrorCodes.INVALID_URL.message,
      {
        code: NgrokErrorCodes.INVALID_URL.code,
        url,
        reason: 'URL must include ngrok-free.app domain',
      },
    );
  }
}

/**
 * @typedef {Object} PeerNetworkConfig
 * @property {string} host - The host address for the peer server
 * @property {number|string} port - The port number for the peer server
 * @property {string} path - The path for the peer server
 * @property {boolean} [secure] - Whether to use secure connection
 */

/**
 * Default peer network configuration
 * @type {PeerNetworkConfig}
 */
export const DEFAULT_PEER_CONFIG = {
  host: 'localhost',
  port: 9001,
  path: '/',
  debug: 3, // Enable detailed logging
  // For local connections, we don't need STUN/TURN servers
  // This matches the original kinectron implementation
  config: {
    iceServers: [],
    sdpSemantics: 'unified-plan',
  },
};

/**
 * Default peer ID for the Kinectron server
 * @type {string}
 */
export const DEFAULT_PEER_ID = 'kinectron';

/**
 * Validates and processes peer network configuration
 * @param {Object} config - User provided network configuration
 * @returns {PeerNetworkConfig} Processed network configuration
 */
export function processPeerConfig(config) {
  if (!config) return DEFAULT_PEER_CONFIG;

  // Handle ngrok addresses
  if (typeof config === 'string' && config.includes('ngrok')) {
    try {
      validateNgrokUrl(config);
      return {
        host: config,
        port: '443',
        path: '/',
        secure: true,
      };
    } catch (error) {
      // Add connection context to validation errors
      if (error instanceof NgrokValidationError) {
        error.details.context = 'peer_config_validation';
        error.details.timestamp = new Date().toISOString();
      }
      throw error;
    }
  }

  // Handle IP addresses or custom configs
  if (typeof config === 'string') {
    return {
      ...DEFAULT_PEER_CONFIG,
      host: config,
    };
  }

  // Handle full custom config objects
  return {
    ...DEFAULT_PEER_CONFIG,
    ...config,
  };
}
