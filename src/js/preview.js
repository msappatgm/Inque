const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const outputFolderPath = localStorage.getItem('outputFolderPath') || 'Not Set';
    document.getElementById('outputFolderPath').textContent = outputFolderPath;
    
    const fileList = document.getElementById('fileList');
    const addFileButton = document.getElementById('addFile');
    const submitButton = document.getElementById('submitConversion');
    const changeFolderButton = document.getElementById('changeOutputFolder');
    let files = []; // Array to store file names

    addFileButton.addEventListener('click', () => {
        ipcRenderer.send('add-file');
    });

    submitButton.addEventListener('click', () => {
        // Navigate to the loading/progress screen
        window.location.href = '../html/progress.html';
        // TODO: Trigger the file writing process
    });

    changeFolderButton.addEventListener('click', () => {
        // Send IPC message to change output folder
        ipcRenderer.send('open-output-folder-dialog');
    });

    function addFileToList(fileName) {
        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            listItem.remove();
            files = files.filter(f => f !== fileName);
        };
        listItem.appendChild(deleteButton);
        fileList.appendChild(listItem);
        files.push(fileName);
    }

    ipcRenderer.on('selected-output-folder', (event, folderPath) => {
        document.getElementById('outputFolderPath').textContent = folderPath;
    });

    ipcRenderer.on('file-added', (event, filePath) => {
        addFileToList(filePath);
    });
});
