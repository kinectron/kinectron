// main/ipcHandler.js
import { ipcMain, BrowserWindow } from 'electron';
import { StreamManager } from './managers/streamManager.js';
import { NgrokManager } from './managers/ngrokManager.js';
import { networkInterfaces } from 'os';

export class IpcHandler {
  constructor(kinectController, peerManager) {
    this.kinectController = kinectController;
    this.peerManager = peerManager;
    this.streamManager = new StreamManager(
      kinectController,
      peerManager,
    );
    this.ngrokManager = new NgrokManager();

    // Setup peer server event handlers
    this.peerManager.on('ready', this.handlePeerReady.bind(this));
    this.peerManager.on('error', this.handlePeerError.bind(this));
  }

  initialize() {
    // Ngrok handlers
    ipcMain.handle('start-ngrok', async (event, authToken) => {
      try {
        const url = await this.ngrokManager.connect(authToken);
        this.sendToRenderer('ngrok-status-change', {
          isConnected: true,
          url: url,
        });
        return url;
      } catch (error) {
        console.error('Error starting ngrok:', error);
        throw error;
      }
    });

    ipcMain.handle('stop-ngrok', async () => {
      try {
        await this.ngrokManager.disconnect();
        this.sendToRenderer('ngrok-status-change', {
          isConnected: false,
          url: null,
        });
        return true;
      } catch (error) {
        console.error('Error stopping ngrok:', error);
        throw error;
      }
    });

    ipcMain.handle('get-ngrok-status', () => {
      return this.ngrokManager.getStatus();
    });

    // Kinect initialization and cleanup
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

    // Peer connection management
    ipcMain.handle('get-peer-status', () => {
      const interfaces = networkInterfaces();
      let ipAddresses = [];

      Object.keys(interfaces).forEach(function (ifname) {
        // Only use Ethernet or Wi-Fi interfaces
        if (ifname !== 'Ethernet' && ifname !== 'Wi-Fi') {
          return;
        }

        interfaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            // Skip internal and non-IPv4 addresses
            return;
          }
          ipAddresses.push(iface.address);
        });
      });

      const localAddress = ipAddresses[0] || 'Not available';

      return {
        id: 'kinectron',
        isConnected: this.peerManager.server !== null,
        connectionCount: 0, // Connection count now managed by renderer
        address: localAddress,
        port: 9001,
      };
    });

    ipcMain.handle('update-peer-config', async (event, config) => {
      try {
        await this.peerManager.close();
        Object.assign(this.peerManager.config, config);
        await this.peerManager.initialize();
        return true;
      } catch (error) {
        console.error('Error updating peer configuration:', error);
        throw error;
      }
    });
  }

  // Peer event handlers
  handlePeerReady(data) {
    console.log('Peer server ready:', data);
    this.sendToRenderer('peer-ready', {
      peer: {
        id: 'kinectron',
        options: {
          host: 'localhost',
          port: 9001,
          path: '/',
          secure: false,
        },
      },
    });
  }

  handlePeerError(error) {
    console.error('Peer server error:', error);
    this.sendToRenderer('peer-error', error);
  }

  /**
   * Helper method to send events to the renderer process
   * @private
   */
  sendToRenderer(channel, data) {
    try {
      const windows = BrowserWindow.getAllWindows();
      windows.forEach((window) => {
        if (!window.isDestroyed()) {
          window.webContents.send(channel, data);
        }
      });
    } catch (error) {
      console.error('Error sending to renderer:', error);
    }
  }

  /**
   * Clean up resources
   */
  async cleanup() {
    try {
      await this.ngrokManager.cleanup();
    } catch (error) {
      console.error('Error cleaning up ngrok:', error);
    }
  }
}
