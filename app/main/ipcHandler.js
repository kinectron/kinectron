// main/ipcHandler.js
import { ipcMain } from 'electron';
import { StreamManager } from './managers/streamManager.js';

export class IpcHandler {
  constructor(kinectController) {
    this.kinectController = kinectController;
    this.streamManager = new StreamManager(kinectController);
  }

  initialize() {
    // Only handle Kinect initialization and cleanup
    ipcMain.handle('initialize-kinect', async () => {
      try {
        const success = this.kinectController.initialize();
        if (success) {
          // Initialize stream handlers after Kinect is ready
          this.streamManager.initialize();
        }
        return success;
      } catch (error) {
        console.error('Kinect initialization error:', error);
        throw error;
      }
    });

    ipcMain.handle('close-kinect', async () => {
      try {
        await this.streamManager.cleanup();
        await this.kinectController.close();
        return true;
      } catch (error) {
        console.error('Error closing Kinect:', error);
        throw error;
      }
    });
  }
}
