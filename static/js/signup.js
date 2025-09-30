
document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const errorDiv = document.getElementById("signup-error");
    errorDiv.textContent = "";
    const formData = new FormData(this);
    const response = await fetch("/signup", {
        method: "POST",
        body: formData
    });
    const result = await response.json();
    if(result.success){
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
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/static/css/loading.css';
        document.head.appendChild(link);
        window.location.href = "/login";
    } else {
        errorDiv.textContent = result.message || "Signup failed.";
    }
});

document.querySelector(".login-link").addEventListener("click", function(e) {
    e.preventDefault();
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
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/static/css/loading.css';
    document.head.appendChild(link);
    window.location.href = "/login";
});