const { ipcRenderer } = require('electron');
const path = require('path');

document.addEventListener('DOMContentLoaded', () => {
    const outputFolderPath = localStorage.getItem('outputFolderPath') || 'Not Set';
    document.getElementById('outputFolderPath').textContent = outputFolderPath;
    
    const fileList = document.getElementById('fileList');
    const addFileButton = document.getElementById('addFile');
    const submitButton = document.getElementById('submitConversion');
    const changeFolderButton = document.getElementById('changeOutputFolder');
    let files = []; // Array to store file names

    ipcRenderer.send('request-dragged-file');

    addFileButton.addEventListener('click', () => {
        ipcRenderer.send('add-file');
    });

    submitButton.addEventListener('click', () => {
        ipcRenderer.send('start-conversion', files);
        window.location.href = '../html/progress.html';
    });    

    function addFileToList(filePath) {
        const fileName = path.basename(filePath); // Extract the file name from the path
        const listItem = document.createElement('li');
        listItem.textContent = fileName;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            listItem.remove();
            files = files.filter(f => f !== filePath); // Remove the full path
        };
        listItem.appendChild(deleteButton);
        fileList.appendChild(listItem);
        files.push(filePath); // Add the full path
    }

    ipcRenderer.on('selected-output-folder', (event, folderPath) => {
        document.getElementById('outputFolderPath').textContent = folderPath;
    });

    ipcRenderer.on('file-added', (event, filePath) => {
        addFileToList(filePath);
    });

    ipcRenderer.on('output-folder-changed', (event, folderPath) => {
        document.getElementById('outputFolderPath').textContent = folderPath;
        // Update localStorage or other storage mechanism if you're using one
        localStorage.setItem('outputFolderPath', folderPath);
    });

    changeFolderButton.addEventListener('click', () => {
        ipcRenderer.send('open-output-folder-dialog');
    });

    ipcRenderer.on('add-file-to-preview', (event, filePath) => {
        addFileToList(filePath);
    });
});