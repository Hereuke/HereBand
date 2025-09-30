const getStartedBtn = document.getElementById('getStarted');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        // Show loader
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-screen';
        loadingDiv.innerHTML = `
            <div class="loading-bars-container">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
        `;
        document.body.appendChild(loadingDiv);
        // Add loading CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/static/css/loading.css';
        document.head.appendChild(link);
    window.location.href = '/signup';
    });
}