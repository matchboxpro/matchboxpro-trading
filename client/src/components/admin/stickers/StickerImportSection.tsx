import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileDown, Trash2 } from 'lucide-react';

interface StickerImportSectionProps {
  stickerList: string;
  setStickerList: (value: string) => void;
  paniniLink: string;
  setPaniniLink: (value: string) => void;
  onImport: () => void;
  onExport: () => void;
  onClear: () => void;
  stickersCount: number;
}

export const StickerImportSection: React.FC<StickerImportSectionProps> = ({
  stickerList,
  setStickerList,
  paniniLink,
  setPaniniLink,
  onImport,
  onExport,
  onClear,
  stickersCount
}) => {
  return (
    <div className="space-y-6 bg-[#f5f1e8] p-6 flex-shrink-0">
      {/* Textarea per incollare lista figurine */}
      <div>
        <p className="text-sm text-gray-600 mb-3">
          Incolla la lista delle figurine:
        </p>
        <Textarea
          placeholder="Incolla qui.."
          value={stickerList}
          onChange={(e) => setStickerList(e.target.value)}
          className="min-h-[150px] font-mono text-sm bg-[#faf8f3] border border-[#d4c5a9] focus:border-[#2c5f2d] focus:ring-1 focus:ring-[#2c5f2d] placeholder:text-gray-400"
        />
      </div>

      {/* Link Album Panini */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Link Album Panini:</p>
        <Input
          type="url"
          placeholder="https://www.panini.it/..."
          value={paniniLink}
          onChange={(e) => setPaniniLink(e.target.value)}
          className="mb-3 bg-[#faf8f3] border border-[#d4c5a9] focus:border-[#2c5f2d] focus:ring-1 focus:ring-[#2c5f2d]"
        />
      </div>

      {/* Pulsanti azione orizzontali */}
      <div className="flex gap-3">
        <Button 
          onClick={onImport}
          className="bg-[#2c5f2d] hover:bg-[#1e4220] text-white shadow-sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          Importa
        </Button>
        <Button 
          onClick={onExport}
          className="bg-[#059669] hover:bg-[#047857] text-white shadow-sm"
          disabled={stickersCount === 0}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Esporta
        </Button>
        <Button 
          onClick={onClear}
          className="bg-[#dc6803] hover:bg-[#c2410c] text-white shadow-sm"
          disabled={stickersCount === 0}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Svuota
        </Button>
      </div>
    </div>
  );
};
