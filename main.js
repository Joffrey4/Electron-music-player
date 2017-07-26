// Control application life & create native browser window
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
    // Define browser window size
    mainWindow = new BrowserWindow({
        width: 612,
        height: 384
    });

    // Load the dev console
    mainWindow.webContents.openDevTools();

    // join the index.html of the app
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// Initialization of the app
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

// Resume window on open
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});
