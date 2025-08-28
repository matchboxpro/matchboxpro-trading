import { Home, Zap, Image, User } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  onNavigate: (path: string) => void;
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const handleNavigate = (path: string) => {
    if (location !== path) onNavigate(path);
  };

  return (
    <nav
      role="navigation"
      aria-label="Navigazione principale"
      className="bottom-navigation-mobile bg-brand-azzurro text-white select-none"
    >
      <div className="grid grid-cols-4 h-full items-center">
        <button
          type="button"
          onClick={() => handleNavigate("/")}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-1 transition-colors ${
            isActive("/") ? "text-brand-giallo drop-shadow-sm" : "text-white/90 hover:text-white"
          }`}
          aria-current={isActive("/") ? "page" : undefined}
        >
          <Home className="w-6 h-6 mb-1 drop-shadow-sm" aria-hidden="true" />
          <span className="text-xs font-medium drop-shadow-sm">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/match")}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-1 transition-colors ${
            isActive("/match") ? "text-brand-giallo drop-shadow-sm" : "text-white/90 hover:text-white"
          }`}
          aria-current={isActive("/match") ? "page" : undefined}
        >
          <Zap className="w-6 h-6 mb-1 drop-shadow-sm" aria-hidden="true" />
          <span className="text-xs font-medium drop-shadow-sm">Match</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleNavigate("/album");
            window.dispatchEvent(new CustomEvent("forceAlbumReset"));
          }}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-1 transition-colors ${
            isActive("/album") ? "text-brand-giallo drop-shadow-sm" : "text-white/90 hover:text-white"
          }`}
          aria-current={isActive("/album") ? "page" : undefined}
        >
          <Image className="w-6 h-6 mb-1 drop-shadow-sm" aria-hidden="true" />
          <span className="text-xs font-medium drop-shadow-sm">Album</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/profile")}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-1 transition-colors ${
            isActive("/profile") ? "text-brand-giallo drop-shadow-sm" : "text-white/90 hover:text-white"
          }`}
          aria-current={isActive("/profile") ? "page" : undefined}
        >
          <User className="w-6 h-6 mb-1 drop-shadow-sm" aria-hidden="true" />
          <span className="text-xs font-medium drop-shadow-sm">Profilo</span>
        </button>
      </div>
    </nav>
  );
}
