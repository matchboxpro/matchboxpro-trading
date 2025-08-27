import { ReactNode } from "react";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppShellProps {
  children: ReactNode;
  showBottomNav?: boolean;
}

export function AppShell({ children, showBottomNav = true }: AppShellProps) {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Don't show bottom nav on login or admin pages
  const shouldShowBottomNav = showBottomNav && 
    location !== "/login" && 
    !location.startsWith("/admin") && 
    isMobile;

  // Show header logo on all pages except admin and login
  const shouldShowHeaderLogo = !location.startsWith("/admin") && location !== "/login";

  return (
    <div 
      className="relative bg-[#fff4d6] w-full"
      style={{
        height: '100svh',
        overflow: 'hidden'
      }}
    >
      {/* Header with safe area */}
      {shouldShowHeaderLogo && (
        <div 
          className="bg-brand-azzurro border-b border-brand-azzurro flex-shrink-0 header-mobile-safe app-shell-header"
          style={{
            paddingBottom: '8px'
          }}
        >
          <div className="flex items-center justify-center px-2">
            <img 
              src="/matchbox-logo.png" 
              alt="MATCHBOX" 
              className="h-12 w-auto"
            />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div 
        className="flex-1 overflow-hidden"
        style={{
          height: shouldShowBottomNav 
            ? 'calc(100svh - 80px - var(--sat) - var(--nav-h) - var(--sab))' 
            : 'calc(100svh - 80px - var(--sat) - var(--sab))',
          paddingLeft: 'var(--sal)',
          paddingRight: 'var(--sar)'
        }}
      >
        {children}
      </div>

      {/* Bottom Navigation - Fixed at Bottom with iOS Safe Area */}
      {shouldShowBottomNav && (
        <div 
          className="fixed inset-x-0 bottom-0 bg-brand-azzurro border-t border-brand-azzurro"
          style={{
            position: 'fixed',
            bottom: '0px',
            left: '0px',
            right: '0px',
            zIndex: 9999,
            height: 'calc(var(--nav-h) + var(--sab))',
            width: '100vw',
            margin: '0px',
            paddingBottom: 'var(--sab)',
            backgroundColor: 'var(--brand-azzurro)'
          }}
        >
          <BottomNavigation onNavigate={setLocation} />
        </div>
      )}
    </div>
  );
}
