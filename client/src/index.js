/**
 * @fileoverview Main entry point for the Kinectron client library
 * @version 1.0.0
 */

import { PeerConnection } from './peer/peerConnection.js';
import {
  DEFAULT_PEER_CONFIG,
  DEFAULT_PEER_ID,
} from './peer/peerConfig.js';
import { Kinectron as ModernKinectron } from './kinectron-modern.js';
import { NgrokClientState } from './peer/ngrokState.js';

console.log('You are running Kinectron API version 1.0.0');

/**
 * Legacy Kinectron class for backward compatibility
 */
class Kinectron {
  /**
   * @param {string|Object} arg1 - Network configuration or host address
   * @param {Object} [arg2] - Additional peer configuration
   */
  constructor(arg1, arg2) {
    // Merge configurations for backward compatibility
    const config =
      typeof arg1 === 'string'
        ? { ...DEFAULT_PEER_CONFIG, host: arg1, ...arg2 }
        : { ...DEFAULT_PEER_CONFIG, ...arg1 };

    this.peerConnection = new PeerConnection(config);
    this.feed = null;
    this.state = null;

    // Set up state change handler
    this.peerConnection.on('stateChange', (data) => {
      this.state = data.to;
      if (data.to === NgrokClientState.STATES.ERROR) {
        console.error('Connection error:', data.details);
      }
    });

    // Set up error handler
    this.peerConnection.on('error', (error) => {
      console.error('Kinectron error:', error);
    });
  }

  /**
   * Make peer connection
   */
  makeConnection() {
    // No need to implement - handled by PeerConnection constructor
    console.warn(
      'makeConnection() is deprecated - connection is now automatic',
    );
  }

  /**
   * Set Kinect type
   * @param {string} kinectType - Type of Kinect ('azure' or 'windows')
   */
  setKinectType(kinectType) {
    if (this.state !== NgrokClientState.STATES.CONNECTED) {
      console.warn('Cannot set Kinect type: not connected');
      return;
    }
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
    if (this.state !== NgrokClientState.STATES.CONNECTED) {
      console.warn('Cannot start color feed: not connected');
      return;
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
    if (this.state !== NgrokClientState.STATES.CONNECTED) {
      console.warn('Cannot start depth feed: not connected');
      return;
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
    if (this.state !== NgrokClientState.STATES.CONNECTED) {
      console.warn('Cannot start raw depth feed: not connected');
      return;
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
    if (this.state !== NgrokClientState.STATES.CONNECTED) {
      console.warn('Cannot start body tracking: not connected');
      return;
    }
    this.feed = 'body';
    this.peerConnection.send('feed', { feed: this.feed });
  }

  /**
   * Stop all feeds
   */
  stopAll() {
    if (this.state !== NgrokClientState.STATES.CONNECTED) {
      console.warn('Cannot stop feeds: not connected');
      return;
    }
    this.feed = null;
    this.peerConnection.send('feed', { feed: 'stop-all' });
  }

  /**
   * Get current state
   * @returns {Object} Current state information
   */
  getState() {
    return this.peerConnection.getState();
  }

  /**
   * Check if connected
   * @returns {boolean} Whether peer is connected
   */
  isConnected() {
    return this.state === NgrokClientState.STATES.CONNECTED;
  }

  /**
   * Close connection
   */
  close() {
    this.feed = null;
    this.state = null;
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
