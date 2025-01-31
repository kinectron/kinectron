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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

electronReload(dirname(__dirname), {
  electron: process.execPath,
  hardResetMethod: 'exit',
  watched: ['js', 'css', 'html', 'json', 'mjs'],
});

const kinectController = new KinectController();
const ipcHandler = new IpcHandler(kinectController);

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
  win.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  ipcHandler.initialize();
});

// Clean up on app quit
app.on('before-quit', async () => {
  await kinectController.close();
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
