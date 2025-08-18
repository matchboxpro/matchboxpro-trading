import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { StickerImportSection } from '../stickers/StickerImportSection';
import { StickerTable } from '../stickers/StickerTable';
import { EditStickerDialog } from '../stickers/EditStickerDialog';
import { DeleteStickerDialog } from '../stickers/DeleteStickerDialog';
import { useStickerMutations } from '../stickers/StickerMutations';

interface StickerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: any;
}

export const StickerManagementModal: React.FC<StickerManagementModalProps> = ({
  isOpen,
  onClose,
  album
}) => {
  const [stickerList, setStickerList] = useState("");
  const [paniniLink, setPaniniLink] = useState("https://www.panini.it/...");
  const [stickers, setStickers] = useState<any[]>([]);
  const [editStickerDialog, setEditStickerDialog] = useState<{ show: boolean; sticker: any; index: number }>({ show: false, sticker: null, index: -1 });
  const [editStickerDescription, setEditStickerDescription] = useState("");
  const [deleteStickerDialog, setDeleteStickerDialog] = useState<{ show: boolean; sticker: any; index: number }>({ show: false, sticker: null, index: -1 });
  const { toast } = useToast();
  const { saveStickers, updateSticker, deleteSingleSticker, deleteStickers } = useStickerMutations(album?.id);

  // Carica figurine esistenti dall'album
  const { data: existingStickers = [] } = useQuery({
    queryKey: ["albums", album?.id, "stickers"],
    queryFn: async () => {
      if (!album?.id) return [];
      const response = await fetch(`/api/albums/${album.id}/stickers`, {
        credentials: 'include'
      });
      if (response.ok) {
        return response.json();
      }
      return [];
    },
    enabled: !!album?.id && isOpen
  });

  // Aggiorna stickers quando cambiano i dati
  useEffect(() => {
    if (existingStickers.length > 0) {
      setStickers(existingStickers);
    }
  }, [existingStickers]);


  // Parse sticker list from textarea
  const parseStickers = () => {
    const lines = stickerList.split('\n').filter(line => line.trim());
    const parsed = lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.includes(' - ')) {
        const parts = trimmed.split(' - ');
        return {
          number: parts[0],
          name: parts.slice(1).join(' - '), // Schema richiede 'name' non 'description'
          team: null // Campo opzionale
        };
      }
      return null;
    }).filter(Boolean);
    
    if (parsed.length > 0) {
      // Salva nel database
      saveStickers.mutate(parsed);
      setStickers([...stickers, ...parsed]);
      setStickerList(""); // Pulisce la textarea dopo l'import
      toast({ title: "Figurine importate", description: `${parsed.length} figurine aggiunte` });
    }
  };

  const handleExport = () => {
    if (stickers.length === 0) {
      toast({ title: "Nessuna figurina", description: "Non ci sono figurine da esportare", variant: "destructive" });
      return;
    }

    const exportData = stickers.map(s => `${s.number} - ${s.name || s.description}`).join('\n');
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `figurine_${album.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleClear = () => {
    if (stickers.length > 0) {
      deleteStickers.mutate();
      setStickers([]);
    }
    setStickerList("");
  };

  if (!album) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#f5f1e8] border-[#d4c5a9] flex flex-col">
        <DialogHeader className="bg-[#f5f1e8] border-b border-[#d4c5a9] pb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-[#e8dcc6]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-[#2c5f2d] font-semibold">Gestisci Figurine - {album.name}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Import Section */}
          <StickerImportSection
            stickerList={stickerList}
            setStickerList={setStickerList}
            paniniLink={paniniLink}
            setPaniniLink={setPaniniLink}
            onImport={parseStickers}
            onExport={handleExport}
            onClear={handleClear}
            stickersCount={stickers.length}
          />

          {/* Sticker Table */}
          <StickerTable
            stickers={stickers}
            onEditSticker={(sticker, index) => {
              setEditStickerDialog({ show: true, sticker, index });
              setEditStickerDescription(sticker.name || sticker.description || "");
            }}
            onDeleteSticker={(sticker, index) => {
              setDeleteStickerDialog({ show: true, sticker, index });
            }}
          />
        </div>
      </DialogContent>

      {/* Edit Sticker Dialog */}
      <EditStickerDialog
        isOpen={editStickerDialog.show}
        onClose={() => {
          setEditStickerDialog({ show: false, sticker: null, index: -1 });
          setEditStickerDescription("");
        }}
        sticker={editStickerDialog.sticker}
        description={editStickerDescription}
        setDescription={setEditStickerDescription}
        onSave={async () => {
          if (editStickerDescription.trim() !== "" && editStickerDialog.sticker?.id) {
            try {
              await updateSticker.mutateAsync({
                stickerId: editStickerDialog.sticker.id,
                stickerData: {
                  name: editStickerDescription.trim(),
                  description: editStickerDescription.trim()
                }
              });
              toast({ 
                title: "Figurina modificata", 
                description: "Descrizione aggiornata nel database" 
              });
              setEditStickerDialog({ show: false, sticker: null, index: -1 });
              setEditStickerDescription("");
            } catch (error) {
              toast({ 
                title: "Errore", 
                description: "Errore nell'aggiornare la figurina", 
                variant: "destructive" 
              });
            }
          }
        }}
        isSaving={updateSticker.isPending}
      />

      {/* Delete Sticker Dialog */}
      <DeleteStickerDialog
        isOpen={deleteStickerDialog.show}
        onClose={() => {
          setDeleteStickerDialog({ show: false, sticker: null, index: -1 });
        }}
        sticker={deleteStickerDialog.sticker}
        onDelete={async () => {
          if (deleteStickerDialog.sticker?.id) {
            try {
              await deleteSingleSticker.mutateAsync(deleteStickerDialog.sticker.id);
              toast({ 
                title: "Figurina eliminata", 
                description: `Figurina ${deleteStickerDialog.sticker?.number} eliminata dal database` 
              });
              setDeleteStickerDialog({ show: false, sticker: null, index: -1 });
            } catch (error) {
              toast({ 
                title: "Errore", 
                description: "Errore nell'eliminare la figurina", 
                variant: "destructive" 
              });
            }
          }
        }}
        isDeleting={deleteSingleSticker.isPending}
      />
    </Dialog>
  );
};
