const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    let dropZone = document.getElementById('drop_zone');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        const validExtensions = ['.tsc', '.ts', '.js'];

        if (files.length > 0) {
            let fileExtension = files[0].name.split('.').pop();
            if (validExtensions.includes(`.${fileExtension}`)) {
                // Change the window content to folder selection view
                window.location.href = 'preview.html';
            } else {
                // Display an error message if the file type is not valid
                alert('Invalid file type! Please upload .tsc, .ts, or .js files.');
            }
        }

        ipcRenderer.send('open-output-folder-dialog');
    });
});

ipcRenderer.on('selected-output-folder', (event, folderPath) => {
    // Use the folderPath for file creation or other logic
    console.log('Selected folder:', folderPath);
});