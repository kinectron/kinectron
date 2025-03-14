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
    ipcMain.handle('initialize-kinect', async (event, data) => {
      console.log(
        'IpcHandler: Received initialize-kinect request',
        data,
      );

      try {
        console.log(
          'IpcHandler: Calling kinectController.initialize()',
        );
        const result = this.kinectController.initialize();
        console.log(
          'IpcHandler: kinectController.initialize() returned:',
          result,
        );

        if (result.success) {
          console.log('IpcHandler: Initializing stream handlers');
          // Initialize stream handlers after Kinect is ready
          this.streamManager.initialize();
          console.log('IpcHandler: Stream handlers initialized');

          // Broadcast success to all connected clients
          console.log('IpcHandler: Broadcasting success to clients');
          this.peerManager.broadcast('kinectInitialized', {
            success: true,
          });
        } else if (result.alreadyInitialized) {
          console.log('IpcHandler: Kinect is already initialized');

          // Broadcast specific message to clients
          this.peerManager.broadcast('kinectInitialized', {
            success: false,
            error: 'Kinect is already initialized',
            alreadyInitialized: true,
          });
        } else {
          console.warn('IpcHandler: Kinect initialization failed');
          // Broadcast failure to all connected clients
          console.log('IpcHandler: Broadcasting failure to clients');
          this.peerManager.broadcast('kinectInitialized', {
            success: false,
            error: result.error || 'Failed to initialize Kinect',
          });
        }

        console.log('IpcHandler: Returning result:', result);
        return result;
      } catch (error) {
        console.error(
          'IpcHandler: Kinect initialization error:',
          error,
        );

        // Broadcast error to all connected clients
        console.log('IpcHandler: Broadcasting error to clients');
        this.peerManager.broadcast('kinectInitialized', {
          success: false,
          error: error.message || 'Unknown error',
        });

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

    // Handle Kinect initialization from renderer (using handle method above)

    // Handle peer feed requests from renderer
    ipcMain.on('peer-feed-request', (event, data) => {
      try {
        console.log(
          'IpcHandler: Received peer-feed-request event:',
          data,
        );

        if (data && data.feed) {
          console.log(
            `IpcHandler: Processing feed request: ${data.feed} from connection: ${data.connection}`,
          );

          // Forward to stream manager
          if (data.feed === 'stop-all') {
            console.log('IpcHandler: Stopping all streams');
            this.streamManager.stopAllStreams();
          } else {
            console.log(`IpcHandler: Starting stream: ${data.feed}`);

            // Add detailed logging for depth stream specifically
            if (data.feed === 'depth') {
              console.log(
                'IpcHandler: DEPTH STREAM REQUESTED - Adding extra logging',
              );
              console.log(
                'IpcHandler: Current stream manager state:',
                {
                  activeStreams: this.streamManager.activeStreams
                    ? Array.from(this.streamManager.activeStreams)
                    : 'none',
                  hasDepthHandler:
                    !!this.streamManager.getHandler('depth'),
                },
              );
            }

            const success = this.streamManager.startStream(data.feed);
            console.log(
              `IpcHandler: Stream ${data.feed} start request forwarded to stream manager, result: ${success}`,
            );

            // Register a one-time listener for depth frames to verify they're being sent
            if (data.feed === 'depth') {
              let frameCount = 0;
              const depthFrameListener = (frameData) => {
                frameCount++;
                console.log(
                  `IpcHandler: Depth frame #${frameCount} received from main process, sending to renderer`,
                );
                if (frameCount >= 5) {
                  // Remove listener after 5 frames to avoid console spam
                  ipcMain.removeListener(
                    'depth-frame',
                    depthFrameListener,
                  );
                }
              };

              // Listen for depth frames being sent to renderer
              ipcMain.on('depth-frame', depthFrameListener);

              // Remove listener after 10 seconds regardless
              setTimeout(() => {
                ipcMain.removeListener(
                  'depth-frame',
                  depthFrameListener,
                );
              }, 10000);
            }
          }
        } else {
          console.warn(
            'IpcHandler: Received invalid peer feed request:',
            data,
          );
        }
      } catch (error) {
        console.error(
          'IpcHandler: Error handling peer feed request:',
          error,
        );
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
