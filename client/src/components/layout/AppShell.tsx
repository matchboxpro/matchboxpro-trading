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

  return (
    <div 
      className="relative bg-[#fff4d6] w-full"
      style={{
        height: '100svh',
        overflow: 'hidden'
      }}
    >
      {/* Header with safe area */}
      <div 
        className="bg-brand-azzurro border-b border-brand-azzurro flex-shrink-0"
        style={{
          paddingTop: 'calc(var(--sat) + 12px)', // Safe area + extra padding
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

      {/* Bottom Navigation with safe area */}
      {shouldShowBottomNav && (
        <div 
          className="fixed left-0 right-0 bottom-0 bg-brand-azzurro border-t border-brand-azzurro max-w-md mx-auto"
          style={{
            paddingBottom: 'var(--sab)',
            height: 'calc(var(--nav-h) + var(--sab))'
          }}
        >
          <BottomNavigation onNavigate={setLocation} />
        </div>
      )}
    </div>
  );
}
