// PWA utilities to maintain fullscreen behavior
export const preventBrowserUIShow = () => {
  // Prevent scrolling that triggers browser UI
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  // Set viewport height to prevent browser UI from showing
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setViewportHeight();
  
  // Update on resize/orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);
  
  // Prevent pull-to-refresh
  document.body.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (touch.clientY <= 40) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Prevent overscroll
  document.body.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
};

// Initialize PWA fullscreen behavior
export const initializePWA = () => {
  if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
    preventBrowserUIShow();
  }
};
