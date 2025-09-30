document.getElementById("newPasswordForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const password = this.password.value.trim();
    const confirmPassword = this.confirmPassword.value.trim();
    const errorDiv = document.getElementById("new-password-error");
    errorDiv.textContent = "";
    if (!password || !confirmPassword) {
        errorDiv.textContent = "Please fill in both fields.";
        return;
    }
    if (password.length < 8) {
        errorDiv.textContent = "Password must be at least 8 characters.";
        return;
    }
    if (password !== confirmPassword) {
        errorDiv.textContent = "Passwords do not match.";
        return;
    }
    // Get email from localStorage (if needed)
    const email = localStorage.getItem("otp_email");
    if (!email) {
        errorDiv.textContent = "Session expired. Please restart the process.";
        return;
    }
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
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/static/css/loading.css';
    document.head.appendChild(link);
    const response = await fetch("/new_password", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    });

    const result = await response.json();
    loadingDiv.remove();
    if (result.success) {
        window.location.href = "/login";
    } else {
        errorDiv.textContent = result.message || "Failed to update password.";
        loadingDiv.remove();
    }
});
