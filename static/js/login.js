document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const errorDiv = document.getElementById("login-error");
    errorDiv.textContent = "";
    const formData = new FormData(this);
    const response = await fetch("/login", {
        method: "POST",
        body: formData
    });
    let result;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        try {
            result = await response.json();
        } catch (err) {
            errorDiv.textContent = "Server error or invalid response.";
            return;
        }
        if (result.success) {
            // Show loader before redirect
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
            window.location.href = "/dashboard";
        } else {
            errorDiv.textContent = result.message || "Login failed.";
        }
    } else {
        errorDiv.textContent = "Unexpected server response.";
    }
});


document.querySelector(".signup-link").addEventListener("click", function(e) {
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
    window.location.href = "/signup";
});

document.querySelector(".forgot-link").addEventListener("click", function(e) {
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
    window.location.href = "/forgot";
});