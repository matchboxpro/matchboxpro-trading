import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface DeleteAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  album: any;
  onSuccess: () => void;
}

export const DeleteAlbumDialog: React.FC<DeleteAlbumDialogProps> = ({
  isOpen,
  onClose,
  album,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("DELETE", `/api/albums/${album.id}`);
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["albums"] });
        toast({
          title: "Album eliminato",
          description: "L'album e tutte le sue figurine sono stati eliminati"
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione dell'album",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600">
            Elimina Album
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-[#052b3e]">
            Sei sicuro di voler eliminare l'album <strong>"{album?.name}"</strong>?
          </p>
          <p className="text-sm text-red-600">
            ⚠️ Questa azione eliminerà anche tutte le figurine associate e non può essere annullata.
          </p>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Eliminando...' : 'Elimina Definitivamente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
