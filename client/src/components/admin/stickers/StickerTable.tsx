import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

interface StickerTableProps {
  stickers: any[];
  onEditSticker: (sticker: any, index: number) => void;
  onDeleteSticker: (sticker: any, index: number) => void;
}

export const StickerTable: React.FC<StickerTableProps> = ({
  stickers,
  onEditSticker,
  onDeleteSticker
}) => {
  return (
    <div className="bg-[#faf8f3] rounded-lg border border-[#d4c5a9] p-4 flex-1 min-h-0 flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-[#2c5f2d] flex-shrink-0">Figurine ({stickers.length})</h3>
      
      {stickers.length > 0 ? (
        <div className="flex-1 min-h-0 overflow-auto border rounded-lg">
          <Table className="bg-white border border-[#d4c5a9] rounded-md">
            <TableHeader className="sticky top-0 bg-[#e8dcc6] z-10">
              <TableRow className="bg-[#e8dcc6] border-b border-[#d4c5a9]">
                <TableHead className="text-[#2c5f2d] font-semibold">Numero</TableHead>
                <TableHead className="text-[#2c5f2d] font-semibold">Descrizione</TableHead>
                <TableHead className="text-[#2c5f2d] font-semibold">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stickers.map((sticker: any, index: number) => (
                <TableRow key={sticker.id || index} className="border-b border-[#e8dcc6] hover:bg-[#faf8f3]">
                  <TableCell className="font-mono text-[#2c5f2d]">{sticker.number}</TableCell>
                  <TableCell className="text-gray-700">{sticker.name || sticker.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={() => onEditSticker(sticker, index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => onDeleteSticker(sticker, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 flex-1 flex flex-col justify-center">
          <div className="text-[#a0a0a0] mb-2">📋</div>
          <p className="text-[#6b7280]">Nessuna figurina presente</p>
          <p className="text-sm text-[#9ca3af]">Importa le figurine per iniziare</p>
        </div>
      )}
    </div>
  );
};
