import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useStickerMutations = (albumId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mutation per salvare figurine
  const saveStickers = useMutation({
    mutationFn: async (stickersData: any[]) => {
      const response = await fetch(`/api/albums/${albumId}/stickers/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stickers: stickersData
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save error:', response.status, errorData);
        throw new Error(errorData.message || 'Errore nel salvare le figurine');
      }
      
      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums", albumId, "stickers"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast({ title: "Figurine salvate", description: "Le figurine sono state salvate nel database" });
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nel salvare le figurine", variant: "destructive" });
    }
  });

  // Mutation per aggiornare singola figurina
  const updateSticker = useMutation({
    mutationFn: async ({ stickerId, stickerData }: { stickerId: string; stickerData: any }) => {
      const response = await fetch(`/api/albums/${albumId}/stickers/${stickerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stickerData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Errore nell\'aggiornare la figurina');
      }
      
      return response.json();
    },
    onSuccess: (updatedSticker) => {
      // Aggiorna la cache locale immediatamente
      queryClient.setQueryData(["albums", albumId, "stickers"], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.map(sticker => 
          sticker.id === updatedSticker.id ? updatedSticker : sticker
        );
      });
      queryClient.invalidateQueries({ queryKey: ["albums", albumId, "stickers"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    }
  });

  // Mutation per eliminare singola figurina
  const deleteSingleSticker = useMutation({
    mutationFn: async (stickerId: string) => {
      const response = await fetch(`/api/albums/${albumId}/stickers/${stickerId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Errore nell\'eliminare la figurina');
      }
      
      return { stickerId };
    },
    onSuccess: ({ stickerId }) => {
      // Rimuovi la figurina dalla cache locale immediatamente
      queryClient.setQueryData(["albums", albumId, "stickers"], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.filter(sticker => sticker.id !== stickerId);
      });
      queryClient.invalidateQueries({ queryKey: ["albums", albumId, "stickers"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
    }
  });

  // Mutation per eliminare tutte le figurine
  const deleteStickers = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/albums/${albumId}/stickers`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete error:', response.status, errorData);
        throw new Error(errorData.message || 'Errore nell\'eliminare le figurine');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["albums", albumId, "stickers"] });
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      toast({ title: "Lista svuotata", description: "Tutte le figurine sono state rimosse dal database" });
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nell'eliminare le figurine", variant: "destructive" });
    }
  });

  return {
    saveStickers,
    updateSticker,
    deleteSingleSticker,
    deleteStickers
  };
};
