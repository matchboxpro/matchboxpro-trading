import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface EditAlbumDialogProps {
  isOpen: boolean;
  onClose: () => void;
  album: any;
  onSuccess: () => void;
}

export const EditAlbumDialog: React.FC<EditAlbumDialogProps> = ({
  isOpen,
  onClose,
  album,
  onSuccess
}) => {
  const [albumName, setAlbumName] = useState(album?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!albumName.trim() || albumName.trim() === album?.name) return;

    setIsLoading(true);
    try {
      const response = await apiRequest("PUT", `/api/albums/${album.id}`, {
        name: albumName.trim()
      });
      
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["albums"] });
        toast({
          title: "Album modificato",
          description: `Nome cambiato in "${albumName.trim()}"`
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nella modifica dell'album",
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
          <DialogTitle className="text-xl font-bold text-[#052b3e]">
            Modifica Album
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[#052b3e] font-medium">Nome Album:</Label>
            <Input
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Inserisci nuovo nome"
              className="border-gray-200 focus:border-[#05637b] focus:ring-[#05637b]"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading || !albumName.trim() || albumName.trim() === album?.name}
              className="bg-[#05637b] hover:bg-[#05637b]/90 text-white"
            >
              {isLoading ? 'Salvando...' : 'Salva'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
