// preload/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose electron object with ipcRenderer for direct IPC communication
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, data) => {
      // Whitelist channels for security
      const validChannels = [
        'peer-feed-request',
        'peer-multi-request',
        'peer-connection-status',
        'initialize-kinect',
      ];

      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, callback) => {
      // Whitelist channels for security
      const validChannels = ['broadcast-to-peers'];

      if (validChannels.includes(channel)) {
        // Wrap the callback to avoid exposing the event object directly
        const subscription = (event, message) => {
          if (message) {
            callback(message);
          } else {
            console.error(
              'Invalid message received in IPC channel:',
              channel,
            );
          }
        };
        ipcRenderer.on(channel, subscription);
        return () =>
          ipcRenderer.removeListener(channel, subscription);
      }
    },
  },
});

// Expose protected methods and constants that allow the renderer process to use
// specific IPC channels via a 'kinectron' global variable
contextBridge.exposeInMainWorld('kinectron', {
  // Kinect Control
  initializeKinect: async () => {
    console.log('Preload: Invoking initialize-kinect IPC call');
    const result = await ipcRenderer.invoke('initialize-kinect');
    console.log('Preload: initialize-kinect returned:', result);
    // Make sure we're returning a boolean false for failure, not an object with success: false
    if (
      result &&
      typeof result === 'object' &&
      result.success === false
    ) {
      console.log(
        'Preload: Detected failure object, returning false',
      );
      return false;
    }
    return result;
  },
  closeKinect: () => ipcRenderer.invoke('close-kinect'),

  // Stream Controls
  startColorStream: () => ipcRenderer.invoke('start-color-stream'),
  startDepthStream: () => ipcRenderer.invoke('start-depth-stream'),
  startRawDepthStream: () =>
    ipcRenderer.invoke('start-raw-depth-stream'),
  startKeyStream: () => ipcRenderer.invoke('start-key-stream'),
  startDepthKeyStream: () =>
    ipcRenderer.invoke('start-depth-key-stream'),
  startRGBDStream: () => ipcRenderer.invoke('start-rgbd-stream'),
  stopStream: (streamType) =>
    ipcRenderer.invoke('stop-stream', streamType),
  startMultiStream: (streams) =>
    ipcRenderer.invoke('start-multi-stream', streams),

  // Body Tracking
  startBodyTracking: () => ipcRenderer.invoke('start-body-tracking'),

  // Recording Controls
  startRecording: (options) =>
    ipcRenderer.invoke('start-recording', options),
  stopRecording: () => ipcRenderer.invoke('stop-recording'),

  // Ngrok Controls
  startNgrok: (authToken) =>
    ipcRenderer.invoke('start-ngrok', authToken),
  stopNgrok: () => ipcRenderer.invoke('stop-ngrok'),
  getNgrokStatus: () => ipcRenderer.invoke('get-ngrok-status'),
  onNgrokStatusChange: (callback) => {
    const subscription = (event, status) => callback(status);
    ipcRenderer.on('ngrok-status-change', subscription);
    return () =>
      ipcRenderer.removeListener('ngrok-status-change', subscription);
  },

  // Frame Listeners
  onColorFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('color-frame', subscription);
    // Return cleanup function
    return () =>
      ipcRenderer.removeListener('color-frame', subscription);
  },

  onDepthFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('depth-frame', subscription);
    return () =>
      ipcRenderer.removeListener('depth-frame', subscription);
  },

  onBodyFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('body-frame', subscription);
    return () =>
      ipcRenderer.removeListener('body-frame', subscription);
  },

  onRawDepthFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('raw-depth-frame', subscription);
    return () =>
      ipcRenderer.removeListener('raw-depth-frame', subscription);
  },

  onKeyFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('key-frame', subscription);
    return () =>
      ipcRenderer.removeListener('key-frame', subscription);
  },

  onDepthKeyFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('depth-key-frame', subscription);
    return () =>
      ipcRenderer.removeListener('depth-key-frame', subscription);
  },

  onRGBDFrame: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('rgbd-frame', subscription);
    return () =>
      ipcRenderer.removeListener('rgbd-frame', subscription);
  },

  // Connection Status
  onConnectionStatus: (callback) => {
    const subscription = (event, status) => callback(status);
    ipcRenderer.on('connection-status', subscription);
    return () =>
      ipcRenderer.removeListener('connection-status', subscription);
  },

  // Error Handling
  onError: (callback) => {
    const subscription = (event, error) => callback(error);
    ipcRenderer.on('kinect-error', subscription);
    return () =>
      ipcRenderer.removeListener('kinect-error', subscription);
  },

  // Peer Connection Methods
  getPeerStatus: () => ipcRenderer.invoke('get-peer-status'),
  updatePeerConfig: (config) =>
    ipcRenderer.invoke('update-peer-config', config),

  // Peer Connection Events
  onPeerConnection: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('peer-connection', subscription);
    return () =>
      ipcRenderer.removeListener('peer-connection', subscription);
  },

  onPeerDisconnection: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('peer-disconnection', subscription);
    return () =>
      ipcRenderer.removeListener('peer-disconnection', subscription);
  },

  onPeerError: (callback) => {
    const subscription = (event, error) => callback(error);
    ipcRenderer.on('peer-error', subscription);
    return () =>
      ipcRenderer.removeListener('peer-error', subscription);
  },

  onPeerReady: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('peer-ready', subscription);
    return () =>
      ipcRenderer.removeListener('peer-ready', subscription);
  },
});
