import { PeerConnection } from './peer/peerConnection.js';

export class Kinectron {
  constructor(networkConfig) {
    this.peer = new PeerConnection(networkConfig);
    this.messageHandlers = new Map();

    // Set up event handlers
    this.peer.on('ready', (data) => {
      const handler = this.messageHandlers.get('ready');
      if (handler) handler(data);
    });

    this.peer.on('error', (error) => {
      const handler = this.messageHandlers.get('error');
      if (handler) handler(error);
    });

    // Handle incoming data
    this.peer.on('data', (data) => {
      const { event, data: eventData } = data;
      const handler = this.messageHandlers.get(event);
      if (handler) handler(eventData);
    });
  }

  // Event registration
  on(event, callback) {
    this.messageHandlers.set(event, callback);
  }

  // Send data to peer
  send(event, data) {
    this.peer.send(event, data);
  }

  // Start feed methods
  startColor(callback) {
    if (callback) {
      this.messageHandlers.set('frame', callback);
    }
    this.send('feed', { feed: 'color' });
  }

  startDepth(callback) {
    if (callback) {
      this.messageHandlers.set('frame', callback);
    }
    this.send('feed', { feed: 'depth' });
  }

  startRawDepth(callback) {
    if (callback) {
      this.messageHandlers.set('rawDepth', callback);
    }
    this.send('feed', { feed: 'raw-depth' });
  }

  startBodies(callback) {
    if (callback) {
      this.messageHandlers.set('bodyFrame', callback);
    }
    this.send('feed', { feed: 'body' });
  }

  startKey(callback) {
    if (callback) {
      this.messageHandlers.set('frame', callback);
    }
    this.send('feed', { feed: 'key' });
  }

  startDepthKey(callback) {
    if (callback) {
      this.messageHandlers.set('depthKey', callback);
    }
    this.send('feed', { feed: 'depth-key' });
  }

  startRGBD(callback) {
    if (callback) {
      this.messageHandlers.set('frame', callback);
    }
    this.send('feed', { feed: 'rgbd' });
  }

  startMultiFrame(frames, callback) {
    if (callback) {
      this.messageHandlers.set('multiFrame', callback);
    }
    this.send('multi', frames);
  }

  // Stop all feeds
  stopAll() {
    this.send('feed', { feed: 'stop-all' });
  }

  // Clean up
  close() {
    this.peer.close();
    this.messageHandlers.clear();
  }
}
