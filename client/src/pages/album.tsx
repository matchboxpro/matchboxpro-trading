import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AlbumSelector } from "@/components/album/AlbumSelector";
import { AlbumHeader } from "@/components/album/AlbumHeader";
import { StickerGrid } from "@/components/album/StickerGrid";
import { StickerDetailDialog } from "@/components/album/StickerDetailDialog";

export default function Album() {
  const [location, setLocation] = useLocation();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "mine" | "missing" | "double">("all");
  const [expandedSticker, setExpandedSticker] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset album selection when navigating back to album page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reset = params.get('reset');
    if (reset === 'true') {
      setSelectedAlbum(null);
      // Clean URL
      window.history.replaceState({}, '', '/album');
    }
  }, [location]);

  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: () => fetch('/api/auth/me', { credentials: 'include' }).then(res => res.json()),
    staleTime: 5 * 60 * 1000, // 5 minuti cache
  });

  // Get all albums from admin con cache aggressiva
  const { data: albums = [] } = useQuery({
    queryKey: ["/api/albums"],
    queryFn: () => fetch('/api/albums', { credentials: 'include' }).then(res => res.json()),
    staleTime: 10 * 60 * 1000, // 10 minuti cache
  });

  const { data: userStickers = [] } = useQuery({
    queryKey: ["/api/user-stickers", selectedAlbum],
    queryFn: () => fetch(`/api/user-stickers/${selectedAlbum}`, { credentials: 'include' }).then(res => res.json()),
    enabled: !!selectedAlbum,
    staleTime: 2 * 60 * 1000, // 2 minuti cache
  });

  const { data: stickers = [] } = useQuery({
    queryKey: ["/api/albums", selectedAlbum, "stickers"],
    queryFn: () => fetch(`/api/albums/${selectedAlbum}/stickers`, { credentials: 'include' }).then(res => res.json()),
    enabled: !!selectedAlbum,
    staleTime: 10 * 60 * 1000, // Cache aggressiva - le figurine non cambiano spesso
  });

  // Prefetch ottimizzato: precaricare solo album attivo
  useEffect(() => {
    if (albums.length > 0 && !selectedAlbum) {
      // Prefetch solo primo album (quello più probabile da selezionare)
      const firstAlbum = albums[0];
      if (firstAlbum) {
        queryClient.prefetchQuery({
          queryKey: ["/api/albums", firstAlbum.id, "stickers"],
          queryFn: () => fetch(`/api/albums/${firstAlbum.id}/stickers`, { credentials: 'include' }).then(res => res.json()),
          staleTime: 30 * 60 * 1000, // Cache più aggressiva
        });
      }
    }
  }, [albums, selectedAlbum, queryClient]);

  const updateStickerMutation = useMutation({
    mutationFn: async ({ stickerId, status }: { stickerId: string; status: "yes" | "no" | "double" }) => {
      const response = await apiRequest("POST", "/api/user-stickers", { 
        stickerId, 
        status,
        albumId: selectedAlbum 
      });
      return response.json();
    },
    onMutate: async ({ stickerId, status }) => {
      // Ottimizzazione: aggiornamento ottimistico per UI istantanea
      await queryClient.cancelQueries({ queryKey: ["/api/user-stickers", selectedAlbum] });
      
      const previousData = queryClient.getQueryData(["/api/user-stickers", selectedAlbum]);
      
      queryClient.setQueryData(["/api/user-stickers", selectedAlbum], (old: any) => {
        if (!old) return old;
        
        const existingIndex = old.findIndex((us: any) => us.stickerId === stickerId);
        if (existingIndex >= 0) {
          // Aggiorna esistente
          const newData = [...old];
          newData[existingIndex] = { ...newData[existingIndex], status };
          return newData;
        } else {
          // Aggiungi nuovo
          return [...old, { stickerId, status, userId: user?.id }];
        }
      });
      
      return { previousData };
    },
    onError: (error: any, variables, context) => {
      // Rollback in caso di errore
      if (context?.previousData) {
        queryClient.setQueryData(["/api/user-stickers", selectedAlbum], context.previousData);
      }
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento",
        variant: "destructive",
      });
    },
    onSettled: () => {
      // Sincronizza con il server
      queryClient.invalidateQueries({ queryKey: ["/api/user-stickers", selectedAlbum] });
    },
  });

  // Ottimizzazione: Auto-set batch più intelligente per velocità
  const autoSetMissingMutation = useMutation({
    mutationFn: async () => {
      // Trova solo le figurine che non hanno ancora uno stato
      const stickersWithoutStatus = stickers.filter((sticker: any) => {
        return !userStickers.find((us: any) => us.stickerId === sticker.id);
      });
      
      if (stickersWithoutStatus.length === 0) return;
      
      // Batch più piccoli per migliori performance (max 20 alla volta)
      const batchSize = 20;
      const batches = [];
      for (let i = 0; i < stickersWithoutStatus.length; i += batchSize) {
        batches.push(stickersWithoutStatus.slice(i, i + batchSize));
      }
      
      // Processa batch sequenzialmente per evitare sovraccarico DB
      for (const batch of batches) {
        const promises = batch.map((sticker: any) => {
          return apiRequest("POST", "/api/user-stickers", { 
            stickerId: sticker.id, 
            status: "no",
            albumId: selectedAlbum 
          });
        });
        await Promise.all(promises);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-stickers", selectedAlbum] });
    },
  });

  // Auto-set solo quando ci sono figurine senza stato - ottimizzato per evitare auto-set inutili
  useEffect(() => {
    if (!selectedAlbum || !stickers.length || userStickers.length >= stickers.length) return;
    
    const stickersWithoutStatus = stickers.filter((sticker: any) => {
      return !userStickers.find((us: any) => us.stickerId === sticker.id);
    });
    
    // Solo se ci sono molte figurine senza stato (evita micro-batch inutili)
    if (stickersWithoutStatus.length > 10 && !autoSetMissingMutation.isPending) {
      autoSetMissingMutation.mutate();
    }
  }, [stickers, userStickers, selectedAlbum]);

  const getUserStickerStatus = (stickerId: string) => {
    const userSticker = (userStickers as any[]).find((us: any) => us.stickerId === stickerId);
    return userSticker?.status || "no";
  };

  // If no album selected, show album selection
  if (!selectedAlbum) {
    return (
      <div className="min-h-screen bg-[#fff4d6] p-8">
        <AlbumSelector
          albums={albums as any[]}
          onAlbumSelect={setSelectedAlbum}
        />
      </div>
    );
  }

  const selectedAlbumData = (albums as any[]).find((a: any) => a.id === selectedAlbum);

  return (
    <div className="h-screen bg-[#05637b] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4">
        <AlbumHeader
          album={selectedAlbumData}
          stickers={stickers as any[]}
          userStickers={userStickers as any[]}
          filter={filter}
          onFilterChange={setFilter}
          onBack={() => setSelectedAlbum(null)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <StickerGrid
          stickers={stickers as any[]}
          userStickers={userStickers as any[]}
          filter={filter}
          onStickerClick={setExpandedSticker}
          onUpdateSticker={(stickerId, status) => 
            updateStickerMutation.mutate({ stickerId, status })
          }
        />
      </div>

      <StickerDetailDialog
        sticker={expandedSticker}
        isOpen={!!expandedSticker}
        onClose={() => setExpandedSticker(null)}
        status={expandedSticker ? getUserStickerStatus(expandedSticker.id) : "no"}
        onUpdateSticker={(stickerId, status) => 
          updateStickerMutation.mutate({ stickerId, status })
        }
      />
    </div>
  );
}
