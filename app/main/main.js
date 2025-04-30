// main/main.js
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const electronReload = require('electron-reload');

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { KinectController } from './kinectController.js';
import { IpcHandler } from './ipcHandler.js';
import { PeerConnectionManager } from './managers/peerConnectionManager.js';

// Set development environment for detailed error messages
process.env.NODE_ENV = 'development';

// Redirect uncaught exceptions to console instead of showing dialog boxes
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

electronReload(dirname(__dirname), {
  electron: process.execPath,
  hardResetMethod: 'exit',
  watched: ['js', 'css', 'html', 'json', 'mjs'],
});

const kinectController = new KinectController();
const peerManager = new PeerConnectionManager();
const ipcHandler = new IpcHandler(kinectController, peerManager);

function createWindow() {
  const preloadPath = path.join(
    __dirname,
    '..',
    'preload',
    'preload.js',
  );

  const win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const indexPath = path.join(
    __dirname,
    '..',
    'renderer',
    'index.html',
  );
  win.loadFile(indexPath);

  // Handle refresh (will-navigate)
  win.webContents.on('will-navigate', async (event, url) => {
    console.log(
      'Renderer navigating/refreshing, cleaning up resources...',
    );
    try {
      // First clean up the StreamManager to remove all IPC handlers
      console.log(
        'Cleaning up StreamManager and removing IPC handlers...',
      );
      await ipcHandler.streamManager.cleanup();

      // Then close Kinect and peer resources
      await Promise.all([
        kinectController.close(),
        peerManager.close(),
      ]);
      console.log('Cleanup before refresh complete');
    } catch (error) {
      console.error('Error during refresh cleanup:', error);
    }
  });

  // Handle after refresh (did-finish-load)
  win.webContents.on('did-finish-load', async () => {
    console.log(
      'Renderer reloaded, reinitializing resources if needed...',
    );

    // Check if peer server needs to be reinitialized
    if (peerManager.getState() !== 'running') {
      try {
        console.log('Reinitializing peer server after refresh...');
        await peerManager.initialize();
        console.log('Peer server reinitialized after refresh');

        // Reinitialize IPC handler to ensure all event listeners are set up
        ipcHandler.initialize();
        console.log('IPC handler reinitialized after refresh');
      } catch (error) {
        console.error(
          'Error reinitializing resources after refresh:',
          error,
        );
      }
    }

    // Always open DevTools
    win.openDevTools();
  });
}

app
  .whenReady()
  .then(async () => {
    try {
      console.log('Starting Kinectron...');

      // Create application window
      createWindow();

      // Initialize peer server
      console.log('Initializing peer server...');
      await peerManager.initialize();

      // Initialize IPC handler
      ipcHandler.initialize();

      console.log('Kinectron startup complete ✓');
    } catch (error) {
      console.error('Error during startup:', error);
      app.quit();
    }
  })
  .catch((error) => {
    console.error('Failed to start application:', error);
    app.quit();
  });

// Clean up on app quit
app.on('before-quit', async () => {
  console.log('Shutting down Kinectron...');
  try {
    await Promise.all([
      kinectController.close(),
      peerManager.close(),
    ]);
    console.log('Shutdown complete');
  } catch (error) {
    console.error('Error during shutdown:', error);
  }
});

// Handle window behavior on different platforms
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
