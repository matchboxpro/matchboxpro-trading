import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ReportsFiltersProps {
  filters: {
    status: string;
    priority: string;
    type: string;
    page: number;
    limit: number;
  };
  onFiltersChange: (filters: any) => void;
  selectedReports: string[];
  onCopyToReplit: () => void;
}

export function ReportsFilters({ 
  filters, 
  onFiltersChange, 
  selectedReports, 
  onCopyToReplit 
}: ReportsFiltersProps) {
  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
        <SelectTrigger className="w-48 bg-white border-gray-300 text-[#052b3e] focus:border-[#05637b] focus:ring-[#05637b]">
          <SelectValue placeholder="Filtra per stato" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="all" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Tutti gli stati</SelectItem>
          <SelectItem value="nuovo" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Nuovo</SelectItem>
          <SelectItem value="aperto" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Aperto</SelectItem>
          <SelectItem value="inviato" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Inviato</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
        <SelectTrigger className="w-48 bg-white border-gray-300 text-[#052b3e] focus:border-[#05637b] focus:ring-[#05637b]">
          <SelectValue placeholder="Filtra per priorità" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="all" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10 data-[highlighted]:bg-[#05637b]/10 data-[highlighted]:text-[#052b3e]">Tutte le priorità</SelectItem>
          <SelectItem value="media" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10 data-[highlighted]:bg-[#05637b]/10 data-[highlighted]:text-[#052b3e]">🟡 Media</SelectItem>
          <SelectItem value="alta" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10 data-[highlighted]:bg-[#05637b]/10 data-[highlighted]:text-[#052b3e]">🔴 Alta</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
        <SelectTrigger className="w-48 bg-white border-gray-300 text-[#052b3e] focus:border-[#05637b] focus:ring-[#05637b]">
          <SelectValue placeholder="Filtra per tipo" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="all" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Tutti i tipi</SelectItem>
          <SelectItem value="user" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Segnalazione utente</SelectItem>
          <SelectItem value="error" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Errore generico</SelectItem>
          <SelectItem value="spam" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Spam</SelectItem>
          <SelectItem value="js_error" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Errore JavaScript</SelectItem>
          <SelectItem value="network_error" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Errore di rete</SelectItem>
          <SelectItem value="api_error" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Errore API</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={onCopyToReplit}
        disabled={selectedReports.length === 0}
        className="bg-[#f8b400] hover:bg-[#f8b400]/90 text-[#052b3e] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Crea Prompt Cascade ({selectedReports.length})
      </Button>
    </div>
  );
}
