import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupErrorReporting } from "./utils/errorReporter";

// Setup error reporting to capture all client-side errors
setupErrorReporting();

// PWA Fullscreen functionality
const hideAddressBar = () => {
  // Force hide address bar on mobile browsers
  window.scrollTo(0, 1);
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
};

// Hide address bar on load and orientation change
window.addEventListener('load', hideAddressBar);
window.addEventListener('orientationchange', () => {
  setTimeout(hideAddressBar, 500);
});

// Prevent zoom and enable fullscreen behavior
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
});

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, false);

createRoot(document.getElementById("root")!).render(<App />);
