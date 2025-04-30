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
import { log } from './utils/debug.js';

// Set development environment for detailed error messages
process.env.NODE_ENV = 'development';

// Redirect uncaught exceptions to console instead of showing dialog boxes
process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  log.error('Unhandled Rejection:', error);
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
    log.info(
      'Renderer navigating/refreshing, cleaning up resources...',
    );
    try {
      // First clean up the StreamManager to remove all IPC handlers
      log.info(
        'Cleaning up StreamManager and removing IPC handlers...',
      );
      await ipcHandler.streamManager.cleanup();

      // Then close Kinect and peer resources
      await Promise.all([
        kinectController.close(),
        peerManager.close(),
      ]);
      log.info('Cleanup before refresh complete');
    } catch (error) {
      log.error('Error during refresh cleanup:', error);
    }
  });

  // Handle after refresh (did-finish-load)
  win.webContents.on('did-finish-load', async () => {
    log.info(
      'Renderer reloaded, reinitializing resources if needed...',
    );

    // Check if peer server needs to be reinitialized
    if (peerManager.getState() !== 'running') {
      try {
        log.info('Reinitializing peer server after refresh...');
        await peerManager.initialize();
        log.info('Peer server reinitialized after refresh');

        // Reinitialize IPC handler to ensure all event listeners are set up
        ipcHandler.initialize();
        log.info('IPC handler reinitialized after refresh');
      } catch (error) {
        log.error(
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
      log.info('Starting Kinectron...');

      // Create application window
      createWindow();

      // Initialize peer server
      log.info('Initializing peer server...');
      await peerManager.initialize();

      // Initialize IPC handler
      ipcHandler.initialize();

      log.info('Kinectron startup complete ✓');
    } catch (error) {
      log.error('Error during startup:', error);
      app.quit();
    }
  })
  .catch((error) => {
    log.error('Failed to start application:', error);
    app.quit();
  });

// Clean up on app quit
app.on('before-quit', async () => {
  log.info('Shutting down Kinectron...');
  try {
    await Promise.all([
      kinectController.close(),
      peerManager.close(),
    ]);
    log.info('Shutdown complete');
  } catch (error) {
    log.error('Error during shutdown:', error);
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
