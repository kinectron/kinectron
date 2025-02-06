/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 0.3.9
 */

import { PeerConnection } from './peer/peerConnection.js';
import {
  DEFAULT_PEER_CONFIG,
  DEFAULT_PEER_ID,
} from './peer/peerConfig.js';
import { Kinectron as ModernKinectron } from './kinectron-modern.js';

console.log('You are running Kinectron API version 0.3.9');

/**
 * Legacy Kinectron class for backward compatibility
 */
class Kinectron {
  /**
   * @param {string|Object} arg1 - Network configuration or host address
   * @param {Object} [arg2] - Additional peer configuration
   */
  constructor(arg1, arg2) {
    this.peerConnection = new PeerConnection(arg1, arg2);
    this.feed = null;
  }

  /**
   * Make peer connection
   */
  makeConnection() {
    // No need to implement - handled by PeerConnection constructor
  }

  /**
   * Set Kinect type
   * @param {string} kinectType - Type of Kinect ('azure' or 'windows')
   */
  setKinectType(kinectType) {
    this.peerConnection.send('setkinect', kinectType);
  }

  /**
   * Register event handler
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    this.peerConnection.on(event, callback);
  }

  /**
   * Start color feed
   * @param {Function} [callback] - Frame callback
   */
  startColor(callback) {
    if (callback) {
      this.peerConnection.on('frame', callback);
    }
    this.feed = 'color';
    this.peerConnection.send('feed', { feed: this.feed });
  }

  /**
   * Start depth feed
   * @param {Function} [callback] - Frame callback
   */
  startDepth(callback) {
    if (callback) {
      this.peerConnection.on('frame', callback);
    }
    this.feed = 'depth';
    this.peerConnection.send('feed', { feed: this.feed });
  }

  /**
   * Start raw depth feed
   * @param {Function} [callback] - Frame callback
   */
  startRawDepth(callback) {
    if (callback) {
      this.peerConnection.on('rawDepth', callback);
    }
    this.feed = 'raw-depth';
    this.peerConnection.send('feed', { feed: this.feed });
  }

  /**
   * Start body tracking
   * @param {Function} [callback] - Body frame callback
   */
  startTrackedBodies(callback) {
    if (callback) {
      this.peerConnection.on('trackedBodyFrame', callback);
    }
    this.feed = 'body';
    this.peerConnection.send('feed', { feed: this.feed });
  }

  /**
   * Stop all feeds
   */
  stopAll() {
    this.feed = null;
    this.peerConnection.send('feed', { feed: 'stop-all' });
  }

  /**
   * Close connection
   */
  close() {
    this.peerConnection.close();
  }
}

// Export both modern and legacy interfaces
export {
  PeerConnection,
  DEFAULT_PEER_CONFIG,
  DEFAULT_PEER_ID,
  Kinectron,
  ModernKinectron,
};

// For backward compatibility, also attach to window
if (typeof window !== 'undefined') {
  window.Kinectron = Kinectron;
}
