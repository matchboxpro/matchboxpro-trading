import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteStickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sticker: any;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteStickerDialog: React.FC<DeleteStickerDialogProps> = ({
  isOpen,
  onClose,
  sticker,
  onDelete,
  isDeleting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Elimina Figurina</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Sei sicuro di voler eliminare la figurina <strong>{sticker?.number}</strong>?
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Descrizione:</strong> {sticker?.name || sticker?.description}
            </p>
          </div>
          <p className="text-sm text-red-600">
            ⚠️ Questa azione non può essere annullata.
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annulla
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Elimina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
