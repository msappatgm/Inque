const { transformContent } = require('./transformer');
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
// This isn't getting set outside of this file 
let outputFolderPath;
let draggedFilePath = null; // Variable to store the path of the dragged file

function createMainWindow() {
    mainWindow = new BrowserWindow({
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
        const folderPath = result.filePaths[0];
        event.sender.send('output-folder-changed', folderPath);
        mainWindow.webContents.executeJavaScript(`localStorage.setItem('outputFolderPath', '${folderPath.replace(/\\/g, '\\\\')}')`);
    }
});

ipcMain.on('change-output-folder', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    if (!result.canceled) {
        const folderPath = result.filePaths[0];
        event.sender.send('output-folder-changed', folderPath);
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

ipcMain.on('start-conversion', async (event, files) => {
    event.sender.send('some shit',outputFolderPath);

    if (!outputFolderPath || !fs.existsSync(outputFolderPath)) {
        console.error("Output folder path is not set or invalid.");
        event.sender.send('conversion-error', 'Invalid output folder path');
        return;
    }
    
    console.log("Starting conversion. Output folder:", outputFolderPath);
    for (const file of files) {
        console.log("Converting file:", file);
        try {
            const content = fs.readFileSync(file, 'utf-8');
            const transformedContent = transformContent(content); // Convert TestCafe to WDIO
            const outputPath = path.join(outputFolderPath, path.basename(file));
            console.log("Writing transformed content to:", outputPath);
            fs.writeFileSync(outputPath, transformedContent); // Write the transformed content
        } catch (error) {
            console.error('Error processing file:', file, error);
            event.sender.send('conversion-error', file);
            return;
        }
    }
    event.sender.send('conversion-complete');
});

// Store the path of the dragged file
ipcMain.on('file-dragged', (event, filePath) => {
    draggedFilePath = filePath;
});

// Send the dragged file path to the renderer when requested
ipcMain.on('request-dragged-file', (event) => {
    if (draggedFilePath) {
        mainWindow.webContents.send('add-file-to-preview', draggedFilePath);
        draggedFilePath = null; // Clear the stored path after sending
    }
});
