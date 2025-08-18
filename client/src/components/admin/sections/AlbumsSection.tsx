import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ImageIcon } from 'lucide-react';

interface AlbumsSectionProps {
  albums: any[];
  isLoading: boolean;
  error: any;
  onNewAlbum: () => void;
  onManageStickers: (album: any) => void;
  onEditAlbum: (album: any) => void;
  onDeleteAlbum: (album: any) => void;
}

export const AlbumsSection: React.FC<AlbumsSectionProps> = ({
  albums,
  isLoading,
  error,
  onNewAlbum,
  onManageStickers,
  onEditAlbum,
  onDeleteAlbum
}) => {
  return (
    <div className="space-y-6">
      {/* Header with New Album Button */}
      <Card className="bg-[#05637b] border-0 shadow-lg">
        <CardHeader className="border-b border-white/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-2xl flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-[#f8b400]" />
              Gestione Album
            </CardTitle>
            <Button 
              onClick={onNewAlbum}
              className="bg-[#f8b400] hover:bg-[#f8b400]/90 text-[#052b3e] font-semibold px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuovo Album
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Albums List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8">
            <div className="text-[#052b3e]">Caricamento album...</div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="text-red-600">Errore nel caricamento degli album</div>
          </div>
        )}

        {!isLoading && !error && albums.map((album: any) => (
          <Card key={album.id} className="bg-white border border-[#05637b] shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#052b3e]">{album.name}</h3>
                  <p className="text-[#052b3e] font-medium text-sm">
                    <span className="text-lg font-bold">{album.stickerCount || 0}</span> figurine totali
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    className="bg-[#05637b] hover:bg-[#05637b]/90 text-white font-medium px-6"
                    onClick={() => onManageStickers(album)}
                  >
                    Gestisci
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEditAlbum(album)}
                    className="border-[#05637b] text-[#05637b] hover:bg-[#05637b] hover:text-white font-medium px-6"
                  >
                    Modifica
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDeleteAlbum(album)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium px-6"
                  >
                    Elimina
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {!isLoading && !error && albums.length === 0 && (
          <Card className="bg-white border border-[#05637b] shadow-lg">
            <CardContent className="p-8 text-center">
              <ImageIcon className="w-16 h-16 text-[#05637b]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#052b3e] mb-2">Nessun Album Trovato</h3>
              <p className="text-[#052b3e]/70 mb-4">
                Non ci sono album nel sistema. Crea il primo album per iniziare!
              </p>
              <Button 
                onClick={onNewAlbum}
                className="bg-[#05637b] hover:bg-[#05637b]/90 text-white font-medium px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crea Primo Album
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
