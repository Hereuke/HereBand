document.getElementById("forgotForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const email = this.email.value.trim();
    const errorDiv = document.getElementById("forgot-error");
    errorDiv.textContent = "";
    if (!email) {
        errorDiv.textContent = "Please enter your email.";
        return;
    }
    const response = await fetch("/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });
    const result = await response.json();
    if (result.success) {
        const otpSend = await fetch("/otp/send", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `email=${encodeURIComponent(email)}`
        });
        const otpResult = await otpSend.json();
        if (otpResult.success) {
            localStorage.setItem("otp_email", email);
            const loadingDiv = document.createElement("div");
            loadingDiv.className = "loading-screen";
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
            window.location.href = "/otp";
        } else {
            errorDiv.textContent = otpResult.message || "Failed to send OTP.";
        }
    } else { 
        errorDiv.textContent = result.message || "Email not found.";
    }
});