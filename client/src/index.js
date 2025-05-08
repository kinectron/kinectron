/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 1.0.0
 */

import { PeerConnection } from './peer/peerConnection.js';
import {
  DEFAULT_PEER_CONFIG,
  DEFAULT_PEER_ID,
} from './peer/peerConfig.js';
import { Kinectron } from './kinectron.js';

console.log('You are running Kinectron API version 1.0.0');

// Export the modern interface only
export {
  PeerConnection,
  DEFAULT_PEER_CONFIG,
  DEFAULT_PEER_ID,
  Kinectron,
};
