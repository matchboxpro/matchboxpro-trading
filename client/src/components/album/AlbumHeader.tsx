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
  const ownedStickers = userStickers.filter((us: any) => us.status === "yes" || us.status === "double").length;
  const missingStickers = totalStickers - ownedStickers;
  const doubleStickers = userStickers.filter((us: any) => us.status === "double").length;

  const getFilterCount = (filterType: string) => {
    switch (filterType) {
      case "mine": return ownedStickers;
      case "missing": return missingStickers;
      case "double": return doubleStickers;
      default: return totalStickers;
    }
  };

  return (
    <div className="bg-[#05637b] p-4 text-white relative pb-20">

      {/* Titolo e statistiche centrati */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <img 
            src="/matchbox-logo.png" 
            alt="MATCHBOX" 
            className="h-12 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {album?.name}
        </h1>
        <div className="text-white/80 text-sm">
          {ownedStickers}/{totalStickers} figurine ({Math.round((ownedStickers / totalStickers) * 100)}%)
        </div>
      </div>

      {/* Filtri orizzontali */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-2">
        <div className="grid grid-cols-4 gap-2">
          <Button
            onClick={() => onFilterChange("all")}
            className={`py-2 rounded-lg text-sm font-medium ${
              filter === "all" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Tutte
          </Button>
          <Button
            onClick={() => onFilterChange("mine")}
            className={`py-2 rounded-lg text-sm font-medium ${
              filter === "mine" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Mie
          </Button>
          <Button
            onClick={() => onFilterChange("missing")}
            className={`py-2 rounded-lg text-sm font-medium ${
              filter === "missing" 
                ? "bg-[#f4a623] text-black font-semibold" 
                : "bg-[#05637b] text-white font-semibold hover:bg-[#f4a623] hover:text-black"
            }`}
          >
            Mancanti
          </Button>
          <Button
            onClick={() => onFilterChange("double")}
            className={`py-2 rounded-lg text-sm font-medium ${
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
