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
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-2 ${
            isActive("/") ? "text-brand-giallo" : "text-white"
          }`}
          aria-current={isActive("/") ? "page" : undefined}
        >
          <Home className="w-5 h-5 mb-1" aria-hidden="true" />
          <span className="text-xs">Home</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/match")}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-2 ${
            isActive("/match") ? "text-brand-giallo" : "text-white"
          }`}
          aria-current={isActive("/match") ? "page" : undefined}
        >
          <Zap className="w-5 h-5 mb-1" aria-hidden="true" />
          <span className="text-xs">Match</span>
        </button>

        <button
          type="button"
          onClick={() => {
            handleNavigate("/album");
            window.dispatchEvent(new CustomEvent("forceAlbumReset"));
          }}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-2 ${
            isActive("/album") ? "text-brand-giallo" : "text-white"
          }`}
          aria-current={isActive("/album") ? "page" : undefined}
        >
          <Image className="w-5 h-5 mb-1" aria-hidden="true" />
          <span className="text-xs">Album</span>
        </button>

        <button
          type="button"
          onClick={() => handleNavigate("/profile")}
          className={`touch-manipulation flex flex-col items-center justify-center h-full py-2 ${
            isActive("/profile") ? "text-brand-giallo" : "text-white"
          }`}
          aria-current={isActive("/profile") ? "page" : undefined}
        >
          <User className="w-5 h-5 mb-1" aria-hidden="true" />
          <span className="text-xs">Profilo</span>
        </button>
      </div>
    </nav>
  );
}
