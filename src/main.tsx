import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  // The worker is built with autoUpdate, so a new one installs and claims the
  // page on its own - but the page carries on running the build it loaded
  // with. Without the reload below, the first visit after a deploy shows the
  // previous version, which reads as "the change wasn't made".
  const hadController = !!navigator.serviceWorker.controller;
  let reloading = false;

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Skip the very first install, where there was nothing to replace.
    if (reloading || !hadController) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        // A kiosk can sit on the same page for hours, so poll for new builds
        // rather than waiting for someone to navigate.
        setInterval(() => registration.update(), 30 * 60 * 1000);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
