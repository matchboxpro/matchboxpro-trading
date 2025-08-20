// PWA utilities to maintain fullscreen behavior
export const preventBrowserUIShow = () => {
  // Force fullscreen mode
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
  document.body.style.height = '100vh';
  document.body.style.height = '100dvh';
  document.body.style.top = '0';
  document.body.style.left = '0';
  
  // Set viewport height to prevent browser UI from showing
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Aggressive address bar hiding for mobile browsers
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Multiple attempts to hide address bar
      setTimeout(() => window.scrollTo(0, 1), 100);
      setTimeout(() => window.scrollTo(0, 0), 200);
      setTimeout(() => window.scrollTo(0, 1), 300);
      
      // Force minimal-ui on iOS
      const metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no, minimal-ui');
      }
    }
  };
  
  setViewportHeight();
  
  // Update on resize/orientation change with delay
  const handleResize = () => {
    setTimeout(setViewportHeight, 100);
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // Force hide address bar on load and focus
  window.addEventListener('load', setViewportHeight);
  window.addEventListener('focus', setViewportHeight);
  
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
  const isMobile = window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isPWA = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
  
  if (isMobile || isPWA) {
    preventBrowserUIShow();
    
    // Additional mobile-specific fixes
    if (isMobile) {
      // Multiple attempts to hide address bar
      const hideAddressBar = () => {
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 100);
        setTimeout(() => window.scrollTo(0, 1), 200);
      };
      
      hideAddressBar();
      
      // Try again after page load
      setTimeout(hideAddressBar, 500);
      setTimeout(hideAddressBar, 1000);
      
      // Force fullscreen on user interaction
      const requestFullscreen = () => {
        if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      };
      
      document.addEventListener('touchstart', requestFullscreen, { once: true });
      document.addEventListener('click', requestFullscreen, { once: true });
    }
  }
};

// Force PWA behavior on page visibility change
export const handleVisibilityChange = () => {
  if (!document.hidden && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    setTimeout(() => {
      window.scrollTo(0, 1);
      setTimeout(() => window.scrollTo(0, 0), 100);
    }, 100);
  }
};

// Add visibility change listener
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', handleVisibilityChange);
}
