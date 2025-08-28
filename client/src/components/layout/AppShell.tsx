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

  // Non mostrare la bottom nav su login o admin
  const shouldShowBottomNav =
    showBottomNav && location !== "/login" && !location.startsWith("/admin") && isMobile;

  // Mostra l'header con logo su tutte tranne admin/login
  const shouldShowHeaderLogo = !location.startsWith("/admin") && location !== "/login";

  return (
    <div className="min-h-[100svh] min-h-[100dvh] w-full bg-[#fff4d6] text-foreground flex flex-col">
      {/* HEADER con safe-area top (nessun calc inline) */}
      {shouldShowHeaderLogo && (
        <header className="header-mobile-safe bg-brand-azzurro text-white border-b border-brand-azzurro sticky top-0 z-30">
          <div className="flex items-center justify-center px-2 py-2">
            <img
              src="/matchbox-logo.png"
              alt="MATCHBOX"
              className="h-12 w-auto"
            />
          </div>
        </header>
      )}

      {/* MAIN content wrapper - PWA unificato iOS/Android */}
      <main className="relative z-10 flex-1 content-wrapper safe-left safe-right">
        {children}
      </main>

      {/* BOTTOM NAV – il componente applica .bottom-navigation-mobile (fixed + safe-area) */}
      {shouldShowBottomNav && <BottomNavigation onNavigate={setLocation} />}
    </div>
  );
}
