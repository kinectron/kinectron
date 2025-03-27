/**
 * Utility functions for debugging frame data
 */

/**
 * Debug raw depth frame data by capturing it and triggering the debugger
 * @param {Object} frameData - The frame data to debug
 * @param {Object} peerController - The peer controller instance
 */
export function stopAllStreamsForDebug(frameData, peerController) {
  console.log('DEBUG: Using peerController to stop all feeds');

  // This is the same code that's used in peerController.js when handling feed events
  if (window.electron && window.electron.ipcRenderer) {
    console.log('DEBUG: Sending stop-all feed request via IPC');
    window.electron.ipcRenderer.send('peer-feed-request', {
      feed: 'stop-all',
      connection: 'debug',
    });

    // Also emit the feed-change event to ensure the UI updates
    peerController.emit('feed-change', {
      feed: 'stop-all',
      connection: { peer: 'debug' },
    });

    console.log('DEBUG: Stop-all request sent');
  } else {
    console.error('DEBUG: IPC renderer not available');
  }

  // Capture the current frame data for inspection
  const capturedFrameData = { ...frameData };
  window.debugFrameData = capturedFrameData;
  console.log(
    'DEBUG: Frame data captured for inspection',
    window.debugFrameData,
  );
}
