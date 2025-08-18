import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface AlbumSelectorProps {
  albums: any[];
  onAlbumSelect: (albumId: string) => void;
}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({
  albums,
  onAlbumSelect
}) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header azzurro con logo - fixed */}
      <div className="bg-brand-azzurro border-b border-brand-azzurro p-2">
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
          <p className="text-[#05637b] text-lg">
            Seleziona un album per gestire la tua collezione di figurine
          </p>
        </div>

          <div className="grid gap-4 max-w-2xl mx-auto">
            {albums.map((album: any) => (
              <Card
                key={album.id}
                className="cursor-pointer hover:shadow-lg transition-all bg-white border-[#05637b] hover:border-[#f8b400]"
                onClick={() => onAlbumSelect(album.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#052b3e] mb-1">
                        {album.name}
                      </h3>
                      <span className="text-[#05637b] text-sm">
                        {album.stickerCount || 0} figurine
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#05637b]" />
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
