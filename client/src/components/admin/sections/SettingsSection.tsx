import React from 'react';
import { Settings, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SettingsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-[#05637b] border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center gap-3">
            <Settings className="w-6 h-6 text-[#f8b400]" />
            Impostazioni
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="bg-[#05637b] border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#f8b400]" />
            Configurazione Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-white font-medium mb-2 block">
              Modalità Mantenimento Dati
            </Label>
            <Select defaultValue="automatic">
              <SelectTrigger className="bg-white border-white text-[#052b3e] hover:bg-gray-50">
                <SelectValue placeholder="Seleziona modalità" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="automatic" className="text-[#052b3e] hover:bg-[#05637b]/10">Automatico</SelectItem>
                <SelectItem value="manual" className="text-[#052b3e] hover:bg-[#05637b]/10">Manuale</SelectItem>
                <SelectItem value="disabled" className="text-[#052b3e] hover:bg-[#05637b]/10">Disabilitato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium mb-2 block">
              Livello di Log
            </Label>
            <Select defaultValue="info">
              <SelectTrigger className="bg-white border-white text-[#052b3e] hover:bg-gray-50">
                <SelectValue placeholder="Seleziona livello" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="debug" className="text-[#052b3e] hover:bg-[#05637b]/10">Debug</SelectItem>
                <SelectItem value="info" className="text-[#052b3e] hover:bg-[#05637b]/10">Info</SelectItem>
                <SelectItem value="warn" className="text-[#052b3e] hover:bg-[#05637b]/10">Warning</SelectItem>
                <SelectItem value="error" className="text-[#052b3e] hover:bg-[#05637b]/10">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-white font-medium mb-2 block">
              Backup Automatici
            </Label>
            <Select defaultValue="enabled">
              <SelectTrigger className="bg-white border-white text-[#052b3e] hover:bg-gray-50">
                <SelectValue placeholder="Stato backup" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="enabled" className="text-[#052b3e] hover:bg-[#05637b]/10">Abilitato</SelectItem>
                <SelectItem value="disabled" className="text-[#052b3e] hover:bg-[#05637b]/10">Disabilitato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-white/20">
            <Button className="bg-[#f8b400] hover:bg-[#f8b400]/90 text-[#052b3e] font-semibold">
              <Save className="w-4 h-4 mr-2" />
              Salva Impostazioni
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
