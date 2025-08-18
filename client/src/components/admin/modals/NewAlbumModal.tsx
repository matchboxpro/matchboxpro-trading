import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface NewAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const NewAlbumModal: React.FC<NewAlbumModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [newAlbumName, setNewAlbumName] = useState("");
  const [newAlbumYear, setNewAlbumYear] = useState(2025);
  const [stickerCount, setStickerCount] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAlbumMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/albums", data);
      if (!response.ok) throw new Error("Errore nella creazione");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Album creato", description: "Operazione completata" });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      handleClose();
      onSuccess?.();
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nella creazione", variant: "destructive" });
    }
  });

  const handleClose = () => {
    setNewAlbumName("");
    setNewAlbumYear(2025);
    setStickerCount(1);
    onClose();
  };

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) {
      toast({ title: "Errore", description: "Inserisci il nome dell'album", variant: "destructive" });
      return;
    }

    createAlbumMutation.mutate({
      name: newAlbumName.trim(),
      year: newAlbumYear,
      stickerCount: stickerCount
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#052b3e]">
            Crea Nuovo Album
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[#052b3e] font-medium">Nome Album</Label>
            <Input
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              placeholder="Es. Calciatori Panini 2025"
              className="border-gray-200 focus:border-[#05637b] focus:ring-[#05637b]"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-[#052b3e] font-medium">Anno</Label>
            <Input
              type="number"
              value={newAlbumYear}
              onChange={(e) => setNewAlbumYear(parseInt(e.target.value) || 2025)}
              min="1900"
              max="2030"
              className="border-gray-200 focus:border-[#05637b] focus:ring-[#05637b]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#052b3e] font-medium">Numero Figurine Iniziali</Label>
            <Input
              type="number"
              value={stickerCount}
              onChange={(e) => setStickerCount(parseInt(e.target.value) || 1)}
              min="1"
              max="1000"
              className="border-gray-200 focus:border-[#05637b] focus:ring-[#05637b]"
            />
            <p className="text-sm text-gray-500">
              Puoi aggiungere più figurine dopo la creazione
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="outline"
              onClick={handleClose}
              disabled={createAlbumMutation.isPending}
            >
              Annulla
            </Button>
            <Button 
              onClick={handleCreateAlbum}
              disabled={createAlbumMutation.isPending || !newAlbumName.trim()}
              className="bg-[#05637b] hover:bg-[#05637b]/90 text-white"
            >
              {createAlbumMutation.isPending ? 'Creando...' : 'Crea Album'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
