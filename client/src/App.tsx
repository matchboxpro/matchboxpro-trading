import { Switch, Route, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { initializePWA } from "@/utils/pwaUtils";

import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Album from "@/pages/album";
import Match from "@/pages/match";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => fetch('/api/auth/me', { credentials: 'include' }).then(res => {
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    }),
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      // Se non autenticato, vai al login
      if (location !== "/login") {
        setLocation("/login");
      }
    } else if (user) {
      if (location === "/login") {
        // Redirect dopo login successful - vai alla dashboard
        setLocation("/");
      } else if (location !== "/" && location !== "/dashboard" && location !== "/album" && location !== "/match" && location !== "/profile" && !location.startsWith("/chat") && location !== "/admin") {
        // Se l'utente è su una route non valida (404), reindirizza alla dashboard
        setLocation("/");
      }
    }
  }, [user, isLoading, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fff4d6]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#05637b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#052b3e]/60">Caricamento...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const [location, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Admin panel only accessible on desktop
  if (location.startsWith("/admin") && isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fff4d6]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-[#052b3e] mb-2">Desktop Required</h2>
          <p className="text-[#05637b]">Il pannello admin è accessibile solo da desktop.</p>
        </div>
      </div>
    );
  }

  // Don't show bottom nav on login or admin pages
  const showBottomNav = location !== "/login" && !location.startsWith("/admin") && isMobile;

  return (
    <div className="relative bg-[#fff4d6]" style={{
      height: '100dvh',
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div className="h-full overflow-y-auto" style={{
        paddingBottom: showBottomNav ? '60px' : '0',
        height: 'calc(100% - env(safe-area-inset-top) - env(safe-area-inset-bottom))'
      }}>
        <Switch>
        <Route path="/login" component={Login} />
        <Route path="/admin" component={Admin} />
        
        {/* Protected routes */}
        <Route path="/">
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        </Route>
        <Route path="/dashboard">
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        </Route>
        <Route path="/album">
          <AuthGuard>
            <Album />
          </AuthGuard>
        </Route>
        <Route path="/match">
          <AuthGuard>
            <Match />
          </AuthGuard>
        </Route>
        <Route path="/chat/:matchId">
          <AuthGuard>
            <Chat />
          </AuthGuard>
        </Route>
        <Route path="/profile">
          <AuthGuard>
            <Profile />
          </AuthGuard>
        </Route>
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
        </Switch>
      </div>
      
      {showBottomNav && <BottomNavigation onNavigate={setLocation} />}
    </div>
  );
}

function App() {
  useEffect(() => {
    initializePWA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;