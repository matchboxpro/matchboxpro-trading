import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Copy } from "lucide-react";

interface StickerDetailDialogProps {
  sticker: any | null;
  isOpen: boolean;
  onClose: () => void;
  status: string;
  onUpdateSticker: (stickerId: string, status: "yes" | "no" | "double") => void;
}

export const StickerDetailDialog: React.FC<StickerDetailDialogProps> = ({
  sticker,
  isOpen,
  onClose,
  status,
  onUpdateSticker
}) => {
  if (!sticker) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "yes": return <Badge className="bg-green-500 text-white">Posseduta</Badge>;
      case "double": return <Badge className="bg-blue-500 text-white">Doppione</Badge>;
      default: return <Badge variant="outline">Mancante</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#052b3e]">
            Figurina #{sticker.number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[#052b3e] mb-2">{sticker.name}</h3>
            {sticker.team && (
              <p className="text-[#05637b] text-sm">{sticker.team}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#05637b]">Stato:</span>
            {getStatusBadge(status)}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant={status === "yes" ? "default" : "outline"}
              className={`flex-1 ${status === "yes" ? "bg-green-500 hover:bg-green-600" : "hover:bg-green-50"}`}
              onClick={() => {
                onUpdateSticker(sticker.id, status === "yes" ? "no" : "yes");
                onClose();
              }}
            >
              <Check className="w-4 h-4 mr-2" />
              {status === "yes" ? "Rimuovi" : "Posseduta"}
            </Button>
            
            <Button
              variant={status === "double" ? "default" : "outline"}
              className={`flex-1 ${status === "double" ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-blue-50"}`}
              onClick={() => {
                onUpdateSticker(sticker.id, status === "double" ? "no" : "double");
                onClose();
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              {status === "double" ? "Rimuovi" : "Doppione"}
            </Button>
            
            <Button
              variant={status === "no" ? "default" : "outline"}
              className={`flex-1 ${status === "no" ? "bg-gray-500 hover:bg-gray-600" : "hover:bg-gray-50"}`}
              onClick={() => {
                onUpdateSticker(sticker.id, "no");
                onClose();
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Mancante
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
