// PWA utilities to maintain fullscreen behavior
export const preventBrowserUIShow = () => {
  // Force fullscreen mode
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100vh';
  document.body.style.height = '100dvh';
  
  // Set viewport height to prevent browser UI from showing
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Force hide address bar on mobile browsers
    if (window.innerHeight < window.outerHeight) {
      window.scrollTo(0, 1);
    }
  };
  
  setViewportHeight();
  
  // Update on resize/orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);
  
  // Force hide address bar on load
  window.addEventListener('load', () => {
    window.scrollTo(0, 1);
  });
  
  // Prevent pull-to-refresh and overscroll
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (touch.clientY <= 40 && window.pageYOffset === 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  document.addEventListener('touchmove', (e) => {
    // Allow scrolling only within scrollable containers
    const target = e.target as HTMLElement;
    const scrollableParent = target.closest('[style*="overflow-y: auto"], [style*="overflow: auto"], .overflow-y-auto, .overflow-auto');
    
    if (!scrollableParent) {
      e.preventDefault();
    }
  }, { passive: false });
};

// Initialize PWA fullscreen behavior
export const initializePWA = () => {
  // Always apply fullscreen behavior on mobile
  if (window.innerWidth <= 768 || (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches) {
    preventBrowserUIShow();
    
    // Additional mobile-specific fixes
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Hide address bar on mobile browsers
      window.scrollTo(0, 1);
      
      // Request fullscreen if available
      if (document.documentElement.requestFullscreen) {
        document.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        }, { once: true });
      }
    }
  }
};
