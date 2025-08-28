import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Settings, BookOpen, Menu } from "lucide-react";

interface AlbumHeaderProps {
  album: any;
  stickers: any[];
  userStickers: any[];
  filter: "all" | "mine" | "missing" | "double";
  onFilterChange: (filter: "all" | "mine" | "missing" | "double") => void;
  onBack: () => void;
}

export const AlbumHeader: React.FC<AlbumHeaderProps> = ({
  album,
  stickers,
  userStickers,
  filter,
  onFilterChange,
  onBack
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const totalStickers = stickers.length;
  const ownedStickers = (userStickers || []).filter((us: any) => us.status === "yes" || us.status === "double").length;
  const missingStickers = totalStickers - ownedStickers;
  const doubleStickers = (userStickers || []).filter((us: any) => us.status === "double").length;

  // Chiudi menu quando si clicca fuori - DISABILITATO per mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Solo su desktop (non touch device)
        if (!('ontouchstart' in window)) {
          setShowMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const getFilterCount = (filterType: string) => {
    switch (filterType) {
      case "mine": return (userStickers || []).filter((us: any) => us.status === "yes" || us.status === "double").length;
      case "missing": return missingStickers;
      case "double": return doubleStickers;
      default: return totalStickers;
    }
  };

  return (
    <div className="bg-brand-azzurro text-white relative w-full header-mobile-safe">
      
      {/* Dropdown menu - ingrandito del 50% e centrato */}
      {showMenu && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20">
          <div 
            className="bg-gradient-to-br from-[#fff4d6] to-white rounded-xl shadow-xl border-2 border-[#f4a623] min-w-[300px] max-w-[90vw] overflow-hidden"
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del menu */}
            <div className="bg-[#05637b] text-white px-4 py-2 text-center">
              <span className="font-bold text-sm">Statistiche Album</span>
            </div>
            
            {/* Contenuto statistiche */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <span className="text-[#052b3e] font-semibold text-sm">Mie:</span>
                <span className="text-green-600 font-bold text-lg">{ownedStickers}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <span className="text-[#052b3e] font-semibold text-sm">Mancanti:</span>
                <span className="text-red-600 font-bold text-lg">{missingStickers}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <span className="text-[#052b3e] font-semibold text-sm">Doppie:</span>
                <span className="text-blue-600 font-bold text-lg">{doubleStickers}</span>
              </div>
            </div>
            
            {/* Footer con percentuale */}
            <div className="bg-[#f4a623] text-[#052b3e] px-4 py-2 text-center">
              <span className="font-bold text-sm">
                Completamento: {Math.round((ownedStickers / totalStickers) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filtri orizzontali con hamburger integrato - il più in alto possibile */}
      <div className="px-4 pt-0 pb-1">
        <div className="grid grid-cols-5 gap-1">
          <Button
            onClick={() => onFilterChange("all")}
            className={`py-2 rounded-lg text-xs font-medium ${
              filter === "all" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Tutte
          </Button>
          <Button
            onClick={() => onFilterChange("mine")}
            className={`py-2 rounded-lg text-xs font-medium ${
              filter === "mine" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Mie
          </Button>
          <Button
            onClick={() => onFilterChange("missing")}
            className={`py-2 rounded-lg text-xs font-medium ${
              filter === "missing" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Mancanti
          </Button>
          <Button
            onClick={() => onFilterChange("double")}
            className={`py-2 rounded-lg text-xs font-medium ${
              filter === "double" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Doppie
          </Button>
          {/* Status button integrato nella griglia */}
          <div ref={menuRef}>
            <Button
              onMouseDown={(e) => {
                e.preventDefault();
                setShowMenu(!showMenu);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="bg-transparent hover:bg-transparent py-2 px-1 h-auto relative z-50 w-full flex items-center justify-center rounded-lg"
              style={{ 
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
            >
              <span className="text-xs font-medium text-[#f8b400]">Status</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
