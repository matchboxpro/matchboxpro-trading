import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface StickerDetailDialogProps {
  sticker: any | null;
  isOpen: boolean;
  onClose: () => void;
  status: string;
  onUpdateSticker?: (stickerId: string, status: "yes" | "no" | "double") => void;
}

export const StickerDetailDialog: React.FC<StickerDetailDialogProps> = ({
  sticker,
  isOpen,
  onClose,
  status
}) => {
  if (!sticker) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "yes": return <Badge className="bg-green-500 text-white text-sm px-3 py-1">Posseduta</Badge>;
      case "double": return <Badge className="bg-[#f4a623] text-black text-sm px-3 py-1">Doppione</Badge>;
      default: return <Badge className="bg-red-500 text-white text-sm px-3 py-1">Mancante</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-[#fff4d6] border-4 border-[#05637b] rounded-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="/matchbox-logo.png" 
              alt="MATCHBOX" 
              className="h-8 w-auto"
            />
          </div>
          <DialogTitle className="text-[#05637b] text-xl font-bold">
            Figurina #{sticker.number.toString().padStart(3, '0')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 text-center">
          <div className="bg-[#05637b] rounded-xl p-4 text-white">
            <h3 className="font-bold text-lg mb-2">{sticker.name}</h3>
            {sticker.team && (
              <p className="text-white/80 text-sm">{sticker.team}</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-2">
            <span className="text-[#05637b] font-medium">Stato:</span>
            {getStatusBadge(status)}
          </div>

          {sticker.description && (
            <div className="bg-white/50 rounded-lg p-3">
              <p className="text-[#05637b] text-sm">{sticker.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
