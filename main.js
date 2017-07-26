"use strict";

// Imports
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog;

const fs = require('fs');
const path = require('path');
const url = require('url');

// Main window declaration
let mainWindow;

function createWindow () {
    // Define browser window size
    mainWindow = new BrowserWindow({
        width: 612,
        height: 384
    });

    // Load the dev console
    mainWindow.webContents.openDevTools();

    // Create a 'Sound Control' Menu
    let template = [
        {},
        {
            label: 'Sound Control',
            accelerator: 'CommandOrControl+0',
            click: function () {
                openFolderDialog();
            }
        }
    ];

    let menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);

    // Join the index.html of the app
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

function openFolderDialog() {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }, function (filePaths) {
        mainWindow.webContents.send('modal-file-content', filePaths);
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
