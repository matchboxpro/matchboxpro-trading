import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditStickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: any;
  description: string;
  setDescription: (value: string) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export const EditStickerDialog: React.FC<EditStickerDialogProps> = ({
  isOpen,
  onClose,
  sticker,
  description,
  setDescription,
  onSave,
  isSaving
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica Figurina</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Numero: {sticker?.number}
            </label>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Descrizione
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Inserisci nuova descrizione"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annulla
          </Button>
          <Button
            onClick={onSave}
            disabled={!description.trim() || isSaving}
          >
            {isSaving ? "Salvando..." : "Salva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
