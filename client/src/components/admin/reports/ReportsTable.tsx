import { AlertTriangle, Eye, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ReportsTableProps {
  reports: any[];
  isLoading: boolean;
  selectedReports: string[];
  onToggleSelection: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onViewDetails: (report: any) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onUpdatePriority: (id: string, priority: string) => void;
}

export function ReportsTable({
  reports,
  isLoading,
  selectedReports,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onViewDetails,
  onUpdateStatus,
  onUpdatePriority
}: ReportsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800 border-red-200";
      case "in_progress": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-[#05637b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#052b3e]/60">Caricamento segnalazioni...</p>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-[#052b3e] text-lg">Nessuna segnalazione trovata</p>
          <p className="text-[#052b3e]/60 text-sm mt-2">Non ci sono segnalazioni al momento</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Azioni multiple */}
      {selectedReports.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="border-gray-300 text-[#052b3e] hover:bg-gray-50"
            >
              Seleziona tutti
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              className="border-gray-300 text-[#052b3e] hover:bg-gray-50"
            >
              Deseleziona
            </Button>
            <span className="text-[#052b3e]/70 text-sm">
              {selectedReports.length} di {reports.length} selezionate
            </span>
          </div>
        </div>
      )}

      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedReports.length === reports.length}
                    onCheckedChange={(checked) => {
                      if (checked) onSelectAll();
                      else onClearSelection();
                    }}
                  />
                </TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Tipo</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Descrizione</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Pagina</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Utente</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Data</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Stato</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Priorità</TableHead>
                <TableHead className="text-[#052b3e] font-semibold">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report: any) => (
                <TableRow key={report.id} className="border-gray-200 hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => onToggleSelection(report.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className="border-[#05637b] text-[#05637b] bg-[#05637b]/5"
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="space-y-1">
                      <div className="text-sm text-[#052b3e] truncate font-medium" title={report.description}>
                        {report.description}
                      </div>
                      {report.error_details && (
                        <div className="text-xs text-[#052b3e]/60 truncate" title={report.error_details}>
                          {report.error_details}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[#052b3e]/80">{report.page || "N/A"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[#052b3e]/80">{report.user_id || "Anonimo"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-[#052b3e]/80">
                      {new Date(report.created_at).toLocaleDateString("it-IT")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(report)}
                        className="h-8 w-8 p-0 text-[#05637b] hover:bg-[#05637b]/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateStatus(report.id, "in_progress")}
                        className="h-8 w-8 p-0 text-[#05637b] hover:bg-[#05637b]/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
