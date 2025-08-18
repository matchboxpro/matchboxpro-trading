import React from 'react';
import { AlbumCard } from '../cards/AlbumCard';

interface AlbumListProps {
  albums: any[];
  isLoading: boolean;
  error: any;
  onEdit: (album: any) => void;
  onDelete: (album: any) => void;
}

export const AlbumList: React.FC<AlbumListProps> = ({
  albums,
  isLoading,
  error,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-[#052b3e]">Caricamento album...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600">Errore nel caricamento degli album</div>
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Nessun album trovato</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          album={album}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
