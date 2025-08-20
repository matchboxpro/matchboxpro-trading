import React, { useState, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Copy } from "lucide-react";

interface StickerGridProps {
  stickers: any[];
  userStickers: any[];
  filter: "all" | "mine" | "missing" | "double";
  onStickerClick: (sticker: any) => void;
  onUpdateSticker: (stickerId: string, status: "yes" | "no" | "double") => void;
}

export const StickerGrid: React.FC<StickerGridProps> = ({
  stickers,
  userStickers,
  filter,
  onStickerClick,
  onUpdateSticker
}) => {
  const [localStates, setLocalStates] = useState<Record<string, string>>({});

  const getUserStickerStatus = (stickerId: string) => {
    // Usa stato locale se presente, altrimenti stato server
    if (localStates[stickerId]) {
      return localStates[stickerId];
    }
    const userSticker = (userStickers || []).find((us: any) => us.stickerId === stickerId);
    return userSticker?.status || "no";
  };

  const handleUpdateSticker = useCallback((stickerId: string, newStatus: "yes" | "no" | "double") => {
    // Aggiorna immediatamente lo stato locale per feedback visivo
    setLocalStates(prev => ({
      ...prev,
      [stickerId]: newStatus
    }));

    // Usa la callback passata dal parent
    onUpdateSticker(stickerId, newStatus);
  }, [onUpdateSticker]);

  const filteredStickers = stickers.filter((sticker: any) => {
    const status = getUserStickerStatus(sticker.id);
    switch (filter) {
      case "mine": return status === "yes" || status === "double";
      case "missing": return status === "no";
      case "double": return status === "double";
      default: return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "yes": return "bg-green-100 border-green-300 text-green-800";
      case "double": return "bg-blue-100 border-blue-300 text-blue-800";
      default: return "bg-gray-50 border-gray-200 text-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "yes": return <Badge className="bg-green-500 text-white">Posseduta</Badge>;
      case "double": return <Badge className="bg-blue-500 text-white">Doppione</Badge>;
      default: return <Badge variant="outline">Mancante</Badge>;
    }
  };

  return (
    <div className="bg-[#fff4d6] px-2 py-2 w-full min-h-0">
      <div className="space-y-2 w-full max-w-none">
        {filteredStickers.map((sticker: any) => {
          const status = getUserStickerStatus(sticker.id);
          return (
            <div
              key={sticker.id}
              className="bg-[#05637b] rounded-xl p-3 flex items-center justify-between shadow-lg w-full min-w-0 max-w-none touch-manipulation"
              style={{ minHeight: '60px' }}
            >
              {/* Numero figurina - clickable */}
              <div 
                className="bg-[#f4a623] text-black font-bold text-sm px-2 py-2 rounded-lg min-w-[40px] text-center flex-shrink-0 cursor-pointer"
                onClick={() => onStickerClick(sticker)}
              >
                {sticker.number.toString().padStart(3, '0')}
              </div>

              {/* Nome figurina - clickable */}
              <div 
                className="flex-1 mx-3 text-white font-medium text-left min-w-0 cursor-pointer"
                onClick={() => onStickerClick(sticker)}
              >
                <div className="text-xs truncate">
                  {sticker.name}
                </div>
                {sticker.team && (
                  <div className="text-[10px] text-[#05637b] truncate leading-tight">
                    {sticker.team}
                  </div>
                )}
              </div>

              {/* Bottoni azione */}
              <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()} style={{ minWidth: '140px' }}>
                <Button
                  size="sm"
                  className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg flex items-center justify-center ${
                    status === "yes"
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-white/20 hover:bg-green-500 text-white"
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateSticker(sticker.id, "yes");
                  }}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg flex items-center justify-center ${
                    status === "no" 
                      ? "bg-red-500 hover:bg-red-600 text-white" 
                      : "bg-white/20 hover:bg-red-500 text-white"
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateSticker(sticker.id, "no");
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg flex items-center justify-center ${
                    status === "double" 
                      ? "bg-[#f4a623] hover:bg-[#f4a623]/90 text-black" 
                      : status === "yes"
                      ? "bg-white/20 hover:bg-[#f4a623] hover:text-black text-white"
                      : "bg-white/10 text-white/50 cursor-not-allowed"
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                  disabled={status !== "yes" && status !== "double"}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (status === "yes") {
                      handleUpdateSticker(sticker.id, "double");
                    } else if (status === "double") {
                      handleUpdateSticker(sticker.id, "yes");
                    }
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredStickers.length === 0 && (
        <div className="col-span-full text-center py-12">
          <div className="text-[#05637b] text-lg">
            {filter === "all" && "Nessuna figurina trovata"}
            {filter === "mine" && "Non hai ancora nessuna figurina"}
            {filter === "missing" && "Complimenti! Hai tutte le figurine!"}
            {filter === "double" && "Non hai doppioni"}
          </div>
        </div>
      )}
    </div>
  );
};
