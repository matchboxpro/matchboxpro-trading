import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AlbumCardProps {
  album: any;
  onEdit: (album: any) => void;
  onDelete: (album: any) => void;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="border-[#05637b]/20 hover:border-[#05637b]/40 transition-colors">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#052b3e] mb-2">
              {album.name}
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Figurine totali:</span> {album.totalStickers || 0}
              </p>
              <p>
                <span className="font-medium">Figurine possedute:</span> {album.ownedStickers || 0}
              </p>
              <p>
                <span className="font-medium">Completamento:</span>{' '}
                <span className={`font-medium ${
                  album.completionPercentage >= 100 
                    ? 'text-green-600' 
                    : album.completionPercentage >= 50 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                }`}>
                  {album.completionPercentage?.toFixed(1) || 0}%
                </span>
              </p>
              <p>
                <span className="font-medium">Creato:</span>{' '}
                {album.createdAt ? new Date(album.createdAt).toLocaleDateString('it-IT') : 'N/A'}
              </p>
            </div>
          </div>
          
          {album.completionPercentage >= 100 && (
            <div className="text-green-600 text-2xl" title="Album completato">
              ✅
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(album)}
            className="border-[#05637b] text-[#05637b] hover:bg-[#05637b] hover:text-white font-medium px-6"
          >
            Modifica
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete(album)}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium px-6"
          >
            Elimina
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
