const { app, BrowserWindow, Menu } = require('electron');

let mainWindow;
let settingsWindow;

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
        click() { 
            if (!settingsWindow) {
                createSettingsWindow(); // Create the settings window if it doesn't exist
            } else {
                settingsWindow.focus(); // Focus the settings window if it already exists
            }
        }
    }
    // Add more menu items as needed
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