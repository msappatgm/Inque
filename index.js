const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let settingsWindow;
let outputFolderPath;

function createTextFile(folderPath) {
    const filePath = path.join(folderPath, 'test.txt');
    fs.writeFileSync(filePath, 'potato');
}

function createMainWindow() {
      mainWindow = new BrowserWindow({
        // proper window length, doubled for debugging purposes
        //width: 400,
        //height: 300,
        width: 800,
        height: 600,
        resizable: false, // Prevents the window from resizing
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.webContents.openDevTools(); // Displays Chromium Dev tools
    mainWindow.loadFile('upload.html'); // Load the main HTML file
}

function createSettingsWindow() {
    settingsWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        parent: mainWindow, // Set the main window as the parent
        modal: true, // Make settings window modal
        show: false // Don't show immediately
    });

    settingsWindow.loadFile('settings.html'); // Load the settings HTML file
    settingsWindow.once('ready-to-show', () => {
        settingsWindow.show(); // Show when ready
    });
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            // more items...
        ]
    },
    {
        label: 'Settings',
        submenu: [
            {
                label: 'Set Output Folder',
                click: async () => {
                    const result = await dialog.showOpenDialog(mainWindow, {
                        properties: ['openDirectory']
                    });
                    if (!result.canceled) {
                        outputFolderPath = result.filePaths[0];
                    }
                }
            }
        ]
    },
    
];

app.whenReady().then(() => {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

ipcMain.on('open-output-folder-dialog', async (event) => {
    if (!outputFolderPath) {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (!result.canceled) {
            outputFolderPath = result.filePaths[0];
            // Continue with the file creation logic
            createTextFile(outputFolderPath);
        }
    } else {
        createTextFile(outputFolderPath);
    }
});