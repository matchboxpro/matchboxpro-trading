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
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
        <SelectTrigger className="w-48 bg-white border-gray-300 text-[#052b3e] focus:border-[#05637b] focus:ring-[#05637b]">
          <SelectValue placeholder="Filtra per stato" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="all" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Tutti gli stati</SelectItem>
          <SelectItem value="open" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Aperto</SelectItem>
          <SelectItem value="in_progress" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">In corso</SelectItem>
          <SelectItem value="resolved" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Risolto</SelectItem>
          <SelectItem value="closed" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Chiuso</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority} onValueChange={(value) => updateFilter("priority", value)}>
        <SelectTrigger className="w-48 bg-white border-gray-300 text-[#052b3e] focus:border-[#05637b] focus:ring-[#05637b]">
          <SelectValue placeholder="Filtra per priorità" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="all" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Tutte le priorità</SelectItem>
          <SelectItem value="low" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Bassa</SelectItem>
          <SelectItem value="medium" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Media</SelectItem>
          <SelectItem value="high" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Alta</SelectItem>
          <SelectItem value="critical" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Critica</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
        <SelectTrigger className="w-48 bg-white border-gray-300 text-[#052b3e] focus:border-[#05637b] focus:ring-[#05637b]">
          <SelectValue placeholder="Filtra per tipo" />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-300">
          <SelectItem value="all" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Tutti i tipi</SelectItem>
          <SelectItem value="bug" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Bug</SelectItem>
          <SelectItem value="feature" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Richiesta feature</SelectItem>
          <SelectItem value="api_error" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Errore API</SelectItem>
          <SelectItem value="user" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Segnalazione utente</SelectItem>
          <SelectItem value="error" className="text-[#052b3e] hover:bg-[#05637b]/10 focus:bg-[#05637b]/10">Errore generico</SelectItem>
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
