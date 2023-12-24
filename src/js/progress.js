document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const convertMoreButton = document.getElementById('convertMore');

    let progress = 0; // Start progress at 0%

    // Example: Update progress every second (1000 milliseconds)
    const interval = setInterval(() => {
        if (progress < 100) {
            progress += 10; // Increment progress
            progressBar.style.width = progress + '%';
            progressText.textContent = progress + '% Complete';
        } else {
            clearInterval(interval);
            progressText.textContent = 'Conversion Complete!';
            convertMoreButton.style.display = 'block';
        }
    }, 1000);

    convertMoreButton.addEventListener('click', () => {
        window.location.href = '../html/upload.html'; // Navigate back to upload screen
    });
});
