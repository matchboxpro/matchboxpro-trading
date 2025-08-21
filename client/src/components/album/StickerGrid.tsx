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
    if (localStates[stickerId]) {
      return localStates[stickerId];
    }
    const userSticker = (userStickers || []).find((us: any) => us.stickerId === stickerId);
    return userSticker?.status || "no";
  };

  const handleUpdateSticker = useCallback((stickerId: string, newStatus: "yes" | "no" | "double") => {
    // Aggiornamento immediato dello stato locale per feedback visivo istantaneo
    setLocalStates(prev => ({
      ...prev,
      [stickerId]: newStatus
    }));
    
    // Chiamata API asincrona senza bloccare l'UI
    requestAnimationFrame(() => {
      onUpdateSticker(stickerId, newStatus);
    });
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
      case "yes": return "bg-[#05637b] border-[#05637b]";
      case "double": return "bg-[#05637b] border-[#05637b]";
      default: return "bg-[#05637b] border-[#05637b]";
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
    <div className="bg-[#fff4d6] px-2 py-1 w-full min-h-0">
      <div className="space-y-0.5 w-full max-w-none">
        {filteredStickers.map((sticker: any) => {
          const status = getUserStickerStatus(sticker.id);
          return (
            <div
              key={sticker.id}
              style={{ 
                minHeight: '34px',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                backgroundColor: '#05637b',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                width: '100%',
                minWidth: '0',
                maxWidth: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#05637b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#05637b';
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.backgroundColor = '#05637b';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.backgroundColor = '#05637b';
              }}
            >
              {/* Numero figurina - clickable */}
              <div 
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  backgroundColor: '#f4a623',
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  borderRadius: '8px',
                  minWidth: '40px',
                  textAlign: 'center',
                  flexShrink: '0',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f4a623';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f4a623';
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.backgroundColor = '#f4a623';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.backgroundColor = '#f4a623';
                }}
                onClick={() => onStickerClick(sticker)}
              >
                {sticker.number.toString().padStart(3, '0')}
              </div>

              {/* Nome figurina - clickable */}
              <div 
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  color: 'white',
                  flex: '1',
                  marginLeft: '12px',
                  marginRight: '12px',
                  fontWeight: '500',
                  textAlign: 'left',
                  minWidth: '0',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onClick={() => onStickerClick(sticker)}
              >
                <div style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sticker.name}
                </div>
                {sticker.team && (
                  <div style={{ fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.2', color: '#05637b' }}>
                    {sticker.team}
                  </div>
                )}
              </div>

              {/* Bottoni azione */}
              <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()} style={{ minWidth: '140px' }}>
                <Button
                  size="sm"
                  className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg flex items-center justify-center ${
                    status === "yes" || status === "double"
                      ? "bg-green-500 hover:bg-green-600 text-white" 
                      : "bg-white/20 hover:bg-green-500 text-white"
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'none',
                    transform: 'translateZ(0)',
                    willChange: 'background-color'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateSticker(sticker.id, "yes");
                  }}
                  onTouchStart={(e) => {
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
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'none',
                    transform: 'translateZ(0)',
                    willChange: 'background-color'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateSticker(sticker.id, "no");
                  }}
                  onTouchStart={(e) => {
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
                      : (status === "yes" || status === "double")
                      ? "bg-white/20 hover:bg-[#f4a623] hover:text-black text-white"
                      : "bg-white/10 text-white/30 cursor-not-allowed opacity-30"
                  }`}
                  style={{ 
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'none',
                    transform: 'translateZ(0)',
                    willChange: 'background-color'
                  }}
                  disabled={status !== "yes" && status !== "double"}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (status === "no") return;
                    if (status === "yes") {
                      handleUpdateSticker(sticker.id, "double");
                    } else if (status === "double") {
                      handleUpdateSticker(sticker.id, "yes");
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (status === "no") return;
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
