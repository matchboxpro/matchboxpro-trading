import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AlbumSelectorProps {
  albums: any[];
  onAlbumSelect: (albumId: string) => void;
}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({
  albums,
  onAlbumSelect
}) => {
  const [activeAlbums, setActiveAlbums] = useState<Set<string>>(() => {
    // Carica gli album attivati dal localStorage
    const saved = localStorage.getItem('activeAlbums');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleAlbumActive = (albumId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Previene il click sull'album
    setActiveAlbums(prev => {
      const newSet = new Set(prev);
      if (newSet.has(albumId)) {
        newSet.delete(albumId);
      } else {
        newSet.add(albumId);
      }
      // Salva nel localStorage
      localStorage.setItem('activeAlbums', JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleAlbumClick = (albumId: string) => {
    if (activeAlbums.has(albumId)) {
      onAlbumSelect(albumId);
    }
  };
  return (
    <div className="h-screen flex flex-col">
      {/* Header azzurro con logo - fixed */}
      <div className="bg-brand-azzurro border-b border-brand-azzurro pt-6 pb-4 px-2">
        <div className="flex items-center justify-center">
          <img 
            src="/matchbox-logo.png" 
            alt="MATCHBOX" 
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="text-center mb-8">
          <p className="text-[#05637b] text-sm leading-tight">
            Seleziona un album per gestire la tua collezione di figurine
          </p>
        </div>

          <div className="grid gap-4 max-w-2xl mx-auto">
            {albums.map((album: any) => (
              <Card
                key={album.id}
                className={`cursor-pointer hover:shadow-lg transition-all bg-white border-[#05637b] hover:border-[#f8b400] ${
                  !activeAlbums.has(album.id) ? 'opacity-60' : ''
                }`}
                onClick={() => handleAlbumClick(album.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-[#052b3e] mb-1">
                        {album.name}
                      </h3>
                      <span className="text-[#05637b] text-xs">
                        {album.stickerCount || 0} figurine
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className={`ml-3 px-3 py-1 text-xs font-semibold ${
                        activeAlbums.has(album.id)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                      onClick={(e) => toggleAlbumActive(album.id, e)}
                    >
                      {activeAlbums.has(album.id) ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {albums.length === 0 && (
              <div className="text-center py-12">
                <div className="text-[#05637b] text-lg">
                  Nessun album disponibile
                </div>
                <p className="text-[#05637b]/70 mt-2">
                  Gli album verranno mostrati qui quando saranno disponibili
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};
