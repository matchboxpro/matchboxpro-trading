import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Settings, BookOpen } from "lucide-react";

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
  const totalStickers = stickers.length;
  const ownedStickers = (userStickers || []).filter((us: any) => us.status === "yes" || us.status === "double").length;
  const missingStickers = totalStickers - ownedStickers;
  const doubleStickers = (userStickers || []).filter((us: any) => us.status === "double").length;

  const getFilterCount = (filterType: string) => {
    switch (filterType) {
      case "mine": return ownedStickers;
      case "missing": return missingStickers;
      case "double": return doubleStickers;
      default: return totalStickers;
    }
  };

  return (
    <div className="bg-[#05637b] text-white relative w-full">
      {/* Header azzurro con logo - identico alle altre pagine */}
      <div className="bg-brand-azzurro border-b border-brand-azzurro p-2">
        <div className="flex items-center justify-center">
          <img 
            src="/matchbox-logo.png" 
            alt="MATCHBOX" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Titolo e statistiche centrati */}
      <div className="text-center px-4 py-3">
        <h1 className="text-lg font-bold text-white mb-1">
          {album?.name}
        </h1>
        <div className="text-white/80 text-xs">
          {ownedStickers}/{totalStickers} figurine ({Math.round((ownedStickers / totalStickers) * 100)}%)
        </div>
      </div>

      {/* Filtri orizzontali */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-4 gap-1">
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
        </div>
      </div>
    </div>
  );
};
