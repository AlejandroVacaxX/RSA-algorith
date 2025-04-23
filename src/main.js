const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox:false,
    }
  });

  mainWindow.loadFile('./src/index.html');
  mainWindow.webContents.openDevTools();

  // mainWindow.webContents.openDevTools(); // Opcional: para debug
});