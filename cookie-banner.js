document.addEventListener("DOMContentLoaded", () => {

    // Inject modal HTML
    const cookieHTML = `
    <div id="cookie-overlay" class="cookie-overlay hidden"></div>
    <div id="cookie-modal" class="cookie-modal hidden">
        <p class="cookie-text">
            We use cookies to improve your experience. Some cookies are essential for the site to work, 
            while others help us understand how you use the site so we can improve it. 
            You can read more in our 
            <a href="privacy.html" class="cookie-link">Privacy Policy</a>.
        </p>

        <div class="cookie-actions">
            <button id="cookie-preferences" class="cookie-btn cookie-outline">
                Manage my preferences
            </button>

            <button id="cookie-accept" class="cookie-btn cookie-solid">
                Accept All Cookies
            </button>
        </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", cookieHTML);

    // Inject CSS
    const style = document.createElement("style");
    style.textContent = `
    /* Background dimmer */
    .cookie-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        z-index: 9998;
    }

    /* Modal box */
    .cookie-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 90%;
        max-width: 550px;
        padding: 28px;
        border-radius: 12px;
        box-shadow: 0 4px 18px rgba(0,0,0,0.15);
        z-index: 9999;
        font-family: inherit;
    }

    .cookie-text {
        font-size: 15px;
        line-height: 1.6;
        color: #333;
        margin-bottom: 20px;
    }

    .cookie-link {
        color: #800020;
        text-decoration: underline;
    }

    .cookie-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
    }

    .cookie-btn {
        padding: 10px 18px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        font-weight: 600;
    }

    .cookie-outline {
        border: 2px solid #800020;
        background: transparent;
        color: #800020;
    }

    .cookie-outline:hover {
        background: #f6e6ea;
    }

    .cookie-solid {
        border: none;
        background: #800020;
        color: white;
    }

    .cookie-solid:hover {
        background: #a3213a;
    }

    .hidden {
        display: none;
    }
    `;
    document.head.appendChild(style);

    // Logic
    const overlay = document.getElementById("cookie-overlay");
    const modal = document.getElementById("cookie-modal");
    const acceptBtn = document.getElementById("cookie-accept");
    const prefBtn = document.getElementById("cookie-preferences");

    // Only show if user hasn't chosen yet
    if (!localStorage.getItem("cookieChoice")) {
        overlay.classList.remove("hidden");
        modal.classList.remove("hidden");
    }

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieChoice", "accepted");
        overlay.classList.add("hidden");
        modal.classList.add("hidden");
    });

    prefBtn.addEventListener("click", () => {
        localStorage.setItem("cookieChoice", "preferences-opened");
        overlay.classList.add("hidden");
        modal.classList.add("hidden");
        alert("In a real website, this would open detailed cookie settings. For your portfolio, this alert is fine.");
    });
});
