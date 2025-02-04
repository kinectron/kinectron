// main/ipcHandler.js
import { ipcMain } from 'electron';
import { StreamManager } from './managers/streamManager.js';

export class IpcHandler {
  constructor(kinectController, peerManager) {
    this.kinectController = kinectController;
    this.peerManager = peerManager;
    this.streamManager = new StreamManager(
      kinectController,
      peerManager,
    );

    // Setup peer event handlers
    this.peerManager.on('ready', this.handlePeerReady.bind(this));
    this.peerManager.on(
      'connection',
      this.handlePeerConnection.bind(this),
    );
    this.peerManager.on('error', this.handlePeerError.bind(this));
  }

  initialize() {
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
      return {
        id: this.peerManager.peer?.id,
        isConnected: this.peerManager.isConnected,
        connectionCount: this.peerManager.connections.size,
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
    console.log('Peer connection ready:', data);
  }

  handlePeerConnection(connection) {
    console.log('New peer connection:', connection.peer);

    // Send current Kinect status to new peer
    const kinectStatus = {
      event: 'ready',
      data: { kinect: 'azure' }, // We only support Azure now
    };
    connection.send(kinectStatus);
  }

  handlePeerError(error) {
    console.error('Peer connection error:', error);
  }
}
