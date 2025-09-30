

// ...existing code...
const errorDiv = document.getElementById("otp-error");
const timerSpan = document.getElementById("timer");
let expiry = null;

// Fetch expiry from backend on page load
async function fetchExpiry() {
    const email = localStorage.getItem("otp_email");
    if (!email) return null;
    try {
        const res = await fetch(`/otp/expiry?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && data.expiry) {
            expiry = data.expiry;
            return expiry;
        }
    } catch {}
    return null;
}

function startTimer() {
    if (!expiry) return;
    let timerInterval = null;
    function updateTimer() {
        const now = Math.floor(Date.now() / 1000);
        let secondsLeft = expiry - now;
        if (secondsLeft < 0) secondsLeft = 0;
        const min = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
        const sec = String(secondsLeft % 60).padStart(2, '0');
        if (timerSpan) timerSpan.textContent = `${min}:${sec}`;
        if (secondsLeft === 0) {
            errorDiv.textContent = "OTP expired. Please request a new one.";
            document.getElementById("otpForm").querySelector('button').disabled = true;
            document.querySelectorAll('.otp-digit').forEach(input => input.disabled = true);
            document.getElementById("resend-row").style.display = "block";
            clearInterval(timerInterval);
        }
    }
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
}

document.addEventListener("DOMContentLoaded", async function() {
    await fetchExpiry();
    startTimer();
    // Resend OTP logic
    const resendLink = document.getElementById("resend-link");
    if (resendLink) {
        resendLink.addEventListener("click", async function(e) {
            e.preventDefault();
            const email = localStorage.getItem("otp_email");
            if (!email) return;
            resendLink.textContent = "Sending...";
            resendLink.style.pointerEvents = "none";
            // Send OTP again
            const response = await fetch("/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `email=${encodeURIComponent(email)}`
            });
            const result = await response.json();
            if (result.success && result.expiry) {
                expiry = result.expiry;
                document.getElementById("otpForm").querySelector('button').disabled = false;
                document.querySelectorAll('.otp-digit').forEach(input => {
                    input.disabled = false;
                    input.value = "";
                });
                resendLink.textContent = "Resend OTP";
                resendLink.style.pointerEvents = "auto";
                // Clear all error messages
                errorDiv.textContent = "";
                // Do not show any resend confirmation message
                document.getElementById("resend-row").style.display = "none";
                startTimer();
            } else {
                errorDiv.textContent = result.message || "Failed to resend OTP.";
                resendLink.textContent = "Resend OTP";
                resendLink.style.pointerEvents = "auto";
            }
        });
    }
});

// Auto-focus logic for OTP boxes
const otpInputs = document.querySelectorAll('.otp-digit');
otpInputs.forEach((input, idx) => {
    input.addEventListener('input', function() {
        if (this.value.length === 1 && idx < otpInputs.length - 1) {
            otpInputs[idx + 1].focus();
        }
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value && idx > 0) {
            otpInputs[idx - 1].focus();
        }
    });
});

document.getElementById("otpForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    errorDiv.textContent = "";
    let otp = '';
    otpInputs.forEach(input => {
        otp += input.value;
    });
    if (!otp.match(/^\d{6}$/)) {
        errorDiv.textContent = "Please enter a valid 6-digit OTP.";
        return;
    }
    // Get email from localStorage
    const email = localStorage.getItem("otp_email");
    if (!email) {
        errorDiv.textContent = "Email not found. Please restart the process.";
        return;
    }
    // Show loader while verifying
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
    // Verify OTP via AJAX
    const response = await fetch("/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`
    });
    const result = await response.json();
    if (result.success) {
        window.location.href = "/new_password";
    } else {
        errorDiv.textContent = result.message || "Invalid OTP.";
        loadingDiv.remove();
    }
});
