// main/ipcHandler.js
import { ipcMain } from 'electron';
import { KinectController } from './main/kinectController.js';

export function setupIpcHandlers(kinectController) {
  ipcMain.handle('initialize-kinect', async () => {
    return kinectController.initialize();
  });

  ipcMain.handle('start-color-stream', async () => {
    const success = kinectController.startColorCamera();
    if (success) {
      kinectController.startListening((data) => {
        // Process and send frame data back to renderer
        mainWindow.webContents.send('color-frame', data);
      });
    }
    return success;
  });

  // ... other handlers
}