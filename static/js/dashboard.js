document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById('hamburger-menu');
    const slideMenu = document.getElementById('slide-menu');
    if (hamburger && slideMenu) {
        hamburger.addEventListener('click', () => {
            slideMenu.classList.toggle('open');
        });
    }

    const body = document.body;
    const menuBar = document.querySelector(".slide-menu ul");
    const toggleLi = document.createElement("li");
    const toggleBtn = document.createElement("button");

    toggleBtn.textContent = "Dark Mode";
    toggleBtn.style.background = "transparent";
    toggleBtn.style.border = "1px solid #00bfff";
    toggleBtn.style.borderRadius = "6px"; 
    toggleBtn.style.color = "#f5f5f5";
    toggleBtn.style.padding = "6px 12px";
    toggleBtn.style.cursor = "pointer";

    toggleLi.appendChild(toggleBtn);
    menuBar.appendChild(toggleLi);

    toggleBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        toggleBtn.textContent = body.classList.contains("light-mode") ? "Light Mode" : "Dark Mode";
    });
 
    async function loadDashboardData() {
        try {
            const response = await fetch("/dashboard/data");
            const data = await response.json();
            document.querySelector(".card:nth-child(1) p").textContent = data.total_users;
        } catch (err) {
            console.error("Failed to load dashboard data:", err);
        }
    }
    loadDashboardData();
});

const profileBtn = document.getElementById("profileBtn");
const projectBtn = document.getElementById("projectBtn");
const logoutBtn = document.getElementById("logoutBtn");

profileBtn.addEventListener("click", function(e) {
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
});


projectBtn.addEventListener("click", function(e) {
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
});

logoutBtn.addEventListener("click", function(e) {
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
});