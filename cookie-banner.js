// Inject cookie banner HTML
const cookieHTML = `
<div id="cookie-banner" class="cookie-banner hidden">
  <p>This website uses cookies to improve your experience. By continuing, you agree to our use of cookies.</p>
  <button id="accept-cookies">OK</button>
</div>
`;
document.body.insertAdjacentHTML("beforeend", cookieHTML);

// Inject CSS styles
const style = document.createElement("style");
style.textContent = `
.cookie-banner {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #1a1a1a;
    color: #fff;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.3);
    z-index: 9999;
}
.cookie-banner p { margin: 0; }
.cookie-banner button {
    background: #800020; 
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}
.cookie-banner button:hover {
    background: #a3213a;
}
.cookie-banner.hidden { display: none; }
`;
document.head.appendChild(style);

// Cookie logic
document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");
    const button = document.getElementById("accept-cookies");

    if (!localStorage.getItem("cookiesAccepted")) {
        banner.classList.remove("hidden");
    }

    button.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "yes");
        banner.classList.add("hidden");
    });
});
