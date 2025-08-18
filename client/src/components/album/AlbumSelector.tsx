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
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#052b3e] mb-4">
          I Tuoi Album
        </h1>
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
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#052b3e] mb-2">
                    {album.name}
                  </h3>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-[#05637b]">
                      {album.year}
                    </Badge>
                    <span className="text-[#05637b] text-sm">
                      {album.stickerCount || 0} figurine
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-[#05637b]" />
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
  );
};
