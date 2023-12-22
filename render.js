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
                // If file is valid, prompt user to select output folder location
                mainWindow.loadFile('folder-select.html');
            } else {
                // Display an error message if the file type is not valid
                alert('Invalid file type! Please upload .tsc, .ts, or .js files.');
            }
        }
    });
});
