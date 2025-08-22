import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ReportsFilters } from "./reports/ReportsFilters";
import { ReportsTable } from "./reports/ReportsTable";
import { ReportsModals } from "./reports/ReportsModals";
import { ReportsPagination } from "./reports/ReportsPagination";

export function ReportsSection() {
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    type: "all",
    page: 1,
    limit: 20,
  });
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [showReplitModal, setShowReplitModal] = useState(false);
  const [replitText, setReplitText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query per segnalazioni con paginazione e filtri
  const { data: reportsData, isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/reports", filters.status, filters.priority, filters.type, filters.page],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          console.log(`Adding filter: ${key} = ${value}`);
          params.set(key, String(value));
        }
      });
      console.log('Final URL params:', params.toString());
      
      const timestamp = Date.now();
      const response = await fetch(`/api/admin/reports?${params}&_t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      if (!response.ok) throw new Error("Errore nel caricamento segnalazioni");
      const data = await response.json();
      console.log('Frontend received data:', data);
      console.log('Frontend received reports count:', data?.reports?.length || 0);
      return data;
    },
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const reports = reportsData?.reports || [];
  const totalPages = reportsData?.totalPages || 1;
  const totalReports = reportsData?.total || 0;
  
  console.log('ReportsSection - Current filters:', filters);
  console.log('ReportsSection - Reports from query:', reports.length);
  console.log('ReportsSection - Total from backend:', totalReports);

  // Force refetch when filters change
  useEffect(() => {
    console.log('Filters changed, forcing refetch:', filters);
    queryClient.removeQueries({ queryKey: ["/api/admin/reports"] });
    refetch();
  }, [filters, refetch, queryClient]);

  // Mutation per aggiornare segnalazioni
  const updateReportMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { status?: string; priority?: string } }) => {
      const response = await apiRequest("PUT", `/api/admin/reports/${id}`, updates);
      if (!response.ok) throw new Error("Errore nell'aggiornamento");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      toast({ title: "Segnalazione aggiornata", description: "La segnalazione è stata aggiornata con successo" });
    },
    onError: () => {
      toast({ title: "Errore", description: "Errore nell'aggiornamento della segnalazione", variant: "destructive" });
    },
  });

  // Mutation per eliminare segnalazioni
  const deleteReportsMutation = useMutation({
    mutationFn: async (reportIds: string[]) => {
      try {
        const response = await fetch('/api/admin/reports/bulk', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ reportIds }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Errore nell'eliminazione: ${response.status} - ${errorText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/reports"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/reports"] });
      setSelectedReports([]);
      toast({ 
        title: "✅ Eliminazione completata", 
        description: `${variables.length} segnalazioni eliminate con successo`,
        duration: 4000
      });
    },
    onError: (error) => {
      toast({ 
        title: "❌ Errore eliminazione", 
        description: `Impossibile eliminare le segnalazioni: ${error.message}`, 
        variant: "destructive",
        duration: 5000
      });
    },
  });

  // Funzioni di utilità
  const toggleReportSelection = (reportId: string) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const selectAllReports = () => {
    setSelectedReports(reports.map((r: any) => r.id));
  };

  const clearSelection = () => {
    setSelectedReports([]);
  };

  const viewReportDetails = (report: any) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const updateReportStatus = (id: string, status: string) => {
    updateReportMutation.mutate({ id, updates: { status } });
  };

  const updateReportPriority = (id: string, priority: string) => {
    updateReportMutation.mutate({ id, updates: { priority } });
  };

  const deleteSelectedReports = () => {
    if (selectedReports.length === 0) {
      toast({ 
        title: "⚠️ Nessuna selezione", 
        description: "Seleziona almeno una segnalazione da eliminare",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    // Usa window.confirm per compatibilità cross-browser
    const confirmed = window.confirm(`Sei sicuro di voler eliminare ${selectedReports.length} segnalazioni selezionate?\n\nQuesta azione non può essere annullata.`);
    if (confirmed) {
      deleteReportsMutation.mutate(selectedReports);
    }
  };

  const copySelectedToReplit = () => {
    generateReplitText();
  };

  const generateReplitText = () => {
    const selectedReportsData = reports.filter((r: any) => selectedReports.includes(r.id));
    
    const text = `# 🚨 MATCHBOX Error Reports - Debug Prompt for Cascade

## Context
- **Project**: MatchboxPro (MATCHBOX) - Trading cards web app
- **Stack**: React + TypeScript + Express + Supabase
- **Location**: /Users/dero/Documents/MatchboxPro_Portable/matchboxpro_current
- **Generated**: ${new Date().toLocaleString("it-IT")}
- **Reports Count**: ${selectedReportsData.length}

## 📋 Error Reports to Analyze

${selectedReportsData.map((report: any, index: number) => 
`### Error ${index + 1}: ${report.type.toUpperCase()}

**Description**: ${report.description}
**Page**: ${report.page || "N/A"}
**User**: ${report.reporter?.nickname || "Anonymous"} (ID: ${report.reporterId || "N/A"})
**Status**: ${report.status} | **Priority**: ${report.priority}
**Timestamp**: ${new Date(report.createdAt).toLocaleString("it-IT")}

${report.errorDetails ? `**Technical Details**:
\`\`\`
${report.errorDetails}
\`\`\`
` : ""}
**URL**: ${report.url || "N/A"}
**User Agent**: ${report.userAgent || "N/A"}

---`
).join("\n\n")}

## 🎯 Request for Cascade

Please analyze these error reports and:

1. **Identify root causes** of the reported errors
2. **Suggest specific fixes** with file paths and code changes
3. **Prioritize fixes** based on impact and frequency
4. **Check for patterns** across multiple reports
5. **Provide implementation steps** respecting the modular architecture

## 📁 Key Files to Consider
- Frontend: \`/client/src/pages/\` and \`/client/src/components/\`
- Backend: \`/server/routes.ts\` and \`/server/storage.ts\`
- Shared: \`/shared/schema.ts\`

## 🔧 Architecture Notes
- Modular components (max 300 lines per file)
- React Query for data fetching
- Supabase PostgreSQL database
- Express.js API with session auth

Ready to debug these issues systematically.`;

    setReplitText(text);
    setShowReplitModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header con titolo e icona */}
      <div className="bg-[#05637b] border-0 shadow-lg rounded-lg p-6">
        <h2 className="flex items-center gap-3 text-white text-xl font-bold">
          <AlertTriangle className="w-6 h-6 text-[#f8b400]" />
          Segnalazioni
        </h2>
      </div>

      {/* Filtri */}
      <ReportsFilters
        filters={filters}
        onFiltersChange={setFilters}
        selectedReports={selectedReports}
        onCopyToReplit={copySelectedToReplit}
      />


      {/* Tabella segnalazioni */}
      <ReportsTable
        reports={reports}
        isLoading={isLoading}
        selectedReports={selectedReports}
        onToggleSelection={toggleReportSelection}
        onSelectAll={selectAllReports}
        onClearSelection={clearSelection}
        onViewDetails={viewReportDetails}
        onUpdateStatus={updateReportStatus}
        onUpdatePriority={updateReportPriority}
        onDeleteSelected={deleteSelectedReports}
      />

      {/* Paginazione */}
      <ReportsPagination
        currentPage={filters.page}
        totalPages={totalPages}
        totalReports={totalReports}
        onPageChange={(page) => setFilters({ ...filters, page })}
      />

      {/* Modals */}
      <ReportsModals
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        selectedReport={selectedReport}
        showReplitModal={showReplitModal}
        setShowReplitModal={setShowReplitModal}
        replitText={replitText}
      />
    </div>
  );
}