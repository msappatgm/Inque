const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
let outputFolderPath;

function createTextFile(folderPath) {
    const filePath = path.join(folderPath, 'test.txt');
    fs.writeFileSync(filePath, 'potato');
}

function createMainWindow() {
      mainWindow = new BrowserWindow({
        // proper window length, doubled for debugging purposes
        //width: 400,
        //height: 400,
        width: 800,
        height: 600,
        resizable: false, // Prevents the window from resizing
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.webContents.openDevTools(); // Displays Chromium Dev tools
    mainWindow.loadFile('./src/html/upload.html'); // Load the main HTML file
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
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    if (!result.canceled) {
        outputFolderPath = result.filePaths[0];
        mainWindow.webContents.executeJavaScript(`localStorage.setItem('outputFolderPath', '${outputFolderPath.replace(/\\/g, '\\\\')}')`);
    }
});

ipcMain.on('add-file', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'JavaScript Files', extensions: ['js', 'ts', 'tsc'] }]
    });
    if (!result.canceled) {
        event.sender.send('file-added', result.filePaths[0]);
    }
});